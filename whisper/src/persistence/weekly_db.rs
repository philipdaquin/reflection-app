use crate::error::ServerError;
use crate::{error::Result, ml::weekly_pattern::WeeklyAnalysisDTO};
use async_trait::async_trait;
use bson::DateTime;
use chrono::{Utc, Duration, TimeZone, Datelike};
use mongodb::{Collection, Cursor};
use mongodb::bson::{doc, oid::ObjectId, };
use super::audio_analysis::AnalysisDb;
use super::{db::MongoDbClient};

const DB_NAME: &str = "human-assistant";
const COLL_NAME: &str = "weekly";

#[async_trait]
pub trait WeeklyAnalysisInterface { 
    async fn add_analysis(new_analysis: &WeeklyAnalysisDTO) -> Result<WeeklyAnalysisDTO>;
    async fn delete_one_analysis(id: ObjectId) -> Result<Option<WeeklyAnalysisDTO>>;
    async fn delete_all_entries() -> Result<bool>;
    async fn get_one_analysis(id: ObjectId) -> Result<WeeklyAnalysisDTO>;
    async fn get_corresponding_week(start_date: DateTime) -> Result<Option<WeeklyAnalysisDTO>>;
    async fn get_current_week() -> Result<Option<WeeklyAnalysisDTO>>;
    async fn update_total_entry(id: ObjectId) -> Result<()>;

    async fn update_fields(id: ObjectId, input: WeeklyAnalysisDTO) -> Result<WeeklyAnalysisDTO>;

    fn get_analysis_db() -> Collection<WeeklyAnalysisDTO>;

}


#[derive(Debug)]
pub struct WeeklyAnalysisDB;

impl WeeklyAnalysisDB { 
    /// Get the first value for testing purposes 
    pub async fn get_first_item() -> Result<Option<WeeklyAnalysisDTO>> { 

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
    async fn get_one_analysis(id: ObjectId) -> Result<WeeklyAnalysisDTO> {
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
    async fn add_analysis(new_analysis: &WeeklyAnalysisDTO) -> Result<WeeklyAnalysisDTO> {
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
    async fn delete_one_analysis(id: ObjectId) -> Result<Option<WeeklyAnalysisDTO>> {
        let collection = WeeklyAnalysisDB::get_analysis_db();

        let filter = doc! {"_id" : id};

        let item = collection.find_one_and_delete(filter, None)
            .await?
            .ok_or(ServerError::NotFound(format!("{id}")))?;

        Ok(Some(item))
    }

    ///
    /// Get the weekly record based on the date of the daily input       
    #[tracing::instrument(fields(id), level= "debug", err)]
    async fn get_corresponding_week(created_date: DateTime) -> Result<Option<WeeklyAnalysisDTO>> { 

        let collection = WeeklyAnalysisDB::get_analysis_db();
        
        let filter = doc! { 
            "start_week": { 
                "$lte": created_date,
            },
            "end_week": { 
                "$gte": created_date
            }
        };
        let res = collection.find_one(filter, None).await?;


        log::info!("❌❌❌❌❌ {res:#?}");

        Ok(res)
    }

    // Get the current week for the current day 
    #[tracing::instrument(level= "debug", err)]
    async fn get_current_week() -> Result<Option<WeeklyAnalysisDTO>> {
        let collection = WeeklyAnalysisDB::get_analysis_db();


         // Get current start of the week and end of the week dates 
         let now = Utc::now().date_naive();
         let start_of_week = now - Duration::days(now.weekday().num_days_from_monday() as i64);
         let end_of_week = start_of_week + Duration::days(7);
         
         // Convert both values into naivedatetime and set to 00:00:00
         let start_date = start_of_week.and_hms_opt(0, 0, 0).unwrap();
         let end_date = end_of_week.and_hms_opt(0, 0, 0).unwrap();
 
         // Convert to DateTime in Chrono        
         let start_date_time: chrono::DateTime<Utc> =  Utc.from_utc_datetime(&start_date);
         let end_date_time: chrono::DateTime<Utc> =  Utc.from_utc_datetime(&end_date);
 
         // Convert to Bson DateTime  
         let bson_start_date = bson::DateTime::from_chrono(start_date_time);
         let bson_end_date = bson::DateTime::from_chrono(end_date_time);


        let filter = doc! { 
            "start_week": { 
                "$gte": bson_start_date,
            },
            "end_week": { 
                "$lt": bson_end_date
            }
        };

        let res = collection.find_one(filter, None).await?;

        Ok(res)
    }

    /// Increment the value of total entries 
    /// - Filter by id 
    /// - Increment `total_entries` by 1 
    #[tracing::instrument(level= "debug", err)]
    async fn update_total_entry(id: ObjectId) -> Result<()> { 
        let collection = WeeklyAnalysisDB::get_analysis_db();

        let filter = doc! { "_id" : id};
        let increment = doc! {"$inc" : {
            "total_entries" : 1
            }
        };

        collection.update_one(filter, increment, None).await?;

        Ok(())
    }

    /// Update each fields on WeeklySummary
    async fn update_fields(id: ObjectId, input: WeeklyAnalysisDTO) -> Result<WeeklyAnalysisDTO> { 
        let collection = WeeklyAnalysisDB::get_analysis_db();
        
        let query = doc! { "_id": id  };
        let update = doc! { "$set": bson::to_document(&input).unwrap()};

        let _ = collection.update_one(query, update, None).await?;

        let id = doc! { "_id": id.to_owned()};

        collection.find_one(id, None)
            .await?
            .ok_or(ServerError::NotFound(format!("{}", input.id.unwrap())))
    }

    ///
    /// Access to weekly collection 
    fn get_analysis_db() -> Collection<WeeklyAnalysisDTO> {
        MongoDbClient::get_collection::<WeeklyAnalysisDTO>(COLL_NAME, DB_NAME)
    }
   
}