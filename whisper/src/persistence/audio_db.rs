
use async_trait::async_trait;
use chrono::{Utc, Duration, TimeZone, NaiveTime, NaiveDate, DateTime};
use futures::TryStreamExt;
use uuid::Uuid;
use crate::error::{Result, ServerError};
use crate::ml::whisper::AudioDataDTO;
use mongodb::Collection;
use mongodb::bson::{doc, oid::ObjectId, Document};

use super::db::MongoDbClient;
const DB_NAME: &str = "human-assistant";
const COLL_NAME: &str = "metadata";

#[async_trait]
pub trait AudioInterface { 
    async fn get_all_entries() -> Result<Vec<AudioDataDTO>>;
    async fn add_entry(meta: &AudioDataDTO) -> Result<AudioDataDTO>;
    async fn delete_all_entries() -> Result<()>;
    async fn delete_one_entry(id: &str) -> Result<Option<AudioDataDTO>>;
    async fn get_entry(id: &str) -> Result<AudioDataDTO>;
    async fn update_entry(id: &str, updated_meta: &AudioDataDTO) -> Result<AudioDataDTO>;
    async fn get_recent() -> Result<Vec<AudioDataDTO>>;
    async fn get_all_by_date(date: DateTime<Utc>) -> Result<Vec<AudioDataDTO>>;
    async fn get_all_by_week_number(week_number: i32) -> Result<Vec<AudioDataDTO>>; 
    
    fn get_collection() -> Collection<AudioDataDTO>;
}

#[derive(Debug)]
pub struct AudioDB;

#[async_trait]
impl AudioInterface for AudioDB { 

    /// Gets all audio entries from the user 
    #[tracing::instrument(fields(repository = "AudioDataDTO"), level= "debug", err)]
    async fn get_all_entries() -> Result<Vec<AudioDataDTO>> {
        let collection = AudioDB::get_collection();
        let filter = doc! {};
        let mut result = Vec::new();
        let mut doc = collection.find(filter, None).await?;
        
        while let Some(doc) = doc.try_next().await? {
            result.push(doc);
        }
        Ok(result)
    }
    ///
    /// Add new entry 
    #[tracing::instrument(fields(repository = "AudioDataDTO"), level= "debug", err)]
    async fn add_entry(meta: &AudioDataDTO) -> Result<AudioDataDTO> {
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
    async fn delete_one_entry(id: &str) -> Result<Option<AudioDataDTO>> {
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
    async fn get_entry(id: &str) -> Result<AudioDataDTO> {
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
    async fn update_entry(id: &str, updated_meta: &AudioDataDTO) -> Result<AudioDataDTO> {
        
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
    /// Retrieves the current day audio entries from 00:00:00 to 24:00:00 
    #[tracing::instrument(level= "debug", err)]
    async fn get_recent() -> Result<Vec<AudioDataDTO>> { 
        let collection = AudioDB::get_collection();
        let mut result = Vec::new();

        let now_chrono = Utc::now().date_naive();

        // Set to date - 00:00:00 to 24:00:00
        let start_of_day = now_chrono
            .and_hms_opt(0, 0, 0)
            .unwrap();

        let end_of_day = now_chrono
            .and_hms_opt(23, 59, 59)
            .unwrap();

        // Convert into local timezone 
        let start_time: chrono::DateTime<Utc> =  Utc.from_utc_datetime(&start_of_day);
        let end_time: chrono::DateTime<Utc> =  Utc.from_utc_datetime(&end_of_day);

        let bson_start_time = bson::DateTime::from_chrono(start_time);
        let bson_end_time = bson::DateTime::from_chrono(end_time);
        
        // Filter 
        let filter = doc! { 
            "date": { 
                "$gte": bson_start_time,
                "$lt": bson_end_time,
            } 
        };      

        // let filter = doc! {};
        // Get the matching document 
        let mut doc = collection.find(filter, None).await?;
        
        while let Some(doc) = doc.try_next().await? {
            result.push(doc);
        }

        log::info!("{result:#?}");

        Ok(result)
    }

    ///
    /// Retrieve entries by a specific date 
    /// input: January 1, 2023
    async fn get_all_by_date(date: DateTime<Utc>) -> Result<Vec<AudioDataDTO>> {
        let collection = AudioDB::get_collection();
        let mut result = Vec::new();

        // Set to date - 00:00:00 to 24:00:00
        let start_of_day = date
            .date_naive()
            .and_hms_opt(0, 0, 0)
            .unwrap();

        let end_of_day = date
            .date_naive() 
            .and_hms_opt(23, 59, 59)
            .unwrap();

        // Convert into local timezone 
        let start_time: chrono::DateTime<Utc> =  Utc.from_utc_datetime(&start_of_day);
        let end_time: chrono::DateTime<Utc> =  Utc.from_utc_datetime(&end_of_day);

        let bson_start_time = bson::DateTime::from_chrono(start_time);
        let bson_end_time = bson::DateTime::from_chrono(end_time);
        
        // Filter 
        let filter = doc! { 
            "date": { 
                "$gte": bson_start_time,
                "$lt": bson_end_time,
            } 
        };      

        // let filter = doc! {};
        // Get the matching document 
        let mut doc = collection.find(filter, None).await?;
        
        while let Some(doc) = doc.try_next().await? {
            result.push(doc);
        }

        log::info!("{result:#?}");

        Ok(result)
    }

    ///
    /// Retrieve all entries by the week number 
    async fn get_all_by_week_number(week_number: i32) -> Result<Vec<AudioDataDTO>> { 
        let collection = AudioDB::get_collection();
        let mut result = Vec::new();
        let filter = doc! { "week_number": week_number};
        
        let mut doc = collection.find(filter, None).await?;
        
        while let Some(doc) = doc.try_next().await? {
            result.push(doc);
        }

        Ok(result)
    }

    ///
    /// Access collection from database
    fn get_collection() -> Collection<AudioDataDTO> {
        MongoDbClient::get_collection::<AudioDataDTO>(COLL_NAME, DB_NAME)
    }
}   