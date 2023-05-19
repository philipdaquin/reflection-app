
use async_trait::async_trait;
use bson::Bson;
use chrono::{Utc, Duration, TimeZone, NaiveTime, NaiveDate, DateTime, Datelike, Weekday};
use futures::TryStreamExt;
use uuid::Uuid;
use crate::error::{Result, ServerError};
use crate::ml::whisper::AudioDataDTO;
use mongodb::Collection;
use mongodb::bson::{doc, oid::ObjectId, Document};

use super::db::MongoDbClient;
use super::get_current_week;
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
    async fn get_all_by_week(date: DateTime<Utc>) -> Result<Vec<AudioDataDTO>>; 
    async fn get_current_week() -> Result<Vec<AudioDataDTO>>; 
    async fn update_fields() -> Result<Vec<AudioDataDTO>>;
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

        // log::info!("{result:#?}");

        Ok(result)
    }

    ///
    /// Retrieve entries by a specific date 
    /// input: January 1, 2023
    #[tracing::instrument(level= "debug", err)]
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

        // log::info!("{result:#?}");

        Ok(result)
    }

    ///
    /// Retrieve all entries by week. 
    /// 
    /// Finds the corresponding week using a specific date 
    /// and retrieves all Audio Entries within this week  
    #[tracing::instrument(level= "debug", err)]
    async fn get_all_by_week(date: DateTime<Utc>) -> Result<Vec<AudioDataDTO>> { 
        let collection = AudioDB::get_collection();
        
        let iso_week = date.date_naive().iso_week();
        
        // Get the dates from the start to the end of the week 
        let start_week = NaiveDate::from_isoywd_opt(iso_week.year(), iso_week.week(), Weekday::Mon)
            .unwrap()
            .and_hms_opt(0,0, 0)
            .unwrap();
        let end_week = NaiveDate::from_isoywd_opt(iso_week.year(), iso_week.week(), Weekday::Sun)
            .unwrap()
            .and_hms_opt(0,0, 0)
            .unwrap();

        // Into date time 
        let start_date_time: chrono::DateTime<Utc> =  Utc.from_utc_datetime(&start_week);
        let end_date_time: chrono::DateTime<Utc> =  Utc.from_utc_datetime(&end_week);
        
        // Into bson 
        let bson_start_date = bson::DateTime::from_chrono(start_date_time);
        let bson_end_date = bson::DateTime::from_chrono(end_date_time);
   
        let filter = doc! { 
            "date": { 
                "$gte": bson_start_date,
                "$lt": bson_end_date,
            } 
        };  


        let mut result = vec![];
        let mut doc = collection.find(filter, None).await?;
        
        while let Some(doc) = doc.try_next().await? {
            result.push(doc);
        }

        Ok(result)
    }

    ///
    /// Retrieves all audio entries by the current week 
    #[tracing::instrument(level= "debug", err)]
    async fn get_current_week() -> Result<Vec<AudioDataDTO>> { 
        let collection = AudioDB::get_collection();

        let (bson_start_date, bson_end_date) = get_current_week();
        let filter = doc! { 
            "date": { 
                "$gte": bson_start_date,
                "$lt": bson_end_date,
            } 
        };  

        let mut result = vec![];
        let mut doc = collection.find(filter, None).await?;
        
        while let Some(doc) = doc.try_next().await? {
            result.push(doc);
        }
        Ok(result)
    }

    /// 
    /// 
    /// Update the current fields in the object and then return all the new updated items 
    async fn update_fields() -> Result<Vec<AudioDataDTO>> { 
        let collection = AudioDB::get_collection();
        let query = doc! {};

        // New fields 
        let update = doc!{
            "$set": {
                "audio_url": Bson::Null
            }
        };  

        let _ = collection.update_many(query, update, None).await?;
        let filter = doc! {};

        let mut results = vec![];
        let mut doc = collection.find(filter, None).await?;

        while let Some(item) = doc.try_next().await? { 
            results.push(item);
        }
        Ok(results)
    }

    

    ///
    /// Access collection from database
    #[tracing::instrument(level= "debug")]
    fn get_collection() -> Collection<AudioDataDTO> {
        MongoDbClient::get_collection::<AudioDataDTO>(COLL_NAME, DB_NAME)
    }
}   