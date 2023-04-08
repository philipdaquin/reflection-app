use std::time::{Instant, Duration};

///
/// 
///  This feature won't be available for this time now 
/// 
/// 
/// 
/// 
/// 
/// 
/// 
use actix::{fut, Actor, AsyncContext, StreamHandler, ActorContext, WrapFuture, ContextFutureSpawner, Message, Handler, ActorFutureExt};
use actix_web::{Result, Error};
use actix_web_actors::{ws};
use bytes::Bytes;

use actix_http::ws::Item as WsItem;

const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(5);
const CLIENT_TIMEOUT: Duration = Duration::from_secs(10);

pub struct WebSocketSession { 
    heartbeats: Instant,
    buffer: Vec<u8>,
    tag: Vec<u8>,
    message_len: usize
}

impl WebSocketSession { 
    pub fn new() -> Self { 
        Self  { 
            heartbeats: Instant::now(),
            buffer: Vec::new(),
            tag: Vec::new(),
            message_len: 0 
        }
    }
    fn send_heartbeats(&self, ctx: &mut <Self as Actor>::Context) { 
        ctx.run_interval(HEARTBEAT_INTERVAL, |act, ctx| {
            if Instant::now().duration_since(act.heartbeats) > CLIENT_TIMEOUT {
                log::info!("Stopping client connection");
                ctx.stop();
                return;
            }

            ctx.ping(b"");
        });
    }
}

impl Actor for WebSocketSession { 
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        log::info!("Starting Websocket connection");
        
        let addr = ctx.address();
        self.send_heartbeats(ctx);
    }

    fn stopped(&mut self, _: &mut Self::Context) {
        log::info!("Stopping Websocket Session");
    }

}
// Handle the messages that are sent over the socket 
impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for WebSocketSession {
    fn handle(
        &mut self,
        msg: Result<ws::Message, ws::ProtocolError>,
        ctx: &mut Self::Context,
    ) {
        match msg {
            Ok(ws::Message::Binary(bin)) => {
                // ctx.notify(WhisperTranscribe(bin))        
                // ctx.binary(bin)
                ctx.text(format!("RECEIVED DATA"))        
            }, 
            Ok(ws::Message::Continuation(WsItem::FirstBinary(bin))) => {

                ctx.text("Received audio data!");
                if bin.len() < 8 { return ; }

                self.buffer.extend_from_slice(&bin[8..]);    
                // self.tag.copy_from_slice(&bin[0..8]);
                self.message_len = bin.len();   
            }, 
            Ok(ws::Message::Continuation(WsItem::Continue(bin))) =>  {

                if self.message_len > 0  {
                    // log::debug!("Continue: Received Data type continuation frame {bin:?}");
                    ctx.text("Continue data");
    
                    self.buffer.extend_from_slice(&bin);
                    self.message_len += bin.len();
                }

            },
            Ok(ws::Message::Continuation(WsItem::Last(bin))) => {
                // log::debug!("Last: Received Data type continuation frame {bin:?}");
                ctx.text("Final!");

                // self.buffer.extend_from_slice(&bin);

                // ctx.notify(WhisperTranscribe(self.buffer.clone().into()));     

            },
                
            Ok(ws::Message::Text(text)) => {
                println!("Received message: {}", text);
                ctx.text(format!("You said: {}", text));
            }
            Ok(ws::Message::Pong(_)) => { 
                self.heartbeats = Instant::now();
            }
            Ok(ws::Message::Ping(msg)) => { 
                self.heartbeats = Instant::now();
                ctx.pong(&msg)
            },
            Ok(ws::Message::Close(rea)) => { 
                ctx.close(rea);
                ctx.stop();
            }

            _ => {},
        }
    }
}

#[derive(Message)]
#[rtype(result = "Result<(), ()>")]
struct WhisperTranscribe(Bytes);

impl Handler<WhisperTranscribe> for WebSocketSession {
    type Result = Result<(), ()>;

    fn handle(&mut self, msg: WhisperTranscribe, ctx: &mut Self::Context) -> Self::Result {
        
        // let audio_data = tokio::spawn(async move {
        //     log::info!("🔉 Parsing Audio Data");
        //     // Parse audio data
        //     let data = AudioData::new((&msg.0).to_vec())
        //         .await
        //         .map_err(|err| format!("Error parsing audio data: {}", err))
        //         .expect("Unexpected error");
        //     log::info!("🔤 Transcribing Audio using Whisper");
        //     // Run audio data into Whisper AI
        //     data.transcription.unwrap()
        // });
        // let text_task = tokio::spawn(async move {
        //     let resp = audio_data.await.unwrap();
        //     // Send request to get OpenAI text response
        //     let chat_response = get_chat_response(&resp, &GENERAL_CONTEXT)
        //         .await
        //         .map_err(|e| format!("Error getting chat response: {e}"))
        //         .expect("Unexpected error");
        //     log::info!("✉️ {:#?}", resp);
        //     // Send a post request to get a Text to Speech 
        //     // let tts_response = process_text_to_audio(&resp)
        //     //     .await
        //     //     .unwrap();
        //     chat_response
        // });
        // // Wait for both task to finish 
        // let fut = async move { 
        //     let resp = text_task.await.unwrap();
        //     Ok(resp)
        // };
        // fut.into_actor(self).then(|res : Result<String, Error>, act, ctx| {
        //     if let Ok(data) = res { 
        //         ctx.text(data)
        //     } else { 
        //         ctx.close(Some(ws::CloseCode::Error.into()))
        //     }
        //     fut::ready(())
        // }).wait(ctx);

        

        Ok(())

    }
}