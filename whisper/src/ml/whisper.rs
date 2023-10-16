use hyper_tls::HttpsConnector;
use lazy_static::lazy_static;
use serde_derive::{Deserialize, Serialize};
use std::time::Duration;

use actix_web::{Result};
use hyper::{header, Body, Client, Request, body::{aggregate, Buf}};
use dotenv::dotenv;

use crate::controllers::openapi_key::OpenAIClient;

pub async fn transcribe_audio_in_whisper( ) -> Result<String> { 
    dotenv().ok();

    let https = HttpsConnector::new();
    let client = Client::builder()
        .http2_keep_alive_timeout(Duration::from_secs(60))
        .build(https);
    
    // Construct the API endpoint URL
    let endpoint_url = format!("https://api.openai.com/v1/audio/transcriptions");
    // Construct the request body 
    // let token = std::env::var("OPENAI_API_KEY").expect("Missing Open AI Token");
    let token = OpenAIClient::get_key();
    let header = format!("Bearer {}", token);


    Ok(String::new())

}