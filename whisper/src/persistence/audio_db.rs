
use async_trait::async_trait;
use chrono::{Utc, Duration, TimeZone, NaiveTime};
use futures::TryStreamExt;
use uuid::Uuid;
use crate::error::{Result, ServerError};
use crate::ml::whisper::AudioData;
use mongodb::Collection;
use mongodb::bson::{doc, oid::ObjectId, DateTime, Document};

use super::db::MongoDbClient;
const DB_NAME: &str = "human-assistant";
const COLL_NAME: &str = "metadata";

#[async_trait]
pub trait AudioInterface { 
    async fn add_entry(meta: &AudioData) -> Result<AudioData>;
    async fn delete_all_entries() -> Result<()>;
    async fn delete_one_entry(id: &str) -> Result<Option<AudioData>>;
    async fn get_entry(id: &str) -> Result<AudioData>;
    async fn update_entry(id: &str, updated_meta: &AudioData) -> Result<AudioData>;
    async fn get_recent() -> Result<Vec<AudioData>>;
    fn get_collection() -> Collection<AudioData>;
}

#[derive(Debug)]
pub struct AudioDB;

#[async_trait]
impl AudioInterface for AudioDB { 

    ///
    /// Add new entry 
    #[tracing::instrument(fields(repository = "AudioData"), level= "debug", err)]
    async fn add_entry(meta: &AudioData) -> Result<AudioData> {
        let collection = AudioDB::get_collection();
        let insert_res = collection
            .insert_one(meta, None)
            .await?;
        let filter = doc! {"_id": &insert_res.inserted_id};

        collection.find_one(filter, None)
            .await?
            .ok_or(ServerError::NotFound(format!("{:?}", meta.id.to_owned())))
    }

    ///
    /// Clear Database 
    #[tracing::instrument(level= "debug", err)]
    async fn delete_all_entries() -> Result<()> {
        let collection = AudioDB::get_collection();
        let filter = doc! {};
        collection.delete_many(filter, None).await?;

        Ok(())
    }

    ///
    /// Delete one entry 
    #[tracing::instrument(fields(id), level= "debug", err)]
    async fn delete_one_entry(id: &str) -> Result<Option<AudioData>> {
        let collection = AudioDB::get_collection();

        let filter = doc! {"_id" : id};

        let item = collection.find_one_and_delete(filter, None)
            .await?
            .ok_or(ServerError::NotFound(format!("{id}")))?;

        Ok(Some(item))
    }

    ///
    /// Get entry by Id 
    #[tracing::instrument(fields(id), level= "debug", err)]
    async fn get_entry(id: &str) -> Result<AudioData> {
        let collection = AudioDB::get_collection();

        let filter = doc! { "_id": &id};
        
        collection
            .find_one(filter, None)
            .await?
            .ok_or(ServerError::NotFound(format!("{id}")))

    }

    ///
    /// Update entry from id 
    #[tracing::instrument(fields(id,updated_meta), level= "debug", err)]
    async fn update_entry(id: &str, updated_meta: &AudioData) -> Result<AudioData> {
        
        log::info!("{updated_meta:#?}");
        
        let collection = AudioDB::get_collection();
        let filter = doc! { "_id" : id.to_owned()};
        let update = doc! { "$set" : bson::to_document(updated_meta).unwrap()};
        let _ = collection.update_one(filter, update, None).await?;

        let query = doc! { "_id" : id.to_owned()};

        collection.find_one(query, None)
            .await?
            .ok_or(ServerError::NotFound(format!("{id}")))
    }

    ///
    /// Retrieves current day audio entries 
    #[tracing::instrument(level= "debug", err)]
    async fn get_recent() -> Result<Vec<AudioData>> { 
        let collection = AudioDB::get_collection();
        let mut result = Vec::new();
        let now_chrono = Utc::now();

        // Set to 00:00:00
        let today = now_chrono
            .date_naive()
            .and_hms_opt(0,0, 0)
            .unwrap();

        let date_time: chrono::DateTime<Utc> =  Utc.from_utc_datetime(&today);
        log::info!(" {date_time:?}");
        let bson_date_time = bson::DateTime::from_chrono(date_time);
        let filter = doc! { "date": { "$gte": bson_date_time } };
        
        // let filter = doc! {};
        // Get the matching document 
        let mut doc = collection.find(filter, None).await?;
        
        while let Some(doc) = doc.try_next().await? {
            result.push(doc);
        }

        log::info!("{result:#?}");

        Ok(result)
    }


    /// Access collection from database
    fn get_collection() -> Collection<AudioData> {
        MongoDbClient::get_collection::<AudioData>(COLL_NAME, DB_NAME)
    }
}   