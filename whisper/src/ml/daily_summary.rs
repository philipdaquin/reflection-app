use std::collections::HashMap;

use bson::{oid::ObjectId, DateTime};
use serde::{Serialize, Deserialize};

use super::whisper::AudioDataDTO;



#[derive(Debug, Serialize, Default, Clone, Deserialize)]
pub struct DailySummary { 
    
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    id: Option<ObjectId>,

    /// Current Date 
    date: Option<DateTime>,

    /// The total number of entries 
    total_entries: i32,

    /// Current Mood based on the Daily Average 
    overall_mood: Option<String>,

    /// Daily Average 
    current_avg: Option<f32>,

    /// User's change of mood 
    pub inflection: Option<AudioDataDTO>,
    
    /// User's lowest mood 
    pub min: Option<AudioDataDTO>,

    /// User's best mood 
    pub max: Option<AudioDataDTO>,

    /// Mood triggers
    /// Emotion, Count 
    /// count = Map<String, I32>
    pub triggers: HashMap<String, usize>

}