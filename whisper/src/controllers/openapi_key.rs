use actix_web::{HttpRequest, HttpResponse, Result};
use once_cell::sync::OnceCell;

use crate::error::ServerError;


// User's Open API KEY in Singleton 
#[derive(Debug, Clone)]
pub struct OpenAIClient(pub String);
pub static OPENAI_KEY: OnceCell<OpenAIClient> = OnceCell::new();

/// Singleton implementation of MongoClient Connection 
#[inline]
pub(crate) fn get_open_ai_key() -> &'static OpenAIClient { 
    OPENAI_KEY.get().expect("Missing Open AI API key")
}

impl From<String> for OpenAIClient { 
    fn from(value: String) -> Self {
        Self(value)
    }
}


impl OpenAIClient { 
    ///
    /// Sets the new API key for Open AI Client 
    pub async fn set_key(req: HttpRequest) -> Result<&'static Self> {
        let open_api_key = req
            .headers()
            .get("X-API-KEY-OPENAI")
            .unwrap()
            .to_str()
            .map_err(|_| ServerError::Unauthorized)
            .map_err(|_| ServerError::MissingOpenAIAPIKey)
            .unwrap();
    
        // Store the current API key on singleton 
        let key = OpenAIClient::from(open_api_key.to_string());
        let _ = OPENAI_KEY.set(key);
        Ok(OPENAI_KEY.get().unwrap())
    }
    
    ///
    /// Get the API key from the user 
    pub fn get_key() -> String {
        get_open_ai_key().0.to_string()
    }

}