use std::collections::HashMap;

use bson::{oid::ObjectId, DateTime};
use chrono::{Utc, NaiveDate, TimeZone};
use serde::{Serialize, Deserialize};

use crate::{error::{Result, ServerError}, ml::text_classification::TextClassification, persistence::{audio_analysis::{AnalysisDb, TextAnalysisInterface}, audio_db::{AudioDB, AudioInterface}, daily_db::{DailyAnalysisDb, DailyAnalysisInterface}, get_current_day}};

use super::{whisper::AudioDataDTO, text_classification::MoodFrequency};



#[derive(Debug, Serialize, Default, Clone, Deserialize)]
pub struct DailySummary { 
    
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,

    /// Current Date 
    /// MM / DD / YYYY with Time 00:00:00
    pub date: Option<DateTime>,

    /// The total number of entries 
    pub total_entries: i32,

    /// Current Mood based on the Daily Average 
    pub overall_mood: Option<String>,

    /// Daily Average 
    pub current_avg: Option<f32>,

    /// User's change of mood 
    pub inflection: Option<AudioDataDTO>,
    
    /// User's lowest mood 
    pub min: Option<AudioDataDTO>,

    /// User's best mood 
    pub max: Option<AudioDataDTO>,

    /// Mood triggers
    pub mood_frequency: Vec<MoodFrequency>
}

impl DailySummary { 
    
    /// 
    /// Initialise the DailySummary 
    pub fn new() -> Self { 
        
        let id = ObjectId::new();
        
        // Set to NaiveDateTime with 00:00:00 time 
        let date = Utc::now()
            .date_naive()
            .and_hms_opt(0, 0, 0)
            .unwrap();

        // NaiveDateTime to DateTime<Utc>
        let date_time: chrono::DateTime<Utc> =  Utc.from_utc_datetime(&date);

        // DateTime to Bson DateTime 
        let bson_date_time = bson::DateTime::from_chrono(date_time);


        Self { 
            id: Some(id), 
            date: Some(bson_date_time),
            ..Default::default()
        }
    }

    /// 
    /// Retrieve the minimum mood entry 
    pub async fn get_min_mood(&mut self) -> Result<Self> { 
        
        let datetime = self.date.unwrap().to_chrono();
        let data = AnalysisDb::get_all_by_date(datetime).await?;

        let analysis = TextClassification::get_min_point(&data).await?;

        if let Some(min_data) = analysis { 
            let audio_ref = min_data.audio_ref.unwrap().to_string();
            let audio_data = AudioDB::get_entry(&audio_ref).await?;
            self.min = Some(audio_data);
        } 

        Ok(self.clone())
    }

    ///
    /// Retrieve the turning point in the user's mood
    pub async fn get_inflection_mood(&mut self) -> Result<Self> { 
        let datetime = self.date.unwrap().to_chrono();
        let data = AnalysisDb::get_all_by_date(datetime).await?;

        let analysis = TextClassification::get_inflection_point(&data).await?;

        if let Some(min_data) = analysis { 
            let audio_ref = min_data.audio_ref.unwrap().to_string();
            let audio_data = AudioDB::get_entry(&audio_ref).await?;
            self.min = Some(audio_data);
        } 

        Ok(self.clone())
    }

    ///
    /// Retrieve teh maximum mood entry 
    pub async fn get_max_mood(&mut self) -> Result<Self> {
        let datetime = self.date.unwrap().to_chrono();
        let data = AnalysisDb::get_all_by_date(datetime).await?;

        let analysis = TextClassification::get_max_point(&data).await?;

        if let Some(min_data) = analysis { 
            let audio_ref = min_data.audio_ref.unwrap().to_string();
            let audio_data = AudioDB::get_entry(&audio_ref).await?;
            self.min = Some(audio_data);
        } 

        Ok(self.clone())
    }

    ///
    /// Retrieve mood frequencies 
    pub async fn get_mood_frequency(&mut self) -> Result<Self> { 

        let datetime = &self.date.unwrap().to_chrono();

        let (bson_start_time, bson_end_time) = get_current_day(datetime);

        
        let mood_frequency = TextClassification::get_most_common_moods(bson_start_time, bson_end_time).await?;
        self.mood_frequency = mood_frequency;
        Ok(self.clone())
    }

    ///
    /// Retrieves the new average 
    pub async fn get_average(&mut self) -> Result<Self> { 
        
        // Get all data from this day 
        let datetime = self.date.unwrap().to_chrono();
        let data = AnalysisDb::get_all_by_date(datetime).await?;
        
        let average = TextClassification::get_average(&data)
            .await?
            .ok_or(ServerError::DatabaseError(format!("Unable to calculate average")))?;

        // If the value exist, update it 
        if let Some(curr_avg) = self.current_avg {  
            if curr_avg != average { 
                self.current_avg = Some(average)

            }
        }   
        // else, set the new value 
        self.current_avg = Some(average);
        // Update the total length
        self.total_entries = data.len() as i32;
        
        Ok(self.clone())
    }

    ///
    /// Update total entries 
    pub async fn increment_entries(&mut self) -> Result<()> { 
        
        if let Some(id) = self.id { 
            return DailyAnalysisDb::update_total_entry(id).await
        }
        Err(ServerError::DatabaseError(format!("Uanble to increment `total_entries`")))
    }

    /// 
    /// Check if the current DailySummary has overpassed is due time
    /// 
    /// `CurrentTime > EndTime` 
    pub fn is_expired(&self) -> bool { 
        let time_now = Utc::now();
        let end_date = self.date
            .unwrap()
            .to_chrono()
            .date_naive()
            .and_hms_opt(23, 59, 59)
            .unwrap();
        
        let end_dt = Utc.from_utc_datetime(&end_date);

        time_now > end_dt
    }       

    /// Update the value under 
    pub async fn update(&mut self) -> Result<Self> { 
        let updated = self
            .get_average()
            .await?
            .get_inflection_mood()
            .await?
            .get_mood_frequency()
            .await?
            .get_max_mood()
            .await?
            .get_min_mood()
            .await?
            .increment_entries()
            .await?;

        DailyAnalysisDb::update_summary(self.id.unwrap(), self.clone()).await

    }

    /// Save to Database 
    pub async fn save(&self) -> Result<Self> { 
        DailyAnalysisDb::add_analysis(self.clone()).await
    }


}