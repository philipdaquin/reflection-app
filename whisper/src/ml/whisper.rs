use actix_multipart::Multipart;
use hyper_tls::HttpsConnector;
use lazy_static::lazy_static;
use serde_derive::{Deserialize, Serialize};
use serde_json::Value;
use std::time::Duration;

use actix_web::{Result};
use hyper::{header, Body, Client, Request, body::{aggregate, Buf}};
use dotenv::dotenv;

use crate::controllers::openapi_key::OpenAIClient;

#[derive(Debug, Deserialize, Default)]
struct WhisperResponse { 
    text: Option<String>
}

/*

    Return the Audio transcription using Whisper AI

*/
pub async fn transcribe_audio_in_whisper(buffer: &Vec<u8>) -> Result<String> { 
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
    
    
    let request = Request::post(endpoint_url) 
        .header("Authorization", &header)
        .header("Content-Type", "multipart/form-data")
        .body(Body::from(buffer.to_owned()))?;

    // Send the request and await the response
    let resp = client.request(request)
        .await
        .unwrap_or_default();
    // Error Check 
    if (!resp.status().is_success()) { 
        log::error!("API call failed with status: {:#?}", resp.status());
        return Ok(String::new());
    }

    let body_bytes = hyper::body::to_bytes(resp.into_body())
        .await
        .unwrap_or_default();
    let response_json: WhisperResponse = serde_json::from_slice(&body_bytes)?;

    if let Some(transcript) = response_json.text { 
        return Ok(transcript.to_string());
    } 

    Ok(String::new())

}