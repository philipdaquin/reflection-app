use mongodb::bson::oid::ObjectId;
use serde::{Serialize, Deserialize};
use uuid::Uuid;
use chrono::{NaiveDateTime, Utc, DateTime, Weekday, Datelike};
use crate::{error::Result, persistence::audio_analysis::{AnalysisDb, TextAnalysisInterface}};
use super::{chat::get_chat_response, prompt::ANALYSE_TEXT_SENTIMENT};



#[derive(Debug, Serialize, Clone)]
pub struct TopMood { 
    emoji: Option<String>,
    emotion: Option<String>,
    percentage: Option<f32>
}

impl TopMood { 
    pub fn new(emoji: Option<String>, emotion: Option<String>, percent: Option<f32>) -> Self { 
        Self { 
            emoji, 
            emotion,
            percentage: percent
        }
    }
}


/// Weekly Analysis from start_week to end_week 
#[derive(Debug, Serialize)]
pub struct WeeklyPattern { 
    
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>, 
    start_week: DateTime<Utc>,
    end_week: DateTime<Utc>,
    common_mood: Option<Vec<TopMood>>,
    inflection: Option<TextClassification>,
    min: Option<TextClassification>,
    max: Option<TextClassification>
}

impl WeeklyPattern { 
    fn new() -> Self { 
        todo!()
    }
}


#[derive(Debug, Clone, Default, Deserialize, Serialize)]
pub struct TextClassification { 
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>, 
    #[serde(rename = "_audio_id", skip_serializing_if = "Option::is_none")]
    pub audio_ref: Option<String>,
    pub date: Option<DateTime<Utc>>,
    pub day: String,
    pub emotion: Option<String>,
    pub emotion_emoji: Option<char>, 
    pub average_mood: Option<f32>
}

impl TextClassification { 

    ///
    /// Intialise new TextClassification with updated Id, date, and audioId
    pub fn new(audio_id: &str) -> Self { 
        let id = ObjectId::new();
        let date = Utc::now();
        let day = date.weekday().to_string();

        Self { 
            id: Some(id), 
            audio_ref: Some(audio_id.to_string()),
            date: Some(date),
            day,
            ..Default::default()
        }
    }
    ///
    /// Returns the TextClassification to a given text
    /// Some use cases are sentiment analysis, NLP interface, and assessing 
    /// grammatical correctness
    /// 
    /// Example:
    /// ```
    /// struct TextClassification {
    ///     pub id: Option<ObjectId>,
    ///     audio_ref: Option<Uuid>,
    ///     date: "04/02/23",
    ///     day: "Saturday",
    ///     emotion_emoji: "😊",
    ///     average_mood: 0.7
    /// }
    /// ```
    /// 
    #[tracing::instrument(fields(input, self), level= "debug")]
    pub async fn get_text_analysis(&mut self, input: &str) -> Result<Self> { 
        let resp = get_chat_response(&input, &ANALYSE_TEXT_SENTIMENT).await.unwrap();
        let mut classification: TextClassification = serde_json::from_str(&resp).unwrap_or_default();
        

        log::info!("classification -- {classification:#?} resp--- {resp} OBJECT {self:#?}");

        // The id, audioId, date remain unchanged after text classification 
        // Ensure to update the resp's id, audioId, date
        classification.id = self.id;
        classification.audio_ref = self.audio_ref.clone();
        classification.date = self.date;

        // Save on Database 
        let res = AnalysisDb::add_analysis(classification).await?;
        Ok(res)
    }   
    
    
    /// Aggregates the top 3 most common mood within a week 
    #[tracing::instrument(fields(input, self), level= "debug")]
    pub async fn get_most_common_moods() -> Result<Vec<TopMood>> { 
        let weekly = AnalysisDb::get_most_common_emotions().await.unwrap();

        log::info!("Common Mood: {weekly:?}");

        Ok(weekly)
    }

    ///
    /// Collect the TextClassifications such as the inflection point, min and max within the last 7 days 
    #[tracing::instrument(fields(input, self), level= "debug")]
    pub async fn get_weekly_patterns() -> Result<Vec<TextClassification>> { 
        
        // Which entry showed the user's sudden change in mood
        let inflection = AnalysisDb::get_inflect_point_of_mood_in_week()
            .await
            .unwrap()
            .unwrap();

        // Highlight the max and min points of the user's mood 
        let mut min_and_max = AnalysisDb::get_min_max_points_in_week()
            .await
            .unwrap();

        min_and_max.push(inflection);

        log::info!("Mood patterns: {min_and_max:?}");

        Ok(min_and_max)
    }
}