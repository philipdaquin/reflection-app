use async_trait::async_trait;
use mongodb::Collection;

use crate::{ml::daily_summary::DailySummary, error::Result};

use super::db::MongoDbClient;


const DB_NAME: &str = "human-assistant";
const COLL_NAME: &str = "daily";

#[async_trait]
pub trait DailyAnalysisInterface { 
    async fn get_by_date() -> Result<DailySummary>;
    
    async fn get_all() -> Result<DailySummary>;

    async fn add_analysis() -> Result<DailySummary>;

    async fn delete_one() -> Result<DailySummary>;
    
    fn get_analysis_db() -> Collection<DailySummary>;
    
}

#[derive(Debug)]
pub struct DailyAnalysisDb;

#[async_trait]
impl DailyAnalysisInterface for DailyAnalysisDb { 
    async fn add_analysis() -> Result<DailySummary> {
        todo!()
    }
    async fn get_all() -> Result<DailySummary> {
        todo!()
        
    }
    async fn get_by_date() -> Result<DailySummary> {

        todo!()
    }

    async fn delete_one() -> Result<DailySummary> { 
        todo!()
    }

    /// 
    /// Access to daily collections
    fn get_analysis_db() -> Collection<DailySummary> {
        MongoDbClient::get_collection::<DailySummary>(COLL_NAME, DB_NAME)
    }
}

