use crate::error::ServerError;
use crate::{error::Result, ml::weekly_pattern::WeeklyAnalysis};
use async_trait::async_trait;
use chrono::{Utc, Duration, Local, TimeZone, NaiveDateTime, NaiveDate};
use mongodb::{Collection, Cursor};
use mongodb::bson::{doc, oid::ObjectId, };
use super::{db::MongoDbClient};

const DB_NAME: &str = "human-assistant";
const COLL_NAME: &str = "weekly";

#[async_trait]
pub trait WeeklyAnalysisInterface { 
    async fn add_analysis(new_analysis: &WeeklyAnalysis) -> Result<WeeklyAnalysis>;
    async fn delete_one_analysis(id: ObjectId) -> Result<Option<WeeklyAnalysis>>;
    async fn delete_all_entries() -> Result<bool>;
    async fn get_one_analysis(id: ObjectId) -> Result<WeeklyAnalysis>;
    async fn get_corresponding_week(start_date: NaiveDateTime) -> Result<Option<WeeklyAnalysis>>;
    fn get_analysis_db() -> Collection<WeeklyAnalysis>;

}


#[derive(Debug)]
pub struct WeeklyAnalysisDB;

impl WeeklyAnalysisDB { 
    /// Get the first value for testing purposes 
    pub async fn get_first_item() -> Result<Option<WeeklyAnalysis>> { 

        let collection = WeeklyAnalysisDB::get_analysis_db();
        
        let filter = doc! {};
        let item = collection.find_one(filter, None).await?;
        Ok(item)
    }   
}

#[async_trait]
impl WeeklyAnalysisInterface for WeeklyAnalysisDB {
    ///
    /// Retrieve one weekly analysis on id 
    #[tracing::instrument(fields(id), level= "debug", err)]
    async fn get_one_analysis(id: ObjectId) -> Result<WeeklyAnalysis> {
        let collection = WeeklyAnalysisDB::get_analysis_db();

        let filter = doc! { "_id": &id};
        
        collection
            .find_one(filter, None)
            .await?
            .ok_or(ServerError::NotFound(format!("{id}")))

    }
    ///
    /// Add new weekly analysis db 
    #[tracing::instrument(fields(new_analysis), level= "debug", err)]
    async fn add_analysis(new_analysis: &WeeklyAnalysis) -> Result<WeeklyAnalysis> {
        log::info!("✅ Saving Analysis to database {new_analysis:#?}");
        let collection = WeeklyAnalysisDB::get_analysis_db();
        let item = collection.insert_one(new_analysis, None).await?;

        log::info!("{item:#?}");

        let filter = doc! {"_id": &item.inserted_id};

        let res = collection.find_one(filter, None).await?.unwrap();

        Ok(res)
    }

    ///
    /// Delete all entries on weekly analysis db 
    #[tracing::instrument(level= "debug", err)]
    async fn delete_all_entries() -> Result<bool> {
        let collection = WeeklyAnalysisDB::get_analysis_db();

        let filter = doc! {};

        collection.delete_many(filter, None).await?;

        Ok(true)
    }
    ///
    /// Delete one entry 
    #[tracing::instrument(fields(id), level= "debug", err)]
    async fn delete_one_analysis(id: ObjectId) -> Result<Option<WeeklyAnalysis>> {
        let collection = WeeklyAnalysisDB::get_analysis_db();

        let filter = doc! {"_id" : id};

        let item = collection.find_one_and_delete(filter, None)
            .await?
            .ok_or(ServerError::NotFound(format!("{id}")))?;

        Ok(Some(item))
    }

    /// 
    /// Daily call this function to retrieve the current week
    #[tracing::instrument(fields(id), level= "debug", err)]
    async fn get_corresponding_week(start_date: NaiveDateTime) -> Result<Option<WeeklyAnalysis>> { 

        let collection = WeeklyAnalysisDB::get_analysis_db();

        let s_date_time: chrono::DateTime<Local> =  Local.from_local_datetime(&start_date).unwrap();
        let bson_s_date_time = bson::DateTime::from_chrono(s_date_time);
        
        let filter = doc! { 
            "start_week": { 
                "$lte": bson_s_date_time.clone(),
            },
            "end_week": { 
                "$gte": bson_s_date_time.clone()
            }
        };

        let res = collection.find_one(filter, None).await?;

        Ok(res)
    }

    ///
    /// Access to weekly collection 
    fn get_analysis_db() -> Collection<WeeklyAnalysis> {
        MongoDbClient::get_collection::<WeeklyAnalysis>(COLL_NAME, DB_NAME)
    }
   
}