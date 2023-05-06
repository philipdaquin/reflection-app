use async_trait::async_trait;
use bson::{doc, oid::ObjectId, Document};
use chrono::{DateTime, Utc, NaiveDate, TimeZone};
use futures_util::TryStreamExt;
use mongodb::Collection;

use crate::{ml::daily_summary::DailySummary, error::{Result, ServerError}};

use super::db::MongoDbClient;


const DB_NAME: &str = "human-assistant";
const COLL_NAME: &str = "daily";

#[async_trait]
pub trait DailyAnalysisInterface { 
    async fn get_by_date(date: DateTime<Utc>) -> Result<Option<DailySummary>>;
    
    async fn get_all() -> Result<Vec<DailySummary>>;

    async fn add_analysis(input: DailySummary) -> Result<DailySummary>;

    async fn delete_one(id: &str) -> Result<DailySummary>;
    
    async fn update_total_entry(id: ObjectId) -> Result<()>;

    async fn update_summary(id: ObjectId, input: DailySummary) -> Result<DailySummary>;

    fn get_analysis_db() -> Collection<DailySummary>;
    
}

#[derive(Debug)]
pub struct DailyAnalysisDb;


#[async_trait]
impl DailyAnalysisInterface for DailyAnalysisDb { 
    
    ///
    /// Insert new Daily Summary on Db 
    #[tracing::instrument(level= "debug", err)]
    async fn add_analysis(input: DailySummary) -> Result<DailySummary> {
        let collection = DailyAnalysisDb::get_analysis_db();
        
        let item = collection.insert_one(input, None).await?;

        let filter = doc! {"_id": &item.inserted_id};
        
        let res = collection
            .find_one(filter, None)
            .await?
            .unwrap();

        Ok(res)
    }

    ///
    /// Retrieves all DailySummary in the Database 
    #[tracing::instrument(level= "debug", err)]
    async fn get_all() -> Result<Vec<DailySummary>> {
        let collection = DailyAnalysisDb::get_analysis_db();
        let mut res = vec![];

        let filter = doc! {};

        let mut item = collection
            .find(filter, None)
            .await?;
        
        while let Some(summary) = item.try_next().await? { 
            res.push(summary);
        }
        Ok(res)
    }

    ///
    /// Retrieves the summary based on the date 
    /// 
    /// Note: The input here must be converted to NaiveDateTime with 00:00:00 as stored in the database  
    #[tracing::instrument(level= "debug", err)]
    async fn get_by_date(date: DateTime<Utc>) -> Result<Option<DailySummary>> {
        let collection = DailyAnalysisDb::get_analysis_db();
        
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

        let item = collection
            .find_one(filter, None)
            .await?;

        Ok(item)
    }

    ///
    /// Retrieve one daily summary and delete it 
    #[tracing::instrument(level= "debug", err)]
    async fn delete_one(id: &str) -> Result<DailySummary> { 
        let collection = DailyAnalysisDb::get_analysis_db();

        let filter = doc! {"_id" : id};

        let item = collection
            .find_one_and_delete(filter, None)
            .await?
            .ok_or(ServerError::NotFound(format!("{id}")))?;

        Ok(item)
    }

    ///
    /// Retrieve one daily summary and delete it 
    async fn update_total_entry(id: ObjectId) -> Result<()> { 
        let collection = DailyAnalysisDb::get_analysis_db();

        let filter = doc! { "_id": id };
        let increment = doc! { "$inc":  {
                "total_entries": 1      
            }
        };

        collection.update_one(filter, increment, None).await?;

        Ok(())
    }

    /// 
    /// Update each fields on DailySummary 
    async fn update_summary(id: ObjectId, input: DailySummary) -> Result<DailySummary> { 
        let collection = DailyAnalysisDb::get_analysis_db();
        
        let query = doc! { "_id": id  };
        let update = doc! { "$set": bson::to_document(&input).unwrap()};

        let _ = collection.update_one(query, update, None).await?;

        let id = doc! { "_id": id.to_owned()};

        collection.find_one(id, None)
            .await?
            .ok_or(ServerError::NotFound(format!("{}", input.id.unwrap())))
    }


    /// 
    /// Access to daily collections
    #[tracing::instrument(level= "debug")]
    fn get_analysis_db() -> Collection<DailySummary> {
        MongoDbClient::get_collection::<DailySummary>(COLL_NAME, DB_NAME)
    }
}

