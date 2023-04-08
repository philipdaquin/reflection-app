use serde::{Serialize, Deserialize};
use crate::error::Result;

use super::{chat::get_chat_response, prompt::GENERATE_RECOMMENDATION};


#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct RecommendedActivity { 
    title: Option<String>,
    emoji: Option<String>,
    description: Option<String>
}

impl RecommendedActivity { 
    ///
    /// Generate 3 recommendations based on summaries 
    /// 
    #[tracing::instrument(fields(input, self), level= "debug")]
    pub async fn get_personalised_recommendations(summaries: Vec<String>) -> Result<Vec<Self>> { 
        
        // Serialise the array 
        let input = serde_json::to_string(&summaries).unwrap();
        
        // Send context and input to OpenAI 
        let resp = get_chat_response(&input, &GENERATE_RECOMMENDATION)
            .await
            .unwrap();

        // Deserialize the result 
        let recomm: Vec<Self> = serde_json::from_str(&resp).unwrap_or_default();
        
        Ok(recomm)
    }
}