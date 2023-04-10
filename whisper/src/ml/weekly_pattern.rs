use bson::oid::ObjectId;
use chrono::{NaiveDateTime, Utc, Datelike, NaiveDate, Weekday};
use serde::Serialize;

use crate::{error::Result, persistence::audio_db::{AudioDB, AudioInterface}};

use super::{text_classification::{TopMood, TextClassification}, recommendation::RecommendedActivity, whisper::AudioData};

#[derive(Debug, Clone, Serialize)]
struct ImportantEvents { 
    emoji: Option<String>,
    title: Option<String>,
    summary: Option<String>
}

/// Weekly Analysis from start_week to end_week 
#[derive(Debug, Serialize, Default, Clone)]
pub struct WeeklyAnalysis { 
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    id: Option<ObjectId>, 
    // #[serde(with = "bson::serde_helpers::chrono_datetime_as_bson_datetime")]
    start_week: Option<NaiveDate>,
    // #[serde(with = "bson::serde_helpers::chrono_datetime_as_bson_datetime")]
    end_week: Option<NaiveDate>,

    // User's common mood in the week 
    common_mood: Option<Vec<TopMood>>,

    // User's change of mood 
    inflection: Option<AudioData>,

    // User's lowest mood 
    min: Option<AudioData>,

    // User's best mood 
    max: Option<AudioData>,
    
    // Events that affected the user's emotions in the week 
    important_events: Vec<ImportantEvents>,

    // Personalised advices to the user
    recommendations: Option<Vec<RecommendedActivity>>,
}

impl WeeklyAnalysis { 
    fn new() -> Self { 
        let id = ObjectId::new();
        
        let now = Utc::now().naive_local();
        let iso_week = now.date().iso_week();
        // Calculate the start and end dates of the week
        let start_week = NaiveDate::from_isoywd_opt(iso_week.year(), iso_week.week(), Weekday::Mon);
        let end_week = NaiveDate::from_isoywd_opt(iso_week.year(), iso_week.week(), Weekday::Sun);

        Self { 
            id: Some(id), 
            start_week, 
            end_week,
            ..Default::default()
        }
    }
    #[tracing::instrument(level= "debug")]
    async fn get_min_mood(&mut self) -> Result<Self> { 

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
    async fn get_max_mood(&mut self) -> Result<Self> { 
        let analysis = TextClassification::get_max_point_in_week().await?;
        if let Some(text) = analysis { 
            let audio_ref = text.audio_ref.unwrap().to_string();
            let data = AudioDB::get_entry(&audio_ref).await?;
            self.min = Some(data.clone());
            self.add_to_important_events(&data)?;
        }
        Ok(self.clone())
    }
    #[tracing::instrument(level= "debug")]
    async fn get_inflection_point(&mut self) -> Result<Self> { 
        let analysis = TextClassification::get_weekly_inflection_point().await?;
        if let Some(text) = analysis { 
            let audio_ref = text.audio_ref.unwrap().to_string();
            let data = AudioDB::get_entry(&audio_ref).await?;
            self.min = Some(data.clone());

            self.add_to_important_events(&data)?;
        }
        Ok(self.clone())
    }
    #[tracing::instrument(level= "debug")]
    async fn get_common_wood(&mut self) -> Result<Self> { 
        let top_moods = TextClassification::get_most_common_moods().await.unwrap();
        self.common_mood = Some(top_moods);
        Ok(self.clone())
    }
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
    #[tracing::instrument(level= "debug")]
    async fn generate_recommendations(&mut self) -> Result<Self> { 
        let summaries = self.important_events.clone().iter().map(|f| f.summary.clone().unwrap()).collect::<Vec<String>>();
        let recom = RecommendedActivity::get_personalised_recommendations(summaries).await.unwrap();
        self.recommendations = Some(recom);
        Ok(self.clone())
    }
    
}

