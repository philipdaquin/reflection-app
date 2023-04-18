use bson::{oid::ObjectId, DateTime as BsonDate};
use chrono::{Utc, Datelike, NaiveDate, Weekday, TimeZone};
use serde::{Serialize, Deserialize};

use crate::{error::Result, persistence::{audio_db::{AudioDB, AudioInterface}, weekly_db::{WeeklyAnalysisDB, WeeklyAnalysisInterface}, audio_analysis::AnalysisDb}};

use super::{text_classification::{TopMood, TextClassification}, recommendation::RecommendedActivity, whisper::AudioData};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ImportantEvents { 
    pub emoji: Option<String>,
    pub title: Option<String>,
    pub summary: Option<String>
}

/// Weekly Analysis from start_week to end_week 
#[derive(Debug, Serialize, Default, Clone, Deserialize)]
pub struct WeeklyAnalysis { 

    // Weekly id 
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>, 

    // Weekly average  
    pub weekly_avg: Option<f32>, 

    // Total number of entries within the week 
    pub total_entries: Option<i32>,

    // Start date of the week 
    // #[serde(with = "bson::serde_helpers::chrono_datetime_as_bson_datetime")]
    pub start_week: Option<BsonDate>,

    // End date of the week 
    // #[serde(with = "bson::serde_helpers::chrono_datetime_as_bson_datetime")]
    pub end_week: Option<BsonDate>,

    // User's common mood in the week 
    pub common_mood: Option<Vec<TopMood>>,

    // User's change of mood 
    pub inflection: Option<AudioData>,

    // User's lowest mood 
    pub min: Option<AudioData>,

    // User's best mood 
    pub max: Option<AudioData>,
    
    // Events that affected the user's emotions in the week 
    pub important_events: Vec<ImportantEvents>,

    // Personalised advices to the user
    pub recommendations: Option<Vec<RecommendedActivity>>,
}

impl WeeklyAnalysis { 
    pub fn new() -> Self { 
        let id = ObjectId::new();
        
        let now = Utc::now();
        let iso_week = now.date_naive().iso_week();
        
        
        // Calculate the start and end dates of the week
        let start_week = NaiveDate::from_isoywd_opt(iso_week.year(), iso_week.week(), Weekday::Mon)
            .unwrap()
            .and_hms_opt(0,0, 0)
            .unwrap();
        let end_week = NaiveDate::from_isoywd_opt(iso_week.year(), iso_week.week(), Weekday::Sun)
            .unwrap()
            .and_hms_opt(0,0, 0)
            .unwrap();

        // Into date time 
        let start_date_time: chrono::DateTime<Utc> =  Utc.from_utc_datetime(&start_week);
        let end_date_time: chrono::DateTime<Utc> =  Utc.from_utc_datetime(&end_week);
        
        // Into bson 
        let bson_start = bson::DateTime::from_chrono(start_date_time);
        let bson_end = bson::DateTime::from_chrono(end_date_time);

        Self { 
            id: Some(id), 
            start_week: Some(bson_start), 
            end_week: Some(bson_end),
            ..Default::default()
        }
    }
    #[tracing::instrument(level= "debug")]
    pub async fn get_min_mood(&mut self) -> Result<Self> { 

        let analysis = TextClassification::get_min_point_in_week().await?;
        if let Some(text) = analysis { 
            let audio_ref = text.audio_ref.unwrap().to_string();
            let data = AudioDB::get_entry(&audio_ref).await?;
            self.min = Some(data.clone());
            self.add_to_important_events(&data)?;
        }
        Ok(self.clone())
    }
    #[tracing::instrument(level= "debug")]
    pub async fn get_max_mood(&mut self) -> Result<Self> { 
        let analysis = TextClassification::get_max_point_in_week().await?;
        if let Some(text) = analysis { 
            let audio_ref = text.audio_ref.unwrap().to_string();
            let data = AudioDB::get_entry(&audio_ref).await?;
            self.max = Some(data.clone());
            self.add_to_important_events(&data)?;
        }
        Ok(self.clone())
    }
    #[tracing::instrument(level= "debug")]
    pub async fn get_inflection_point(&mut self) -> Result<Self> { 
        let analysis = TextClassification::get_weekly_inflection_point().await?;
        if let Some(text) = analysis { 
            let audio_ref = text.audio_ref.unwrap().to_string();
            let data = AudioDB::get_entry(&audio_ref).await?;
            self.inflection = Some(data.clone());

            self.add_to_important_events(&data)?;
        }
        Ok(self.clone())
    }
    #[tracing::instrument(level= "debug")]
    pub async fn get_common_wood(&mut self) -> Result<Self> { 
        let top_moods = TextClassification::get_most_common_moods().await.unwrap();
        self.common_mood = Some(top_moods);
        Ok(self.clone())
    }

    #[tracing::instrument(level= "debug")]
    pub async fn generate_recommendations(&mut self) -> Result<Self> { 
        let summaries = self.important_events
            .clone()
            .iter()
            .map(|f| f.summary.clone().unwrap())
            .collect::<Vec<String>>();
        log::info!("{summaries:?}");
        let recom = RecommendedActivity::get_personalised_recommendations(summaries).await.unwrap();
        self.recommendations = Some(recom);
        
        Ok(self.clone())
    }

    /// Helper function 
    #[tracing::instrument(level= "debug")]
    fn add_to_important_events(&mut self, data: &AudioData) -> Result<()> {
        
        let AudioData { 
            title, 
            summary,
            text_classification,
            ..
        } = data;
        let emoji = text_classification
            .clone()
            .and_then(|data| data.emotion_emoji);
  
        let event = ImportantEvents { 
            title: title.as_ref().map(|f| f.to_string()), 
            summary: summary.as_ref().map(|f| f.to_string()), 
            emoji
        };

        // Temporary
        if self.important_events.len() <= 3 { 
            self.important_events.push(event);
        } else { 
            self.important_events.remove(0);
            self.important_events.push(event);
        }

        Ok(())
    }

    ///
    /// Calculate the weekly average for the last 7 days 
    /// Updates the value in the database if the total entries have increased  
    pub async fn get_weekly_average(&mut self) -> Result<Self> {
        let db_val = TextClassification::get_weekly_average().await?.unwrap();
        
        // Automatically update both values in the database if new entries are added 
        let val = TextClassification::get_total_entries().await?.unwrap();

        // 
        // If the value exist, check if we can update the value 
        if let Some(curr_avg) = self.weekly_avg { 

            if db_val != curr_avg { 
                self.weekly_avg = Some(db_val);
                self.total_entries = Some(val);
            }

            return Ok(self.clone())    
        }

        self.weekly_avg = Some(db_val);
        
        // For safety purposes
        if self.total_entries.is_none() { 
            self.total_entries = Some(val);
        }


        Ok(self.clone())
    }

    ///
    /// Retrieve the total number of entries 
    /// Updates the value in the database if the total entries have increased  
    pub async fn get_total_entries(&mut self) -> Result<Self> { 
        let val = TextClassification::get_total_entries().await?.unwrap();
        // If there is a value under the current object 
        if let Some(curr_val) = self.total_entries { 
            
            if curr_val < val { 
                self.total_entries = Some(val);
                
            }

            return Ok(self.clone())
        }   

        // else set the new value based on the new db val
        self.total_entries = Some(val);


        Ok(self.clone())
    }

    /// 
    /// Saves current weekly analysis to database 
    pub async fn save(&self) -> Result<Self> { 
        
        // Ensure to save at the end of the week 
        
        WeeklyAnalysisDB::add_analysis(self).await
    }
    
    
}

