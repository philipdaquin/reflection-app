use serde_derive::Deserialize;

use crate::error::Result;

use super::{chat::get_chat_response, prompt::ANALYSE_TEXT_SENTIMENT};


#[derive(Debug, Clone, Default, Deserialize)]
pub struct TextClassification { 
    positive: f32, 
    neutral: f32, 
    negative: f32
}

impl TextClassification { 
    ///
    /// Returns the TextClassification to a given text
    /// Some use cases are sentiment analysis, NLP interface, and assessing 
    /// grammatical correctness
    #[tracing::instrument(fields(input, self), level= "debug")]
    pub async fn get_text_analysis(&mut self, input: &str) -> Result<Self> { 
        let resp = get_chat_response(&input, &ANALYSE_TEXT_SENTIMENT).await.unwrap();
        let self_object: TextClassification = serde_json::from_str(&resp).unwrap();
        return Ok(self_object)
    }   
}