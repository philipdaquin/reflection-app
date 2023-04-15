use actix_web::{HttpRequest, HttpResponse, Result};
use once_cell::sync::OnceCell;

use crate::error::ServerError;


// User's Open API KEY in Singleton 
#[derive(Debug, Clone)]
pub struct ElevenLabsClient(pub String);
pub static ELEVEN_LABS_API_KEY: OnceCell<ElevenLabsClient> = OnceCell::new();

/// Singleton implementation of MongoClient Connection 
#[inline]
pub(crate) fn get_tts_ai_key() -> &'static ElevenLabsClient { 
    ELEVEN_LABS_API_KEY.get().expect("Missing Open AI API key")
}

impl From<String> for ElevenLabsClient { 
    fn from(value: String) -> Self {
        Self(value)
    }
}


impl ElevenLabsClient { 
    ///
    /// Sets the new API key for Open AI Client 
    pub async fn set_key(key: &str) -> Result<&'static Self> {
        // Store the current API key on singleton 
        let key = ElevenLabsClient::from(key.to_string());
        
        let _ = ELEVEN_LABS_API_KEY.set(key);
        Ok(ELEVEN_LABS_API_KEY.get().unwrap())
    }
    
    ///
    /// Get the API key from the user 
    pub fn get_key() -> String {
        get_tts_ai_key().0.to_string()
    }

}