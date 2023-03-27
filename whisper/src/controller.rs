use std::sync::Arc;

use actix_multipart::{Multipart, form::{MultipartForm, tempfile::TempFile}};
use actix_web::{ route, HttpResponse, guard::{self}, Result, web, HttpRequest};
use futures_util::stream::{TryStreamExt, StreamExt};
use futures_util::future::{FutureExt, Future};
use futures::{AsyncBufReadExt, AsyncWriteExt, AsyncWrite};
use crate::{ml::{
    whisper::{AudioData}, 
    chat::get_chat_response, tts::process_text_to_audio, prompt::GENERAL_CONTEXT, sockets::{WebSocketSession}}};
use serde_derive::{Deserialize, Serialize};
use actix_web_actors::ws;

pub fn configure_service(cfg: &mut web::ServiceConfig) { 
    cfg
    .service(upload)
    .service(
        web::resource("/")
            .route(web::get()
                // .guard(guard::Header("upgrade", "websocket"))
                .to(ws_handler)
        )
    );
}

async fn ws_handler(req: HttpRequest, mut stream: web::Payload) -> Result<HttpResponse> { 
    
    // Create a new WebSocket actor
    let res = ws::start(WebSocketSession::new(), &req, stream);
    println!("WebSocket connection established: {:?}", res);

    res
   
}

/// An API endpoint that accepts user audio and settings for OpenAi response 
/// 
#[route("/upload", method = "POST", method = "GET")]
pub async fn upload(mut payload: Multipart) -> Result<HttpResponse> {
    let mut transcribed = String::new();
    while let Some(mut item) = payload.try_next().await? { 
        // A multipart stream has to contain `contain_disposition`
        let content = item.content_disposition();
        log::info!("{}", content.to_owned()); 
        
        let mut bytes = Vec::new();
        // Write the content of the file of the temporary file 
        while let Some(chunk) = item.try_next().await? { 
            bytes.extend_from_slice(&chunk);
        }
        let mut wav_data = AudioData::parse_wav_file(bytes).await.unwrap();
    
        // Transfer audio file into a worker 
        let transcriber = tokio::spawn(async move {
            return wav_data.transcribe_audio().await.unwrap();
        });

        transcribed = transcriber.await.unwrap();

        log::info!("{}", transcribed);
        
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

    Ok(HttpResponse::Ok().into())

}