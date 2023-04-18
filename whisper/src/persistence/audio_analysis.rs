use async_trait::async_trait;
use chrono::{Utc, Duration, TimeZone};
use mongodb::{Collection, Cursor};
use mongodb::bson::{doc, oid::ObjectId, DateTime};
use mongodb::options::AggregateOptions;
use crate::ml::text_classification::TopMood;
use crate::{error::Result, ml::text_classification::TextClassification};
use super::db::MongoDbClient;
use futures_util::{TryStreamExt, StreamExt};
const DB_NAME: &str = "human-assistant";
const COLL_NAME: &str = "analysis";

#[async_trait]
pub trait TextAnalysisInterface { 
    async fn add_analysis(new_analysis: TextClassification) -> Result<TextClassification>;
    async fn delete_one_analysis(id: ObjectId) -> Result<Option<TextClassification>>;
    async fn get_recent() -> Result<Vec<TextClassification>>;
    async fn get_most_common_emotions() -> Result<Vec<TopMood>>;
    async fn delete_all_entries() -> Result<bool>;
    fn get_analysis_db() -> Collection<TextClassification>;
}
#[derive(Debug)]
pub struct AnalysisDb;

impl AnalysisDb { 

    ///
    /// Returns the total number of document found within the last 7 days 
    pub async fn count_documents_in_seven_days() -> Result<Option<u64>> { 
        let collection = AnalysisDb::get_analysis_db();
        let seven_days_ago = Utc::now() - Duration::days(7);
        let bson_date_time = bson::DateTime::from_chrono(seven_days_ago);

        let filter = doc! { "date": { "$gte": bson_date_time } };
        
        let total_records = collection.count_documents(filter, None).await?;

        Ok(Some(total_records))
    }   

    ///
    /// Retrieves data points from the last seven days 
    #[tracing::instrument(level= "debug", err)]
    pub async fn get_data_set_in_last_seven_days() -> Result<Vec<TextClassification>> {
        let collection = AnalysisDb::get_analysis_db();
        let seven_days_ago = Utc::now() - Duration::days(7);
        let bson_date_time = bson::DateTime::from_chrono(seven_days_ago);

        // Get all objects in database within the 7 days 
        let pipeline = vec![
            // Match documents within the last 7 days
            doc! {
                "$match": {
                    "date": {
                        "$gte": bson_date_time
                    }
                }
            },
            // Project the desired fields
            doc! {
                "$project": {
                    "_id": 1,
                    "_audio_id": 1,
                    "date": 1,
                    "day": 1,
                    "emotion": 1,
                    "emotion_emoji": 1,
                    "average_mood": 1
                }
            }
        ];
        // Aggregate all data points into one 
        let mut result = Vec::new();
        let mut cursor = collection.aggregate(pipeline, None).await?;
        while let Some(doc) = cursor.try_next().await? {
            let bson = bson::from_document(doc.clone()).unwrap();
            let object: TextClassification = bson::from_bson(bson).unwrap_or_default();

            // Ensure the average mood of each object is non null
            if object.average_mood.is_some() { 
                result.push(object);
            }
        }
        log::info!("DATA WITHIN THE LAST 7 DAYS: {result:?}");

        Ok(result)
    }
}


#[async_trait]
impl TextAnalysisInterface for AnalysisDb { 
    ///
    /// Retrieves Text Classification Analyses from the last 7 days 
    #[tracing::instrument(fields(repository = "TextAnalysis", id), level= "debug", err)]
    async fn get_recent() -> Result<Vec<TextClassification>> {
        log::info!("Retrieving recent dataset...");
        let mut result = Vec::with_capacity(10);
        let collection = AnalysisDb::get_analysis_db();

        let seven_days_ago = Utc::now() - Duration::days(7);
        let bson_date_time = bson::DateTime::from_chrono(seven_days_ago);
        let filter = doc! { "date": { "$gte": bson_date_time } };
        
        // let filter = doc! { };
        
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

        log::info!("{item:#?}");

        let filter = doc! {"_id": &item.inserted_id};

        let res = collection.find_one(filter, None).await?.unwrap();

        Ok(res)
    }
    /// Delete Analysis 
    #[tracing::instrument(fields(repository = "TextAnalysis", id), level= "debug", err)]
    async fn delete_one_analysis(id: ObjectId) -> Result<Option<TextClassification>> {
        log::info!("✅ Deleting Text Classification analysis");
        let collection = AnalysisDb::get_analysis_db();

        let filter = doc! {"_id": &id};        
        
        let item = collection
            .find_one_and_delete(filter, None)
            .await?;
        Ok(item)
    }

    /// Aggregate the top 3 most commonly mood / emotion over the week 
    #[tracing::instrument(level= "debug", err)]
    async fn get_most_common_emotions() -> Result<Vec<TopMood>> {
        let collection = AnalysisDb::get_analysis_db();
        let seven_days_ago = Utc::now() - Duration::days(7);
        let bson_date_time = bson::DateTime::from_chrono(seven_days_ago);

        // Aggregate the top 3 most commonly recorded mood/emotion over the week or days
        let pipeline = vec![
            // Filter for documents within the last 7 days
            doc! {

                "$match": {
                    "date": {
                        "$gte": bson_date_time
                    },

                    "emotion": {"$ne": null},
                }
            },
            // Group by emotion and count the number of occurrences
            doc! {
                "$group": {
                    "_id": {
                        "emotion": "$emotion", 
                        "emotion_emoji": "$emotion_emoji",
                    },
                    "count": {"$sum": 1}
                }
            },
            // Sort by count in descending order
            doc! {"$sort": {"count": -1}},

            // TESTING PURPOSES
            // doc! {"$sort": {"count": 1}},
            // Limit to top 3 emotions
            doc! {"$limit": 3},

            // Project the result to the desired format
            doc! {
                "$project": {
                    "_id": 0,
                    "emotion": "$_id.emotion",
                    "emotion_emoji": "$_id.emotion_emoji",
                    "count": 1
                }
            }
          
        ];
        let options = AggregateOptions::builder().build();
    
        // Execute the aggregation pipeline and retrieve the results 
        let mut doc = collection.aggregate(pipeline, options).await.unwrap();
        
        // Calculate the total number of records  
        // Testing purposes 
        let default = collection.count_documents(None, None).await?;
        
        let total_records = AnalysisDb::count_documents_in_seven_days()
            .await?
            .unwrap_or(default);
        
        let mut result = Vec::new();
    
        // Map the aggregated results 
        while let Some(item) = doc.try_next().await? {
            let count = item.get_i32("count").unwrap_or(0) as f32;
            let percent = count / total_records as f32 * 100.0;
            let emotion = item.get_str("emotion").unwrap_or_default().to_string();
            let emoji = item.get_str("emotion_emoji").unwrap_or_default().to_string();
            result.push(TopMood::new(Some(emoji), Some(emotion), Some(percent)));
        }
        log::info!("{result:#?}");

    
        Ok(result)
    }
    
    ///
    /// Cleans out the collection 
    #[tracing::instrument(level= "debug", err)]
    async fn delete_all_entries() -> Result<bool> {
        let collection = AnalysisDb::get_analysis_db();

        let filter = doc! {};

        collection.delete_many(filter, None).await?;

        Ok(true)
    }
    ///
    /// Access to collection
    fn get_analysis_db() -> Collection<TextClassification> { 
       MongoDbClient::get_collection::<TextClassification>(COLL_NAME, DB_NAME)
    }
}