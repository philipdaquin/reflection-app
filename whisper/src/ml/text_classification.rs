use mongodb::bson::oid::ObjectId;
use serde::{Serialize, Deserialize};
use chrono::{NaiveDateTime, Weekday, Datelike, Utc};
use crate::{error::Result, persistence::{audio_analysis::{AnalysisDb, TextAnalysisInterface}, weekly_db::{WeeklyAnalysisDB, WeeklyAnalysisInterface}}};
use super::{chat::get_chat_response, prompt::ANALYSE_TEXT_SENTIMENT, weekly_pattern::WeeklyAnalysisDTO};
use bson::{ DateTime};


#[derive(Debug, Serialize, Clone, Deserialize, Default)]
pub struct MoodFrequency { 
    pub emotion: Option<String>,
    pub emotion_emoji: Option<String>,
    pub count: Option<i64>, 
    pub percentage: Option<f32>,

    #[serde(rename = "_audio_ids")]
    pub audio_ref: Vec<String>
}

impl MoodFrequency { 
    pub fn new(emotion_emoji: Option<String>, 
        emotion: Option<String>, 
        count: Option<i64>,
        percent: Option<f32>,
        audio_ref: Vec<String>
    ) -> Self { 
        Self { 
            emotion_emoji, 
            emotion,
            count,
            percentage: percent,
            audio_ref
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
    #[serde(rename = "_weekly_ref", skip_serializing_if = "Option::is_none")]
    pub weekly_ref: Option<ObjectId>,

    pub date: Option<DateTime>,
    pub day: String,
    pub emotion: Option<String>,
    pub emotion_emoji: Option<String>, 
    pub average_mood: Option<f32>
}

impl TextClassification { 

    ///
    /// Inserting a daily input 
    /// 1. Check the date of the daily input 
    /// 2. Retrieve the corresponding weekly record based on the date of the daily input 
    /// 3. If not found, create a new one and insert it into the weekly table 
    /// 4. Get the id of the weekly record
    /// 5. Insert the daily input into the daily table, with the week id 
    /// 6. Increment the `total_entries` 
    /// Intialise new TextClassification with updated Id, date, and audioId
    pub async fn new(audio_ref: Option<String>) -> Self { 
        let id = ObjectId::new();

        let date = Utc::now();
        let bson_date_time = bson::DateTime::from_chrono(date);

        let day = date.weekday().to_string();

        // Find the week or create a new one, get the id 
        let week = WeeklyAnalysisDB::get_corresponding_week(bson_date_time)
            .await
            .unwrap();

        // Get updated weekly analysis 
        let weekly_analysis = match week { 
            Some(mut i) if !i.is_expired() => i.update().await.unwrap(),
            _ => {
                // create a new Weekly Analysis, increment total count and save to database 
                let mut new = WeeklyAnalysisDTO::new()
                    .save()
                    .await
                    .unwrap();
                new.increment_entries().await.unwrap();
                new
            }
        };  

        let weekly_ref = weekly_analysis.id;

        Self { 
            id: Some(id), 
            audio_ref: audio_ref.map(|a| ObjectId::parse_str(a).expect("Unable to convert String to ObjectId")),
            date: Some(bson_date_time),
            day,
            weekly_ref,
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
    /// Aggregates the frequency of moods from start to end dates 
    /// 
    /// ```
    /// // Get both the starting and ending dates 
    /// let (bson_start_date, bson_end_date): (bson::DateTime, bson::DateTime)  = AnalysisDb::get_current_week();
    ///  
    /// // Get mood frequencies 
    /// let mood_frequencies: Vec<MoodFrequency> = TextClassification::get_most_common_moods(bson_start_date, bson_end_date).await?;
    /// ```
    /// 
    #[tracing::instrument(fields(input, self), level= "debug")]
    pub async fn get_most_common_moods(start_date: DateTime, end_date: DateTime) -> Result<Vec<MoodFrequency>> { 
        
        let weekly = AnalysisDb::get_mood_frequency(start_date, end_date).await.unwrap();

        log::info!("Common Mood: {weekly:?}");

        Ok(weekly)
    }

    ///
    /// Collect the TextClassifications such as the inflection point, min and max within the last 7 days 
    #[tracing::instrument(level= "debug")]
    pub async fn get_weekly_patterns(data: Vec<TextClassification>) -> Result<Vec<TextClassification>> { 
        let mut tmp = Vec::new();
        let inflection = TextClassification::get_inflection_point(&data).await?;
        let max_point = TextClassification::get_max_point(&data).await?;
        let min_point = TextClassification::get_min_point(&data).await?;

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
    pub async fn get_inflection_point(data: &Vec<TextClassification>) -> Result<Option<TextClassification>> { 
        // Collect all data points in the current week 
        // let data_points = AnalysisDb::get_data_in_current_week().await?;

        // Find the inflection point within the datapoint 
        let point = find_inflection_point(&data);

        Ok(point)
    }

    ///
    /// 
    #[tracing::instrument(level= "debug")]
    pub async fn get_min_point(data: &Vec<TextClassification>) -> Result<Option<TextClassification>> {
        // // Collect all data points in the current week 
        // let data_points = AnalysisDb::get_data_in_current_week().await?;
        
        let mut min_avg_mood = f32::MAX;
        let mut curr_avg_mood = 0.0;
        let mut min_point = None;

        for point in data.into_iter() { 
            if let Some(mood) = point.average_mood { 
                // If the curr mood is less than the recorded min mood 
                curr_avg_mood = f32::min(mood, curr_avg_mood);
                
                if curr_avg_mood < min_avg_mood { 
                    min_avg_mood = curr_avg_mood;
                    min_point = Some(point.to_owned());
                }                
            }
        }
        log::info!("✅ The min avg_mood: {min_avg_mood} at {min_point:?}");

        Ok(min_point)
    }

    ///
    /// Gets the highest average mood that the user experience within the last seven days
    #[tracing::instrument(level= "debug")]
    pub async fn get_max_point(data: &Vec<TextClassification>) -> Result<Option<TextClassification>> {
        // Collect all data points from the last seven days 
        // let data_points = AnalysisDb::get_data_in_current_week().await?;
        
        let mut max_avg_mood = f32::MIN;
        let mut curr_avg_mood = 0.0;
        let mut max_point: Option<TextClassification> = None;

        for point in data.into_iter() { 
            if let Some(mood) = point.average_mood { 
                curr_avg_mood = f32::min(mood, curr_avg_mood);
                if curr_avg_mood > max_avg_mood { 
                    max_avg_mood = curr_avg_mood; 
                    max_point = Some(point.to_owned());
                }
            }
        }

        log::info!("✅ The max avg_mood: {max_avg_mood} at {max_point:?}");

        Ok(max_point)
    }

    ///
    /// Gets the weekly average for the last seven days
    pub async fn get_average(data: &Vec<TextClassification>) -> Result<Option<f32>> {
        // let data_points = AnalysisDb::get_data_in_current_week().await?;
        let total_len = data.len();
        let mut sum = 0.0;
        
        for point in data.into_iter() { 
            if let Some(avg) = point.average_mood { 
                sum  += avg ;
            }
        }
        
        let avg = sum as f32 / total_len as f32;

        Ok(Some(avg))
    }
    ///
    /// Count the number of documents in the same week 
    pub async fn get_total_entries() -> Result<Option<i32>> { 
        let count = AnalysisDb::count_documents_in_current_week()
            .await?
            .unwrap() as i32;
        Ok(Some(count))
    }

}


///
/// Helper function to find the inflection point within all data points 
pub fn find_inflection_point(full_data: &Vec<TextClassification>) -> Option<TextClassification> { 
    
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
        return Some(object.clone())
    } 

    None
    
}
