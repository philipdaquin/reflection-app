// use actix_multipart::Multipart;
// use hyper_tls::HttpsConnector;
// use lazy_static::lazy_static;
// use serde_derive::{Deserialize, Serialize};
// use serde_json::Value;
// use std::time::Duration;
// use actix_web::{Result, web::Form};
// use hyper::{header, Body, Client, Request, body::{aggregate, Buf}};
// use dotenv::dotenv;
// use std::io::{Error, ErrorKind};

// use crate::controllers::openapi_key::OpenAIClient;

// #[derive(Debug, Deserialize, Default, Clone, Serialize)]
// struct WhisperResponse { 
//     text: Option<String>
// }


// async fn send_to_whisper_api(audio_data: Vec<u8>) -> Result<String> {
//     dotenv().ok();
    
//     let token = OpenAIClient::get_key();
//     let header = format!("Bearer {}", token);
//     // Construct the API endpoint URL
//     let endpoint_url = format!("https://api.openai.com/v1/audio/transcriptions");



    
//     Ok(String::new()) 
// }


// /*
//     Return the Audio transcription using Whisper AI
// */
// pub async fn transcribe_audio_in_whisper(buffer: &Vec<u8>) -> Result<String> { 
//     dotenv().ok();

//     log::info!("Transcribing audio into Whisper");

//     let file_name = String::from("test");
//     let file_part = reqwest::multipart::Part::bytes(buffer.to_owned()).file_name(file_name);
//     let client = reqwest::Client::new();
//     let form = reqwest::multipart::Form::new()
//         .part("file", file_part)
//         .text("model", "whisper-1");
    
//     let token = OpenAIClient::get_key();
//     let header = format!("Bearer {}", token);
//     // Construct the API endpoint URL
//     let endpoint_url = format!("https://api.openai.com/v1/audio/transcriptions");

    
//     log::info!("Sending request to Whisper API");
//     let res = client
//         .post(endpoint_url)
//         .multipart(form)
//         .header("Authorization", header)
//         .header("Content-Type", "multipart/form-data")
//         .send();

//     // let resp = res.await.unwrap().bytes().await.unwrap_or_default();
//     // let response_json: WhisperResponse = serde_json::from_slice(&resp)?;

//     // if let Some(transcript) = response_json.text { 
//     //     log::info!("{:#?}", transcript.to_string());
        
//     //     return Ok(transcript.to_string());
//     // } 
    

//     match res.await {
//         Ok(r) => match r.text().await {
//             Ok(body_str) => {
//                 println!("{}", body_str);
//                 match serde_json::from_str(&body_str) {
//                     Ok(response) => {
//                         return Ok(response);
//                     }
//                     Err(e) => return Err(Error::new(ErrorKind::Other, e.to_string()).into()),
//                 };
//             }
//             Err(e) => Err(Error::new(ErrorKind::Other, e.to_string()).into()),
//         },
//         Err(e) => return Err(Error::new(ErrorKind::Other, e.to_string()).into()),
//     }

// }