use actix::{Actor, Addr, StreamHandler, Message, Handler, MessageResult, dev::MessageResponse, AsyncContext};
use actix_multipart::{Multipart, form::{MultipartForm, tempfile::TempFile}};
use actix_web::{ route, HttpResponse, guard::{self}, Result, web, HttpRequest};
use futures_util::stream::{TryStreamExt};
use futures::{AsyncBufReadExt, AsyncWriteExt, AsyncWrite};
use crate::ml::{
    whisper::{parse_wav_file, transcribe_audio}, 
    chat::get_chat_response, tts::process_text_to_audio};
use bytes::Bytes;
use actix::ActorContext;
use actix_web_actors::ws::{Message::{Close, Binary, Ping, Text}, self,
    WebsocketContext, ProtocolError};
use serde_derive::{Deserialize, Serialize};

use actix::prelude::{Recipient};


pub fn configure_service(cfg: &mut web::ServiceConfig) { 
    cfg
    .service(upload)
    .service(
        web::resource("/ws/")
            .route(web::get()
                .guard(guard::Header("upgrade", "websocket"))
                .to(index_ws)
        )
    );
}

async fn index_ws(req: HttpRequest, stream: web::Payload) -> Result<HttpResponse> {
    todo!()
}

/// Define a message type to pass audio data between actors 
#[derive(Debug, Serialize, Deserialize, Message)]
#[rtype(result = "()")]
struct AudioData(Vec<u8>);

/// Define the actor to handle audio transcription 
struct AudioTranscriber { 
    sender: WebsocketContext<Self>
}

impl Actor for AudioTranscriber {
    type Context = WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        log::info!("Transcriber has started!")
    }
}

// Respond to incoming audio bytes streams
impl Handler<AudioData> for AudioTranscriber {
    type Result = ();

    fn handle(&mut self, msg: AudioData, ctx: &mut Self::Context) -> Self::Result {

        let runtime = actix_rt::System::new();

        let fut = async move { 
            let wav_data = parse_wav_file(msg.0).await.unwrap();
            let transcribed = transcribe_audio(wav_data).await.unwrap();
            // Send request to get OpenAI text response
            let resp = get_chat_response(&transcribed).await.unwrap();
            
            // Send a post request to get a Text to Speech 
            let tts_response = process_text_to_audio(&resp)
                .await
                .unwrap();
            // Send binary frame back to the user 
            ctx.binary(tts_response)
        };
        runtime.block_on(fut);
    }
}

/// Define a Websocket actor to handle incoming audio data and send transcribed text back
struct WebSocket { 
    transcriber: actix::prelude::Addr<AudioTranscriber>
}

impl Actor for WebSocket {
    type Context = WebsocketContext<Self>;
    fn started(&mut self, ctx: &mut Self::Context) {
        log::info!("Websocket Actor started!")
    }
}

// The StreamHandler trait is used to handle the messages that are sent over the socket 
impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for WebSocket {
    fn handle(&mut self, item: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        match item { 
            Ok(Binary(data)) => {   
                // Send the data to AudioTranscriber 
                let transcriber = self.transcriber.clone();
                
                transcriber.do_send(&data)
                
                ctx.add_message_stream(fut)

                // ctx.spawn(async move { 
                //     let _ = transcriber.send(AudioData((&data).to_vec())).await;
                // });
            },
            _ => ctx.stop()
        }
    }
}

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
        let wav_data = parse_wav_file(bytes).await.unwrap();
    
        // Transfer audio file into a worker 
        transcribed = transcribe_audio(wav_data).await.unwrap();
        log::info!("{}", transcribed);
        
    }
    // Send request to get OpenAI text response
    let resp = get_chat_response(&transcribed).await?;
    
    // Send a post request to get a Text to Speech 
    let tts_response = process_text_to_audio(&resp)
        .await
        .unwrap();

    // Ok(
    //     HttpResponse::Ok()
    //     .content_type("audio/mpeg")
    //     .body(tts_response)
    // )

    Ok(HttpResponse::Ok().into())

}