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
    fn get_analysis_db() -> Collection<TextClassification>;
    async fn get_most_common_emotions() -> Result<Vec<TopMood>>;
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
    #[tracing::instrument(fields(repository = "TextAnalysis", id), level= "debug", err)]
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
        let doc = collection.aggregate(pipeline, None).await.unwrap();
        let mut result = Vec::new();

        while let Some(doc) = doc.try_next().await? {
            result.push(doc);
        }


        // // Print the results
        // for result in results {
        //     println!("Emotion: {}", result.emotion);
        //     for day in result.days {
        //         println!("\t{}: {:.2}%", day.day, day.percentage);
        //     }
        // }
        
        todo!()
    }

    /// Access to collection
    fn get_analysis_db() -> Collection<TextClassification> { 
       MongoDbClient::get_collection::<TextClassification>(COLL_NAME, DB_NAME)
    }
}