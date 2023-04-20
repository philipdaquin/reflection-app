use bson::oid::ObjectId;
use chrono::{ Utc, Datelike, DateTime};
use serde::{Serialize, Deserialize};

use crate::ml::text_classification::TextClassification;


#[derive(Debug, Clone, Default, Deserialize, Serialize)]
pub struct AudioAnalysis { 
    // Id 
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<String>, 
    
    // Reference to the audio id 
    #[serde(rename = "_audio_id", skip_serializing_if = "Option::is_none")]
    pub audio_ref: Option<String>,

    // Reference to the weekly data 
    #[serde(rename = "weekly_ref", skip_serializing_if = "Option::is_none")]
    pub weekly_ref: Option<String>,

    pub date: Option<DateTime<Utc>>,
    pub day: String,
    pub emotion: Option<String>,
    pub emotion_emoji: Option<String>, 
    pub average_mood: Option<f32>
}


impl From<TextClassification> for AudioAnalysis { 
    fn from(value: TextClassification) -> Self {
        Self {
            id: value.id.map(|f| f.to_string()),
            audio_ref: value.audio_ref.map(|f| f.to_string()),
            weekly_ref: value.weekly_ref.map(|f| f.to_string()),
            date: value.date.map(|f| f.into()),
            day: value.day,
            emotion: value.emotion,
            emotion_emoji: value.emotion_emoji,
            average_mood: value.average_mood,
        }
    }
}

impl From<AudioAnalysis> for TextClassification { 
    fn from(value: AudioAnalysis) -> Self {

        let into_bson = |id: String | -> ObjectId { 
            let bson = ObjectId::parse_str(id).expect("Unable to convert to ObjectId");
            bson
        };


        Self {
            id: value.id.map(|f| into_bson(f)),
            audio_ref: value.audio_ref.map(|f| into_bson(f)),
            weekly_ref: value.weekly_ref.map(|f| into_bson(f)),
            date: value.date.map(|f| f.into()),
            day: value.day,
            emotion: value.emotion,
            emotion_emoji: value.emotion_emoji,
            average_mood: value.average_mood,
        }
    }
}