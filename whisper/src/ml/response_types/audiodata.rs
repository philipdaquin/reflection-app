use chrono::{ Utc, Datelike, DateTime};
use serde::{Serialize, Deserialize};

use crate::ml::{text_classification::TextClassification, whisper::AudioDataDTO};

use super::audioanalysis::AudioAnalysis;


#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct AudioData { 
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,
    pub title: Option<String>,
    pub image_url: Option<String>,
    pub audio_url: Option<String>,
    
    pub author: Option<String>,
    pub description: Option<String>,
    pub duration: Option<u64>,
    pub favourite: bool, 
    pub date: Option<DateTime<Utc>>,
    pub day: Option<String>,
    pub transcription: Option<String>,
    pub summary: Option<String>,
    pub text_classification: Option<AudioAnalysis>,
    pub tags: Option<Vec<String>>
}

impl From<AudioDataDTO> for AudioData { 
    fn from(value: AudioDataDTO) -> Self {


        let back_to_chrono: Option<chrono::DateTime<Utc>> = value
            .date
            .and_then(|f| Some(f.into()));

        Self {
            id: value.id,

            title: value.title,

            date: back_to_chrono,

            image_url: value.image_url, 
            audio_url: value.audio_url,
            author: value.author,
            description: value.description,
            duration: value.duration,
            favourite: value.favourite,

            day: value.day,

            transcription: value.transcription,

            summary: value.summary,

            text_classification: value
                .text_classification
                .map(|f| AudioAnalysis::from(f)),
            
            tags: value.tags,
        }
    }
}


impl From<AudioData> for AudioDataDTO { 
    fn from(value: AudioData) -> Self {
        Self {
            id: value.id,
            title: value.title,
            date: value.date.map(|f| bson::DateTime::from_chrono(f)),
            day: value.day,
            transcription: value.transcription,
            summary: value.summary,
            text_classification: value.text_classification.map(|f| TextClassification::from(f)),
            tags: value.tags,
            image_url: value.image_url, 
            audio_url: value.audio_url,
            author: value.author,
            description: value.description,
            duration: value.duration,
            favourite: value.favourite,
        }
    }
}