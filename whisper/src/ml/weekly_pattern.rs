use bson::{oid::ObjectId, DateTime};
use chrono::{Utc, Datelike, NaiveDate, Weekday, TimeZone, Local, Duration};
use serde::{Serialize, Deserialize};

use crate::{error::{Result, ServerError}, persistence::{audio_db::{AudioDB, AudioInterface}, 
weekly_db::{WeeklyAnalysisDB, WeeklyAnalysisInterface}, audio_analysis::AnalysisDb, get_current_week}};

use super::{text_classification::{MoodFrequency, TextClassification}, recommendation::RecommendedActivity, whisper::{AudioDataDTO}};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ImportantEvents { 
    pub emoji: Option<String>,
    pub title: Option<String>,
    pub summary: Option<String>
}

/// Weekly Analysis from start_week to end_week 
#[derive(Debug, Serialize, Default, Clone, Deserialize)]
pub struct WeeklyAnalysisDTO { 

    // Weekly id 
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>, 

    // ISO week number starting from 1.
    pub week_number: Option<i32>, 

    // Weekly average  
    pub weekly_avg: Option<f32>, 

    // Total number of entries within the week 
    pub total_entries: i32,

    // Start date of the week 
    // #[serde(with = "bson::serde_helpers::chrono_datetime_as_bson_datetime")]
    pub start_week: Option<DateTime>,

    // End date of the week 
    // #[serde(with = "bson::serde_helpers::chrono_datetime_as_bson_datetime")]
    pub end_week: Option<DateTime>,

    // User's common mood in the week 
    pub common_mood: Option<Vec<MoodFrequency>>,

    // User's change of mood 
    pub inflection: Option<AudioDataDTO>,

    // User's lowest mood 
    pub min: Option<AudioDataDTO>,

    // User's best mood 
    pub max: Option<AudioDataDTO>,
    
    // Events that affected the user's emotions in the week 
    pub important_events: Vec<ImportantEvents>,

    // Personalised advices to the user
    pub recommendations: Option<Vec<RecommendedActivity>>,
}

impl WeeklyAnalysisDTO { 
    ///
    /// Initialise new weekly analysis to default values 
    /// 
    /// 
    /// 
    /// Example usage: 
    /// ```
    ///  // Initialise and save to database 
    ///  let weekly_summary = WeeklyAnalysis::new().save().await?;
    /// 
    /// ```
    pub fn new() -> Self { 
        log::info!("Creating new weekly controlled");
        let id = ObjectId::new();
        
        let now = Utc::now();
        let iso_week = now.date_naive().iso_week();
        
        let week_number = iso_week.week() as i32;
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
            week_number: Some(week_number),
            start_week: Some(bson_start), 
            end_week: Some(bson_end),
            ..Default::default()
        }
    }
    
    ///
    /// Get minimum mood of the week: 
    /// - Requires atleast 3 datapoints from the current week 
    #[tracing::instrument(level= "debug")]
    pub async fn get_min_mood(&mut self) -> Result<Self> { 
        let data = AnalysisDb::get_data_in_current_week().await?;

        let analysis = TextClassification::get_min_point(&data).await?;
        if let Some(text) = analysis { 
            let audio_ref = text.audio_ref.unwrap().to_string();
            let data = AudioDB::get_entry(&audio_ref).await?;
            self.min = Some(data.clone());
            self.add_to_important_events(&data)?;
        }
        Ok(self.clone())
    }
    
    ///
    /// Get maximum mood of the week:
    /// - Requires atleast 3 datapoints from the current week 
    #[tracing::instrument(level= "debug")]
    pub async fn get_max_mood(&mut self) -> Result<Self> { 
        let data= AnalysisDb::get_data_in_current_week().await?;

        let analysis = TextClassification::get_max_point(&data).await?;
        if let Some(text) = analysis { 
            let audio_ref = text.audio_ref.unwrap().to_string();
            let data = AudioDB::get_entry(&audio_ref).await?;
            self.max = Some(data.clone());
            self.add_to_important_events(&data)?;
        }
        Ok(self.clone())
    }
    
    ///
    /// Get the inflection point from atleast 3 data points of the week 
    /// - Inflection point in this case would be the turning point of the person mood change
    #[tracing::instrument(level= "debug")]
    pub async fn get_inflection_point(&mut self) -> Result<Self> { 
        let data= AnalysisDb::get_data_in_current_week().await?;
        let analysis = TextClassification::get_inflection_point(&data).await?;
        if let Some(text) = analysis { 
            let audio_ref = text.audio_ref.unwrap().to_string();
            let data = AudioDB::get_entry(&audio_ref).await?;
            self.inflection = Some(data.clone());

            self.add_to_important_events(&data)?;
        }
        Ok(self.clone())
    }
    
    ///
    /// Get the frequency of mood from the start of the week to the end
    #[tracing::instrument(level= "debug")]
    pub async fn get_common_wood(&mut self) -> Result<Self> { 

        let (bson_start_date, bson_end_date) = get_current_week();
        let top_moods = TextClassification::get_most_common_moods(bson_start_date, bson_end_date).await.unwrap();
        self.common_mood = Some(top_moods);
        Ok(self.clone())
    }

    ///
    /// Get AI generated recommendations based on the 3 summaries from the 3 data points:
    /// - Lowest Mood point 
    /// - Inflection Point 
    /// - Maximum Mood point 
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

    /// 
    /// Aggregate event on a list  
    #[tracing::instrument(level= "debug")]
    fn add_to_important_events(&mut self, data: &AudioDataDTO) -> Result<()> {
        let AudioDataDTO { 
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
    #[tracing::instrument(level= "debug")]
    pub async fn get_weekly_average(&mut self) -> Result<Self> {
        let data= AnalysisDb::get_data_in_current_week().await?;
        let db_val = TextClassification::get_average(&data).await?.unwrap();
        
        // Automatically update both values in the database if new entries are added 
        let val = TextClassification::get_total_entries().await?.unwrap();

        // 
        // If the value exist, check if we can update the value 
        if let Some(curr_avg) = self.weekly_avg { 

            if db_val != curr_avg { 
                self.weekly_avg = Some(db_val);
                self.total_entries = val;
            }

            return Ok(self.clone())    
        }

        self.weekly_avg = Some(db_val);
        
        // For safety purposes
        if self.total_entries == 0 { 
            self.total_entries = val;
        }


        Ok(self.clone())
    }

    ///
    /// Retrieve the total number of entries 
    /// Updates the value in the database if the total entries have increased  
    #[tracing::instrument(level= "debug")]
    pub async fn get_total_entries(&mut self) -> Result<Self> { 
        let val = TextClassification::get_total_entries().await?.unwrap();
        // If there is a value under the current object 
            
        if self.total_entries < val { 
            self.total_entries = val;
            return Ok(self.clone())
        }
        // else set the new value based on the new db val
        self.total_entries = val;

        Ok(self.clone())
    }

    ///
    /// Check if the current week analysis has expired based on the 
    /// recorded `end_week` which is the date of the last day of the week 
    /// 
    /// If Expired, a new analysis should be conducted, starting from the date immediately following the end date of the 
    /// previous analysis 
    #[tracing::instrument(level= "debug")]
    pub fn is_expired(&self) -> bool { 
        // Get current start of the week and end of the week dates 
        let now = Utc::now().date_naive();
        let start_of_week = now - Duration::days(now.weekday().num_days_from_monday() as i64);
        let end_of_week = start_of_week + Duration::days(7);
        
        // Convert both values into naivedatetime and set to 00:00:00
        let end_date = end_of_week.and_hms_opt(0, 0, 0).unwrap();
        
        // If the current end date of the week is greater than the recorded end data of the week 
        // it means, that we have overpassed the end_week of the previous analyis
        end_date > self.end_week
            .expect("Missing `end_week` on Weekly Analysis")
            .to_chrono()
            .naive_utc()
    }   
    ///
    /// Sends an update query to the database, Increments the number of total entries, else return Database error 
    #[tracing::instrument(level= "debug")]
    pub async fn increment_entries(&mut self) -> Result<()> { 
        if let Some(id) = self.id { 
            return WeeklyAnalysisDB::update_total_entry(id).await
        }
        Err(ServerError::DatabaseError(
            format!("Unable to increment `total_entries`. Unable to find Id.")
        ))
    }

    /// 
    /// Save the current weekly analysis to database 
    #[tracing::instrument(level= "debug")]
    pub async fn save(&self) -> Result<Self> { 
        
        // Ensure to save at the end of the week 
        
        WeeklyAnalysisDB::add_analysis(self).await
    }
    
    
}

