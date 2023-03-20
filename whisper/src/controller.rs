use actix_multipart::{Multipart, form::{MultipartForm, tempfile::TempFile}};
use actix_web::{ route, HttpResponse, guard::{self}, Result, web, HttpRequest};
use futures_util::stream::{TryStreamExt};
use futures_util::future::{FutureExt, Future};
use futures::{AsyncBufReadExt, AsyncWriteExt, AsyncWrite};
use crate::{ml::{
    whisper::{AudioData}, 
    chat::get_chat_response, tts::process_text_to_audio, prompt::GENERAL_CONTEXT}};
use serde_derive::{Deserialize, Serialize};


pub fn configure_service(cfg: &mut web::ServiceConfig) { 
    cfg
    .service(upload)
    // .service(
    //     web::resource("/ws")
    //         .route(web::post()
    //             .guard(guard::Header("upgrade", "websocket"))
    //             .to(index_ws)
    //     )
    // )
    ;
}

pub async fn ws_index(req: HttpRequest, stream: web::Payload) -> Result<HttpResponse> { 
    
    
    
    todo!()
}


/// An API endpoint that accepts user audio and settings for OpenAi response 
/// 
#[route("/", method = "POST", method = "GET")]
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
    let resp = get_chat_response(&transcribed, &GENERAL_CONTEXT).await?;
    
    log::info!("✉️ {:#?}", resp);

    // Send a post request to get a Text to Speech 
    let tts_response = process_text_to_audio(&resp)
        .await
        .unwrap();

    Ok(
        HttpResponse::Ok()
        .content_type("audio/mpeg")
        .body(tts_response)
    )

    // Ok(HttpResponse::Ok().into())

}