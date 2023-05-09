use std::collections::HashSet;

use chrono::{ Utc, Datelike, DateTime};
use serde::{Serialize, Deserialize};

use crate::ml::{weekly_pattern::{ImportantEvents, WeeklyAnalysisDTO}, recommendation::RecommendedActivity, text_classification::MoodFrequency};

use super::audiodata::AudioData;

/// Weekly Analysis from start_week to end_week 
#[derive(Debug, Serialize, Default, Clone, Deserialize)]
pub struct WeeklyAnalysis { 
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<String>, 
    pub week_number: Option<i32>, 
    pub weekly_avg: Option<f32>, 
    pub total_entries: i32,
    pub start_week: Option<DateTime<Utc>>,
    pub end_week: Option<DateTime<Utc>>,
    pub mood_frequency: Option<Vec<MoodFrequency>>,
    pub inflection: Option<AudioData>,
    pub min: Option<AudioData>,
    pub max: Option<AudioData>,
    pub important_events: HashSet<ImportantEvents>,
    pub recommendations: Option<Vec<RecommendedActivity>>,
}

impl From<WeeklyAnalysisDTO> for WeeklyAnalysis { 
    fn from(value: WeeklyAnalysisDTO) -> Self {
        Self {
            id: value.id.map(|f| f.to_string()),

            week_number: value.week_number,

            weekly_avg: value.weekly_avg,

            total_entries: value.total_entries,
            
            start_week: value.start_week.map(|f| f.into()),
            
            end_week: value.end_week.map(|f| f.into()),
            
            mood_frequency: value.mood_frequency,
            
            inflection: value.inflection.map(|f| AudioData::from(f)),
            
            min: value.min.map(|f| AudioData::from(f)),
            
            max: value.max.map(|f| AudioData::from(f)),
            
            important_events: value.important_events.into_iter().collect(),
            
            recommendations: value.recommendations,
        }
    }
} 