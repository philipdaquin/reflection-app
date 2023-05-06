
use std::collections::HashMap;

use bson::{oid::ObjectId, DateTime};
use chrono::{Utc, NaiveDate, TimeZone};
use serde::{Serialize, Deserialize};

use crate::{error::{Result, ServerError}, ml::{text_classification::{TextClassification, MoodFrequency}, whisper::AudioDataDTO, daily_summary::DailySummaryDTO}, persistence::{audio_analysis::{AnalysisDb, TextAnalysisInterface}, audio_db::{AudioDB, AudioInterface}, daily_db::{DailyAnalysisDb, DailyAnalysisInterface}, get_current_day}};

use super::audiodata::AudioData;

#[derive(Debug, Serialize, Default, Clone, Deserialize)]
pub struct DailySummary { 
    
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Current Date 
    /// MM / DD / YYYY with Time 00:00:00
    pub date: Option<chrono::DateTime<Utc>>,

    /// The total number of entries 
    pub total_entries: i32,

    /// Current Mood based on the Daily Average 
    pub overall_mood: Option<String>,

    /// Daily Average 
    pub current_avg: Option<f32>,

    /// User's change of mood 
    pub inflection: Option<AudioData>,
    
    /// User's lowest mood 
    pub min: Option<AudioData>,

    /// User's best mood 
    pub max: Option<AudioData>,

    /// Mood triggers
    pub mood_frequency: Vec<MoodFrequency>
}


impl From<DailySummaryDTO> for DailySummary { 
    fn from(value: DailySummaryDTO) -> Self {
        Self { 
            id: value.id.map(|f| f.to_string()),
            date: value.date.map(|f| f.into()),
            total_entries: value.total_entries,
            overall_mood: value.overall_mood,
            current_avg: value.current_avg,
            inflection: value.inflection.map(|f| AudioData::from(f)),
            min: value.min.map(|f| AudioData::from(f)),
            max: value.max.map(|f| AudioData::from(f)),
            mood_frequency: value.mood_frequency
        }
    }
}