use std::{sync::Arc, io::Cursor};

use actix_multipart::{Multipart, form::{MultipartForm, tempfile::TempFile}};
use actix_web::{ route, HttpResponse, guard::{self}, Result, web, HttpRequest};
use futures_util::stream::{TryStreamExt, StreamExt};
use futures_util::future::{FutureExt, Future};
use futures::{AsyncBufReadExt, AsyncWriteExt, AsyncWrite};
use parking_lot::Mutex;
use crate::{ml::{
    whisper::{AudioData, get_summary, get_sentimental_analysis, get_tags}, 
    chat::get_chat_response, tts::process_text_to_audio, prompt::GENERAL_CONTEXT, sockets::{WebSocketSession}}};
use serde_derive::{Deserialize, Serialize};
use actix_web_actors::ws;

pub fn configure_service(cfg: &mut web::ServiceConfig) { 
    cfg
    .service(upload)
    .service(get_version)
    .service(get_text_summary)
    .service(get_text_analysis)
    .service(get_related_tags)
    .service(
        web::resource("/ws")
            .route(web::get()
                .guard(guard::Header("upgrade", "websocket"))
                .to(ws_handler)
        )
    )
    ;
}

#[route("/api/version", method = "GET")]
pub async fn get_version() -> &'static str { 
    return env!("CARGO_PKG_VERSION")
}

/// Websocket connection
async fn ws_handler(req: HttpRequest, stream: web::Payload) -> Result<HttpResponse> { 
    // Create a new WebSocket actor
    let res = ws::start(WebSocketSession::new(), &req, stream);
    log::info!("WebSocket connection established: {:?}", res);
    res
}

///
/// Get text summary instantly
/// id -> Audio summary id 
#[route("/api/summary", method = "GET")]
pub async fn get_text_summary(input: web::Path<String>) -> Result<HttpResponse> {

    let summary = get_summary(Some(input.to_string())).await.unwrap();
    Ok(HttpResponse::Ok().body(summary))
   
}

///
/// Get sentiment analysis from the transcript\
#[route("/api/analysis", method = "GET")]
pub async fn get_text_analysis(input: web::Path<String>) -> Result<HttpResponse> {

    let analysis = get_sentimental_analysis(Some(input.to_string())).await.unwrap();

    let serialized = serde_json::to_string(&analysis).unwrap();
    Ok(HttpResponse::Ok().body(serialized))
} 

#[route("/api/tags", method = "GET")]
pub async fn get_related_tags(input: web::Path<String>) -> Result<HttpResponse> {
    let analysis = get_tags(Some(input.to_string())).await.unwrap();

    let serialized = serde_json::to_string(&analysis).unwrap();
    Ok(HttpResponse::Ok().body(serialized))
} 


/// An API endpoint that accepts user audio and settings for OpenAi response 
/// 
#[route("/api/upload", method = "POST")]
pub async fn upload(mut payload: Multipart) -> Result<HttpResponse> {
    let mut transcribed = String::new();
    while let Some(mut item) = payload.try_next().await? { 
        let mut bytes = Vec::new();
        // Write the content of the file of the temporary file 
        while let Some(chunk) = item.try_next().await? { 
            bytes.extend_from_slice(&chunk);
        }
        let mut wav_data = AudioData::parse_wav_file(bytes).await.unwrap();
        transcribed = wav_data.transcribe_audio().await.unwrap();
    }
    // Send request to get OpenAI text response
    // let resp = get_chat_response(&transcribed, &GENERAL_CONTEXT).await?;
    
    // log::info!("✉️ {:#?}", resp);
    // Send a post request to get a Text to Speech 
    // let tts_response = process_text_to_audio(&resp)
    //     .await
    //     .unwrap();

    // Ok(
    //     HttpResponse::Ok()
    //     .content_type("audio/mpeg")
    //     .body(tts_response)
    // )

    Ok(HttpResponse::Ok().body(transcribed))

}