use std::collections::HashMap;

use bson::{oid::ObjectId, DateTime};
use serde::{Serialize, Deserialize};

use super::whisper::AudioDataDTO;



#[derive(Debug, Serialize, Default, Clone, Deserialize)]
pub struct DailySummary { 
    
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,

    /// Current Date 
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
    /// Emotion, Count 
    /// count = Map<String, I32>
    pub triggers: HashMap<String, usize>
}

impl DailySummary { 
    fn new() -> Self { 
        todo!()
    }
}