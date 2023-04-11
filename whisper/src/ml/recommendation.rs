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
    #[tracing::instrument(level= "debug")]
    pub async fn get_personalised_recommendations(summaries: Vec<String>) -> Result<Vec<Self>> { 
        // Testing 
        // let summaries_ = vec![
        //     "A person is feeling incredibly lonely and empty, unable to shake off the weight of loneliness. They wake up to a silent apartment and miss the sound of laughter, conversations, and hugs. Music is a painful reminder of what they have lost and they feel like they're drowning in a sea of sorrow. They are scared to reach out to someone and instead stay silent and pretend everything is fine, but it's not. They sit in the silence, listening to their own sadness, hoping to find".to_string(),
        //     "The text encourages the reader to take time to reflect on what they want out of life and to remember that they're not alone. It also encourages them not to give up on themselves and to reach out for help when needed. The message is that it's okay to feel overwhelmed and uncertain in difficult circumstances and that there are people who care and are willing to support them.".to_string(),
        //     "Despite the difficulty of the current situation, it is okay to feel overwhelmed and uncertain. Taking time to reflect on what one truly wants out of life and what steps one can take to make progress towards that can be helpful. There are people who care and want to support, and one should not give up on themselves and reach out for help when needed.".to_string(),
        // ];

        // Serialise the array  
        let input = serde_json::to_string(&summaries).unwrap();
        // Send context and input to OpenAI 
        let resp = get_chat_response(&input, &GENERATE_RECOMMENDATION)
            .await
            .unwrap();
        // Deserialize the result 
        let recomm: Vec<RecommendedActivity> = serde_json::from_str(&resp).unwrap();
        log::info!("🛏️🛏️ RESULT {recomm:#?}");

        Ok(recomm)
    }
}