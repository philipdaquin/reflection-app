use actix_multipart::form::text::Text;
use async_trait::async_trait;
use chrono::{Utc, Duration};
use mongodb::{Collection, Cursor};
use mongodb::bson::{doc, oid::ObjectId, DateTime};
use mongodb::options::AggregateOptions;
use crate::ml::text_classification::TopMood;
use crate::{error::Result, ml::text_classification::TextClassification};
use super::db::MongoDbClient;
use futures_util::TryStreamExt;

const DB_NAME: &str = "human-assistant";
const COLL_NAME: &str = "analysis";

#[async_trait]
pub trait TextAnalysisInterface { 
    async fn add_analysis(new_analysis: TextClassification) -> Result<TextClassification>;
    async fn delete_analysis(id: ObjectId) -> Result<()>;
    async fn get_recent() -> Result<Vec<TextClassification>>;
    async fn get_most_common_emotions() -> Result<Vec<TopMood>>;
    async fn get_inflect_point_of_mood_in_week() -> Result<Option<TextClassification>>;
    async fn get_min_max_points_in_week() -> Result<Vec<TextClassification>>;
    fn get_analysis_db() -> Collection<TextClassification>;
    
}
#[derive(Debug)]
pub struct AnalysisDb;

#[async_trait]
impl TextAnalysisInterface for AnalysisDb { 
    ///
    /// Retrieves items from the last 7 days 
    #[tracing::instrument(fields(repository = "TextAnalysis", id), level= "debug", err)]
    async fn get_recent() -> Result<Vec<TextClassification>> {
        log::info!("Retrieving recent dataset...");
        let mut result = Vec::with_capacity(10);
        let collection = AnalysisDb::get_analysis_db();
        let today = Utc::now();
        // let seven_days_ago = today - chrono::Duration::days(7);
        let seven_days_ago = today;
        let in_bson = bson::DateTime::from_chrono(seven_days_ago);
        // let filter = doc! { "date": { "$gte": in_bson } };
        let filter = doc! { "day": "Monday" };
        
        // Get the matching document 
        let mut doc = collection.find(filter, None).await?;
        
        while let Some(doc) = doc.try_next().await? {
            result.push(doc);
        }

        Ok(result)
    }
    /// Insert new Analysis 
    #[tracing::instrument(fields(repository = "TextAnalysis", id), level= "debug", err)]
    async fn add_analysis(new_analysis: TextClassification) -> Result<TextClassification> {
        log::info!("✅ Saving Analysis to database {new_analysis:#?}");
        let collection = AnalysisDb::get_analysis_db();
        let item = collection.insert_one(new_analysis, None).await?;
        
        let filter = doc! {"_id": &item.inserted_id};

        let res = collection.find_one(filter, None).await?.unwrap();

        Ok(res)
    }
    /// Delete Analysis 
    #[tracing::instrument(fields(repository = "TextAnalysis", id), level= "debug", err)]
    async fn delete_analysis(id: ObjectId) -> Result<()> {
        let collection = AnalysisDb::get_analysis_db();

        let filter = doc! {"_id": &id};        
        
        collection
            .find_one_and_delete(filter, None)
            .await?
            .unwrap();
        Ok(())
    }

    /// Aggregate the top 3 most commonly mood / emotion over the week 
    #[tracing::instrument(level= "debug", err)]
    async fn get_most_common_emotions() -> Result<Vec<TopMood>> {
        let collection = AnalysisDb::get_analysis_db();
        
         // Aggregate the top 3 most commonly recorded mood/emotion over the week or days
        let pipeline = vec![
            // Match documents with non-null emotion field
            doc! {"$match": {"emotion": {"$ne": null}}},
            // Group by emotion and day, and count the number of documents in each group
            doc! {
                "$group": {
                    "_id": {
                        "emotion": "$emotion",
                        "day": "$day"
                    },
                    "count": {"$sum": 1}
                }
            },
            // Sort by count in descending order
            doc! {"$sort": {"count": -1}},
            // Group by emotion and calculate the percentage of days each emotion was recorded
            doc! {
                "$group": {
                    "_id": "$_id.emotion",
                    "days": {
                        "$push": {
                            "day": "$_id.day",
                            "percentage": {
                                "$multiply": [
                                    {"$divide": ["$count", {"$count": "$_id.day"}]},
                                    100
                                ]
                            }
                        }
                    },
                    "total_count": {"$sum": "$count"}
                }
            },
            // Sort by total count in descending order
            doc! {"$sort": {"total_count": -1}},
            // Limit to top 3 emotions
            doc! {"$limit": 3},
            // Project only the emotion and days fields
            doc! {"$project": {"_id": 0, "emotion": "$_id", "days": 1}},
        ];

        // Execute the aggregation pipeline and retrieve the results 
        let mut doc = collection.aggregate(pipeline, None).await.unwrap();
        
        // Calculate the total number of record  
        let total_records = collection.count_documents(None, None).await?;
        let mut result = Vec::new();

        // Map the aggregated results 
        while let Some(item) = doc.try_next().await? { 
            let count = item.get_i32("count").unwrap_or(0);
            let percentage = count as f32 / total_records as f32 * 100.0;
            let emotion = item
                .get_str("emotion").map(|f| f.to_string())
                .ok()
                .clone();
            let emoji = item
                .get_str("emotion_emoji").map(|f| f.to_string())
                .ok()
                .clone();

            result.push(TopMood::new(emoji, emotion, Some(percentage)));
       } 

        Ok(result)
    }

    /// Get the biggest difference in averageMood within the last 7 days 
    #[tracing::instrument(level= "debug", err)]
    async fn get_inflect_point_of_mood_in_week() -> Result<Option<TextClassification>> {
        let collection = AnalysisDb::get_analysis_db();
        let seven_days_ago = Utc::now() - Duration::days(7);

         // Aggregate by day and calculate average mood for each day
        let pipeline = vec![
            doc! {"$match": {"$and": [{"date": {"$gte": seven_days_ago}}, {"emotion": {"$ne": null}}]}}, // Filter out documents with null emotion and date greater than or equal to 7 days ago
            doc! {
                "$group": {
                    "_id": "$date",
                    "average_mood": { "$avg": "$average_mood" }
                }
            },
            doc! {
                "$sort": {
                    "_id": 1
                }
            }
        ];
        
        // Aggregate all data points into one 
        let mut result = Vec::new();
        let mut cursor = collection.aggregate(pipeline, None).await?;
        while let Some(doc) = cursor.try_next().await? {
            let bson = bson::from_document(doc.clone()).unwrap();
            let object: TextClassification = bson::from_bson(bson).unwrap();
            result.push(object);
        }

        // Find the inflection point by checking for the first and second derivatives changing sign
        let mut first_derivative_sign = None;
        let mut second_derivative_sign = None;
        let mut inflection_point = None;

        //
        //  Calculate first_derivative, second_derivative and inflection_point 
        for i in 1..result.len() {
            let first_derivative = result[i].average_mood.unwrap() - result[i-1].average_mood.unwrap();
            let second_derivative = first_derivative - (result[i-1].average_mood.unwrap() - result[i-2].average_mood.unwrap());
            
            if first_derivative_sign.is_none() && first_derivative != 0.0 {
                first_derivative_sign = Some(first_derivative.signum());
            }
            
            if second_derivative_sign.is_none() && second_derivative != 0.0 {
                second_derivative_sign = Some(second_derivative.signum());
            }

            // If an inflection point is found,
            // Break the loop and set the index to that point 
            if let Some(first_sign) = first_derivative_sign {
                if let Some(second_sign) = second_derivative_sign {
                    if first_sign != first_derivative.signum() && second_sign != second_derivative.signum() {
                        inflection_point = Some(&result[i-1]);
                        break;
                    }
                }
            }
        }
        // Find the textclassification with the inflection point 
        if let Some(inflection_doc) = inflection_point {
            let inflection_date = inflection_doc.id;
            // Find the TextClassification document with the inflection index within the last 7 days
            let inflection_textclassification = collection
                .find_one(doc! {"$and": [{"date": inflection_date}, {"date": {"$gte": seven_days_ago}}]}, None)
                .await?;

            Ok(inflection_textclassification)
        } else {
            Ok(None)
        }
        
    }

    /// Get the min and max TextClassification objects within the last 7 days 
    async fn get_min_max_points_in_week() -> Result<Vec<TextClassification>> {
        let collection = AnalysisDb::get_analysis_db();
        let start_of_week = Utc::now() - Duration::days(7);
        let end_of_week = Utc::now();

        let pipeline = vec![
            doc! {"$match": {
                "date": {
                    "$gte": start_of_week,
                    "$lte": end_of_week
                },
                "emotion": {"$ne": null},
                "average_mood": {"$ne": null}
            }},
            doc! {"$sort": {"average_mood": 1}},
            doc! {"$group": {
                "_id": null,
                "min": {"$first": "$$ROOT"},
                "max": {"$last": "$$ROOT"}
            }},
            doc! {"$project": {
                "_id": 0,
                "min": 1,
                "max": 1
            }},
        ];

        // Execute the aggregation pipeline and retrieve the results 
        let mut cursor = collection.aggregate(pipeline, None).await.unwrap();
        let mut result = Vec::new();
        
        while let Some(item) = cursor.try_next().await? { 
            if let Some(doc)  = item.get("min").unwrap().as_document() { 
                let bson = bson::from_document(doc.clone()).unwrap();
                let object: TextClassification = bson::from_bson(bson).unwrap();
                result.push(object);
            } 
            if let Some(doc)  = item.get("max").unwrap().as_document() { 
                let bson = bson::from_document(doc.clone()).unwrap();
                let object: TextClassification = bson::from_bson(bson).unwrap();
                result.push(object);
            } 
        } 

        Ok(result)        
    }


    /// Access to collection
    fn get_analysis_db() -> Collection<TextClassification> { 
       MongoDbClient::get_collection::<TextClassification>(COLL_NAME, DB_NAME)
    }
}