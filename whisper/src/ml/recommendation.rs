use serde::{Serialize, Deserialize};
use crate::error::Result;

use super::{chat::get_chat_response, prompt::GENERATE_RECOMMENDATION};


#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct RecommendedActivity { 
    pub title: Option<String>,
    pub emoji: Option<String>,
    pub description: Option<String>
}

impl RecommendedActivity { 
    ///
    /// Generate 3 recommendations based on summaries 
    /// 
    #[tracing::instrument(fields(input, self), level= "debug")]
    pub async fn get_personalised_recommendations(summaries: Vec<String>) -> Result<Vec<Self>> { 
        log::info!("{summaries:#?}");
        // Serialise the array 
        let input = serde_json::to_string_pretty(&summaries).unwrap();
        log::info!("{input:#?}");
        // Send context and input to OpenAI 
        let resp = get_chat_response(&input, &GENERATE_RECOMMENDATION)
            .await
            .unwrap();

        log::info!("{resp:#?}");

        // Deserialize the result 
        let recomm: Vec<RecommendedActivity> = serde_json::from_str(&resp).unwrap();
        log::info!("{recomm:#?}");

        Ok(recomm)
    }
}