use std::io::Write;

use actix_multipart::{Multipart, form::{MultipartForm, tempfile::TempFile}};
use actix_web::{get, middleware::Logger, route, 
    App, HttpServer, Responder, HttpResponse, HttpRequest, guard, Result, web};
use futures_util::stream::{TryStreamExt};
use futures::{AsyncBufReadExt, AsyncWriteExt, AsyncWrite};
use tempfile::NamedTempFile;
use crate::ml::{whisper::{parse_wav_file, transcribe_audio}, chat::get_chat_response, tts::process_text_to_audio};


pub fn configure_service(cfg: &mut web::ServiceConfig) { 
    cfg
    .service(upload)
    // .service(
    //     web::resource("/graphiql")
    //         .route(web::get()
    //             .guard(guard::Header("upgrade", "websocket"))
    //             // .to(index_ws)
    //     )
    // )
    ;
}


#[route("/", method = "POST")]
pub async fn upload(mut payload: Multipart) -> Result<HttpResponse> {
    let mut transcribed = String::new();
    while let Some(mut item) = payload.try_next().await? { 
        // A multipart stream has to contain `contain_disposition`
        let content = item.content_disposition();

        log::info!("{}", content.to_owned());

        let mut temp_file = NamedTempFile::new().unwrap();

        // Write the content of the file of the temporary file 
        while let Some(chunk) = item.try_next().await? { 
            temp_file.write_all(&chunk)?;
        }

        // Parse the contents to a WavReader object 
        let wav_file = parse_wav_file(&temp_file).await;

        // Transfer audio file into a worker 
        transcribed = transcribe_audio(wav_file).await.unwrap();
        log::info!("{}", transcribed);

        temp_file.close().unwrap();
    }

    let resp = get_chat_response(&transcribed).await?;
    
    // Send 
    let tts_response = process_text_to_audio(&resp)
        .await
        .unwrap();

    Ok(
        HttpResponse::Ok()
        .content_type("audio/mpeg")
        .body(tts_response)
    )
}