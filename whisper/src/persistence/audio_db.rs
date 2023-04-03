
use async_trait::async_trait;
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
    async fn detete_one(id: &str) -> Result<()>;
    async fn get_entry(id: &str) -> Result<AudioData>;
    async fn update_entry(id: &str, updated_meta: &AudioData) -> Result<AudioData>;
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
            .ok_or(ServerError::NotFound(format!("{}", meta.id.to_string())))
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
    async fn detete_one(id: &str) -> Result<()> {
        let collection = AudioDB::get_collection();

        let filter = doc! {"_id" : id};

        collection.find_one_and_delete(filter, None)
            .await?
            .ok_or(ServerError::NotFound(format!("{id}")))?;

        Ok(())
    }

    ///
    /// Get entry by Id 
    #[tracing::instrument(fields(id), level= "debug", err)]
    async fn get_entry(id: &str) -> Result<AudioData> {
        let collection = AudioDB::get_collection();

        let filter = doc! { "_id": id};
        
        collection
            .find_one(filter, None)
            .await?
            .ok_or(ServerError::NotFound(format!("{id}")))

    }

    ///
    /// Update entry from id 
    #[tracing::instrument(fields(id,updated_meta), level= "debug", err)]
    async fn update_entry(id: &str, updated_meta: &AudioData) -> Result<AudioData> {
        let collection = AudioDB::get_collection();
        let filter = doc! { "_id" : id.to_owned()};
        let update = doc! { "$set" : bson::to_document(updated_meta).unwrap()};
        let _ = collection.update_one(filter, update, None).await?;

        let query = doc! { "_id" : id.to_owned()};

        collection.find_one(query, None)
            .await?
            .ok_or(ServerError::NotFound(format!("{id}")))
    }
    /// Access collection from database
    fn get_collection() -> Collection<AudioData> {
        MongoDbClient::get_collection::<AudioData>(COLL_NAME, DB_NAME)
    }
}   