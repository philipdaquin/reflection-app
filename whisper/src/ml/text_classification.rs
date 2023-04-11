use mongodb::bson::oid::ObjectId;
use serde::{Serialize, Deserialize};
use uuid::Uuid;
use chrono::{NaiveDateTime, Weekday, Datelike, DateTime, Utc};
use crate::{error::Result, persistence::audio_analysis::{AnalysisDb, TextAnalysisInterface}};
use super::{chat::get_chat_response, prompt::ANALYSE_TEXT_SENTIMENT};
use num::CheckedSub;

#[derive(Debug, Serialize, Clone, Deserialize)]
pub struct TopMood { 
    pub emotion: Option<String>,
    // #[serde(rename = "emoji", skip_serializing_if = "Option::is_none")]
    pub emotion_emoji: Option<String>,
    pub percentage: Option<f32>
}

impl TopMood { 
    pub fn new(emotion_emoji: Option<String>, emotion: Option<String>, percent: Option<f32>) -> Self { 
        Self { 
            emotion_emoji, 
            emotion,
            percentage: percent
        }
    }
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
pub struct TextClassification { 
    // Id 
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>, 
    
    // Reference to the audio id 
    #[serde(rename = "_audio_id", skip_serializing_if = "Option::is_none")]
    pub audio_ref: Option<ObjectId>,

    // Reference to the weekly data 
    #[serde(rename = "_audio_id", skip_serializing_if = "Option::is_none")]
    pub weekly_ref: Option<ObjectId>,

    pub date: Option<NaiveDateTime>,
    pub day: String,
    pub emotion: Option<String>,
    pub emotion_emoji: Option<String>, 
    pub average_mood: Option<f32>
}

impl TextClassification { 

    ///
    /// Intialise new TextClassification with updated Id, date, and audioId
    pub fn new(audio_ref: Option<String>) -> Self { 
        let id = ObjectId::new();
        let date = Utc::now().naive_local();
        let day = date.weekday().to_string();

        Self { 
            id: Some(id), 
            audio_ref: audio_ref.map(|a| ObjectId::parse_str(a).expect("Unable to convert String to ObjectId")),
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
        classification.day = self.day.clone();
        
        // Save on Database 
        let res = AnalysisDb::add_analysis(classification).await?;
        Ok(res)
    }   

    ///
    /// Aggregates the top 3 most common mood within a week 
    #[tracing::instrument(fields(input, self), level= "debug")]
    pub async fn get_most_common_moods() -> Result<Vec<TopMood>> { 
        log::info!("✅✅✅");
        
        let weekly = AnalysisDb::get_most_common_emotions().await.unwrap();

        log::info!("Common Mood: {weekly:?}");

        Ok(weekly)
    }

    ///
    /// Collect the TextClassifications such as the inflection point, min and max within the last 7 days 
    #[tracing::instrument(fields(input, self), level= "debug")]
    pub async fn get_weekly_patterns() -> Result<Vec<TextClassification>> { 
        let mut tmp = Vec::new();
        let inflection = TextClassification::get_weekly_inflection_point().await?;
        let max_point = TextClassification::get_max_point_in_week().await?;
        let min_point = TextClassification::get_min_point_in_week().await?;

        if let Some(inflection) = inflection { 
            tmp.push(inflection);
        }
        if let Some(max_point) = max_point { 
            tmp.push(max_point);
        }
        if let Some(min_point) = min_point { 
            tmp.push(min_point);
        }

        log::info!("WEEKLY PATTERNS {tmp:#?}");

        Ok(tmp)
    }

    ///
    /// 
    #[tracing::instrument(level= "debug")]
    pub async fn get_weekly_inflection_point() -> Result<Option<TextClassification>> { 
        // Collect all data points from the last seven days 
        let data_points = AnalysisDb::get_data_set_in_last_seven_days().await?;

        // Find the inflection point within the datapoint 
        let point = find_inflection_point(data_points);
        log::info!("{point:#?}");

        Ok(point)
    }

    ///
    /// 
    #[tracing::instrument(level= "debug")]
    pub async fn get_min_point_in_week() -> Result<Option<TextClassification>> {
        // Collect all data points from the last seven days 
        let data_points = AnalysisDb::get_data_set_in_last_seven_days().await?;
        
        
        let mut min_avg_mood = f32::MAX;
        let mut curr_avg_mood = 0.0;
        let mut min_point = None;

        for point in data_points.into_iter() { 
            if let Some(mood) = point.average_mood { 
                // If the curr mood is less than the recorded min mood 
                curr_avg_mood = f32::min(mood, curr_avg_mood);
                
                if curr_avg_mood < min_avg_mood { 
                    min_avg_mood = curr_avg_mood;
                    min_point = Some(point);
                }                
            }
        }
        log::info!("✅ The min avg_mood: {min_avg_mood} at {min_point:?}");

        Ok(min_point)
    }

    ///
    /// Gets the highest average mood that the user experience within the last seven days
    #[tracing::instrument(level= "debug")]
    pub async fn get_max_point_in_week() -> Result<Option<TextClassification>> {
        // Collect all data points from the last seven days 
        let data_points = AnalysisDb::get_data_set_in_last_seven_days().await?;
        
        let mut max_avg_mood = f32::MIN;
        let mut curr_avg_mood = 0.0;
        let mut max_point = None;

        for point in data_points.into_iter() { 
            if let Some(mood) = point.average_mood { 
                curr_avg_mood = f32::min(mood, curr_avg_mood);
                if curr_avg_mood > max_avg_mood { 
                    max_avg_mood = curr_avg_mood; 
                    max_point = Some(point);
                }
            }
        }

        log::info!("✅ The max avg_mood: {max_avg_mood} at {max_point:?}");

        Ok(max_point)
    }

}


///
/// Helper function to find the inflection point within all data points 
pub fn find_inflection_point(full_data: Vec<TextClassification>) -> Option<TextClassification> { 
    
    if full_data.is_empty() { return None}

    let data = full_data.iter().map(|f| {
        let mood = f.average_mood.clone().unwrap_or_default();
        let id = f.id.unwrap();
        (id, mood)
    }).collect::<Vec<(ObjectId, f32)>>();


    log::info!("{data:#?}");

    let n = data.len();
    let y: Vec<f32> = data.iter().map(|(_, y)| *y).collect();

    // calculate the second derivative of the data using finite differences
    let mut ddf = vec![0.0; n];
    for i in 1..n-1 {
        ddf[i] = (y[i+1] - 2.0 * y[i] + y[i-1]) as f32;
    }

    // find the inflection point by locating the zero crossing of the second derivative
    let mut inflection_point = None;
    for i in 1..n-1 {
        if ddf[i] * ddf[i - 1] <= 0.0 && ddf[i] * ddf[i + 1] <= 0.0 {
            let x1 = (i - 1) as f32;
            let x2 = i as f32;
            let x3 = (i + 1) as f32;
            let y1 = y[i - 1];
            let y2 = y[i];
            let y3 = y[i + 1];
            let ddf1 = ddf[i - 1];
            let ddf2 = ddf[i];
            let ddf3 = ddf[i + 1];
            let inflection_point_x = (x1 * ddf2 * ddf3 + x2 * ddf1 * ddf3 + x3 * ddf1 * ddf2
                                     - ddf1 * y2 * (x3 - x2) - ddf2 * y3 * (x3 - x1) - ddf3 * y1 * (x2 - x1))
                                    / ((ddf2 - ddf1) * (x3 - x1) + (ddf3 - ddf1) * (x2 - x1));
            inflection_point = Some((inflection_point_x, y2));
            break;
        }
    }

    if let Some((inflection_point_x, _)) = inflection_point {
        // find the data point closest to the inflection point
        let (closest_object_id, closest_y) = data.iter()
            .min_by_key(|(_, y)| ((inflection_point_x - (n as f32 - 1.0) / 2.0).abs() - (*y - inflection_point_x).abs()).to_bits())
            .unwrap();
        
        log::info!("Closest data point to inflection point: ({:?}, {})", closest_object_id, closest_y);

        let object = full_data.into_iter().find(|f| {
            f.id.unwrap() == *closest_object_id
        }).unwrap();
        return Some(object)
    } 

    None
    
}
