use std::collections::HashMap;

use bson::{oid::ObjectId, DateTime};
use chrono::{Utc, NaiveDate};
use serde::{Serialize, Deserialize};

use crate::error::Result;

use super::{whisper::AudioDataDTO, text_classification::MoodFrequency};



#[derive(Debug, Serialize, Default, Clone, Deserialize)]
pub struct DailySummary { 
    
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,

    /// Current Date 
    pub date: Option<NaiveDate>,

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
    fn new() -> Self { 
        
        let id = ObjectId::new();
        let date = Utc::now().date_naive();
        Self { 
            id: Some(id), 
            date: Some(date),
            ..Default::default()
        }
    }

    /// 
    /// Retrieve the minimum mood entry 
    pub async fn get_min_mood(&mut self) -> Result<Self> { 
        todo!()
    }

    ///
    /// Retrieve the turning point in the user's mood
    pub async fn get_inflection_mood(&mut self) -> Result<Self> { 
        todo!()
    }

    ///
    /// Retrieve teh maximum mood entry 
    pub async fn get_max_mood(&mut self) -> Result<Self> {
        todo!()
    }

    ///
    /// Retrieve mood frequencies 
    pub async fn get_mood_frequency(&mut self) -> Result<Self> { 
        todo!()
    }

    ///
    /// Retrieves the new average 
    pub async fn get_average(&mut self) -> Result<Self> { 
        todo!()
    }

    ///
    /// Update total entries 
    pub async fn increment_entries(&mut self) -> Result<()> { 
        todo!()
    }

    pub async fn save(&self) -> Result<Self> { 
        todo!()
    }


}