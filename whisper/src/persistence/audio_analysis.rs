use actix_multipart::form::text::Text;
use async_trait::async_trait;
use chrono::{Utc, Duration};
use mongodb::Collection;
use mongodb::bson::{doc, oid::ObjectId, DateTime};
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
}
#[derive(Debug)]
pub struct AnalysisDb;

#[async_trait]
impl TextAnalysisInterface for AnalysisDb { 
    ///
    /// Retrieves items from the last 7 days 
    #[tracing::instrument(fields(repository = "TextAnalysis", id), level= "debug", err)]
    async fn get_recent() -> Result<Vec<TextClassification>> {
        let mut result = Vec::new();
        let collection = AnalysisDb::get_analysis_db();
        let today = Utc::now();
        let seven_days_ago = today - chrono::Duration::days(7);
        let in_bson = bson::DateTime::from_chrono(seven_days_ago);
        let filter = doc! { "date": { "$gte": in_bson } };
        
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
    /// Access to collection
    fn get_analysis_db() -> Collection<TextClassification> { 
       MongoDbClient::get_collection::<TextClassification>(COLL_NAME, DB_NAME)
    }
}