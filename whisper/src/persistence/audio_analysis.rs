use async_trait::async_trait;
use bson::Bson;
use chrono::{Utc, Duration, TimeZone, Datelike, NaiveDate, Weekday};
use mongodb::{Collection, Cursor};
use mongodb::bson::{doc, oid::ObjectId, DateTime};
use mongodb::options::AggregateOptions;
use crate::error::ServerError;
use crate::ml::text_classification::MoodFrequency;
use crate::{error::Result, ml::text_classification::TextClassification};
use super::db::MongoDbClient;
use super::{get_current_week, get_current_day};
use futures_util::{TryStreamExt, StreamExt};
const DB_NAME: &str = "human-assistant";
const COLL_NAME: &str = "analysis";

#[async_trait]
pub trait TextAnalysisInterface { 
    async fn get_all_analysis() -> Result<Vec<TextClassification>>;
    async fn get_all_by_date(date: chrono::DateTime<Utc>) -> Result<Vec<TextClassification>>;
    async fn get_all_by_week(date: chrono::DateTime<Utc>) -> Result<Vec<TextClassification>>;
    async fn add_analysis(new_analysis: TextClassification) -> Result<TextClassification>;
    async fn delete_one_analysis(id: ObjectId) -> Result<Option<TextClassification>>;
    async fn get_recent() -> Result<Vec<TextClassification>>;
    async fn get_mood_frequency(start_date: DateTime, end_date: DateTime) -> Result<Vec<MoodFrequency>>;
    async fn delete_all_entries() -> Result<bool>;
    fn get_analysis_db() -> Collection<TextClassification>;
}
#[derive(Debug)]
pub struct AnalysisDb;

impl AnalysisDb { 

    ///
    /// Returns the total number of document found within the `start_date` to `end_date`
    pub async fn count_documents_within_date(start_date: DateTime , end_date: DateTime) -> Result<Option<u64>> { 
        let collection = AnalysisDb::get_analysis_db();
        // let (bson_start_date, bson_end_date) = get_current_week();
        
        // Filter 
        let filter = doc! { 
            "date": { 
                // "$exists": true,
                "$gte": start_date,
                "$lt": end_date,
            } 
        };
        
        let total_records = collection.count_documents(filter, None).await?;

        Ok(Some(total_records))
    }   

    ///
    /// Retrieves data points from the last seven days 
    #[tracing::instrument(level= "debug", err)]
    pub async fn get_data_in_current_week() -> Result<Vec<TextClassification>> {
        let collection = AnalysisDb::get_analysis_db();
        let (bson_start_date, bson_end_date) = get_current_week();

        // Get all objects in database within the 7 days 
        let pipeline = vec![
            // Match documents within the last 7 days
            doc! {
                "$match": {
                    "date": { 
                        "$gte": bson_start_date,
                        "$lt": bson_end_date,
                    } 
                }
            },
            // Project the desired fields
            doc! {
                "$project": {
                    "_id": 1,
                    "_audio_id": 1,
                    "date": 1,
                    "day": 1,
                    "emotion": 1,
                    "emotion_emoji": 1,
                    "average_mood": 1
                }
            }
        ];
        // Aggregate all data points into one 
        let mut result = Vec::new();
        let mut cursor = collection.aggregate(pipeline, None).await?;
        while let Some(doc) = cursor.try_next().await? {
            let bson = bson::from_document(doc.clone()).unwrap();
            let object: TextClassification = bson::from_bson(bson).unwrap_or_default();

            // Ensure the average mood of each object is non null
            if object.average_mood.is_some() { 
                result.push(object);
            }
        }
        Ok(result)
    }
}


#[async_trait]
impl TextAnalysisInterface for AnalysisDb { 

    /// 
    /// Return all analysis from a specific date, starting from 
    /// DD/MM/YYYY - 00:00:00 - DD/MM/YYYY - 23:59:59 
    #[tracing::instrument(level= "debug", err)]
    async fn get_all_by_date(date: chrono::DateTime<Utc>) -> Result<Vec<TextClassification>> {
        let collection = AnalysisDb::get_analysis_db();
        let (bson_start_time, bson_end_time) = get_current_day(&date);
        
        // Filter 
        let filter = doc! { 
            "date": { 
                "$gte": bson_start_time,
                "$lt": bson_end_time,
            } 
        };      
        let mut result = vec![];
        let mut doc = collection.find(filter, None).await?;

        while let Some(item) = doc.try_next().await? { 
            result.push(item)
        }

        Ok(result)
    }

    /// Returns all analysis to the user, 
    /// If empty, return [] to the user 
    #[tracing::instrument(level= "debug", err)]
    async fn get_all_analysis() -> Result<Vec<TextClassification>> { 
        log::info!("Retrieving recent dataset...");
        let mut result = Vec::with_capacity(10);
        let collection = AnalysisDb::get_analysis_db();

        let (bson_start_date, bson_end_date) = get_current_week();
        
        // Filter 
        // let filter = doc! { 
        //     "date": { 
        //         "$gte": bson_start_date,
        //         "$lt": bson_end_date,
        //     } 
        // };
        
        let filter = doc! { };
        
        let doc = collection.find(filter, None).await;
        
        let mut cursor = match doc {
            Ok(res) => res,
            Err(e) => return Err(e.into())
        };

        while let Some(doc) = cursor.try_next().await? {
            result.push(doc);
        }

        // log::info!("FOUNDED ITEMS FOR THIS: {result:#?}");

        Ok(result)
    }


    ///
    /// Retrieves Text Classification Analyses for this week 
    #[tracing::instrument(fields(repository = "TextAnalysis", id), level= "debug", err)]
    async fn get_recent() -> Result<Vec<TextClassification>> {
        log::info!("Retrieving recent dataset...");
        let mut result = vec![];
        let collection = AnalysisDb::get_analysis_db();

        let (bson_start_date, bson_end_date) = get_current_week();
        
        // Filter 
        let filter = doc! { 
            "date": { 
                "$gte": bson_start_date,
                "$lt": bson_end_date,
            } 
        };
        
        // Get the matching document 
        let doc = collection.find(filter, None).await;
        
        let mut cursor = match doc {
            Ok(res) => res,
            Err(e) => return Err(e.into())
        };

        while let Some(doc) = cursor.try_next().await? {
            result.push(doc);
        }
        Ok(result)
    }
    
    ///
    /// Insert new Analysis 
    #[tracing::instrument(fields(repository = "TextAnalysis", id), level= "debug", err)]
    async fn add_analysis(new_analysis: TextClassification) -> Result<TextClassification> {
        // log::info!("✅ Saving Analysis to database {new_analysis:#?}");
        let collection = AnalysisDb::get_analysis_db();
        let item = collection.insert_one(new_analysis, None).await?;

        log::info!("{item:#?}");

        let filter = doc! {"_id": &item.inserted_id};

        let res = collection.find_one(filter, None).await?.unwrap();

        Ok(res)
    }
    
    ///
    /// Delete Analysis 
    #[tracing::instrument(fields(repository = "TextAnalysis", id), level= "debug", err)]
    async fn delete_one_analysis(id: ObjectId) -> Result<Option<TextClassification>> {
        log::info!("✅ Deleting Text Classification analysis");
        let collection = AnalysisDb::get_analysis_db();

        let filter = doc! {"_id": &id};        
        
        let item = collection
            .find_one_and_delete(filter, None)
            .await?;
        Ok(item)
    }
    
    ///
    /// Aggregate the mood frequencies from `start_date` to `end_date`
    #[tracing::instrument(level= "debug", err)]
    async fn get_mood_frequency(start_date: DateTime, end_date: DateTime) -> Result<Vec<MoodFrequency>> {
        let collection = AnalysisDb::get_analysis_db();

        // Aggregate the top 3 most commonly recorded mood/emotion over the week or days
        let pipeline = vec![
            // Filter for documents within the last 7 days
            doc! {

                "$match": {
                    "date": { 
                        "$gte": start_date,
                        "$lt": end_date,
                    },

                    "emotion": {
                        "$ne": null
                    },
                }
            },
            // Group by emotion and count the number of occurrences
            doc! {
                "$group": {
                    "_id": {
                        "emotion": "$emotion", 
                        "emotion_emoji": "$emotion_emoji",
                    },
                    "count": {"$sum": 1},
                    "_audio_ids": {"$push": "$_audio_id"}
                }
            },

            // Sort by count in descending order
            doc! {"$sort": {"count": -1}},

            // TESTING PURPOSES
            // doc! {"$sort": {"count": 1}},
            // Limit to top 3 emotions
            // doc! {"$limit": 3},

            // Project the result to the desired format
            doc! {
                "$project": {
                    "_id": 0,
                    "emotion": "$_id.emotion",
                    "emotion_emoji": "$_id.emotion_emoji",
                    "_audio_ids": 1,
                    "count": 1
                }
            }
          
        ];
        let options = AggregateOptions::builder().build();
    
        // Execute the aggregation pipeline and retrieve the results 
        let mut doc = collection.aggregate(pipeline, options).await.unwrap();
        
        // Calculate the total number of records  
        // Testing purposes 
        let default = collection.count_documents(None, None).await?;
        
        let total_records = AnalysisDb::count_documents_within_date(start_date, end_date)
            .await?
            .unwrap_or(default);
        
        let mut result = Vec::new();
    
        // Map the aggregated results 
        while let Some(item) = doc.try_next().await? {
            let count = item.get_i32("count").unwrap_or(0) as f32;
            let percent = count / total_records as f32 * 100.0;
            let emotion = item.get_str("emotion").unwrap_or_default().to_string();
            let emoji = item.get_str("emotion_emoji").unwrap_or_default().to_string();
            let audio_ids = item
                .get_array("_audio_ids")
                .unwrap_or(&Vec::new())
                .into_iter()
                .filter_map(|f| match f {
                    Bson::ObjectId(object_id) => Some(object_id.to_hex()),
                    _ => None,
                }).collect::<Vec<String>>();
            
            log::info!("{audio_ids:#?}");
                

            result.push(MoodFrequency::new(
                Some(emoji), 
                Some(emotion), 
                Some(count as i64), 
                Some(percent),
                audio_ids
            ));
        }

    
        Ok(result)
    }

    #[tracing::instrument(level= "debug", err)]
    async fn get_all_by_week(date: chrono::DateTime<Utc>) -> Result<Vec<TextClassification>> { 
        let collection = AnalysisDb::get_analysis_db();

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
    /// Cleans out the collection 
    #[tracing::instrument(level= "debug", err)]
    async fn delete_all_entries() -> Result<bool> {
        let collection = AnalysisDb::get_analysis_db();

        let filter = doc! {};

        collection.delete_many(filter, None).await?;

        Ok(true)
    }
    
    ///
    /// Access to collection
    #[tracing::instrument(level= "debug")]
    fn get_analysis_db() -> Collection<TextClassification> { 
       MongoDbClient::get_collection::<TextClassification>(COLL_NAME, DB_NAME)
    }
}