use std::time::{Instant, Duration};

use actix::{prelude::{Addr}, Actor, AsyncContext, StreamHandler, ActorContext};
use actix_web::{web, HttpResponse, Result};
use actix_web_actors::ws;
use futures::TryStreamExt;
use parking_lot::Mutex;
use super::whisper::AudioData;
use futures_util::{SinkExt, StreamExt};
use std::sync::Arc;


const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(5);
const CLIENT_TIMEOUT: Duration = Duration::from_secs(10);

#[derive(Clone, Default)]
pub struct AppState { 
    conn: Arc<Mutex<Vec<Addr<WebSocketSession>>>>,
}

pub struct WebSocketSession { 
    state: Arc<AppState>,
    heartbeats: Instant

}

impl WebSocketSession { 
    pub fn new(state: Arc<AppState>) -> Self { 
        Self  { 
            state,
            heartbeats: Instant::now()
        }
    }
    fn send_heartbeats(&self, ctx: &mut <Self as Actor>::Context) { 
        ctx.run_interval(HEARTBEAT_INTERVAL, |act, ctx| {
            if Instant::now().duration_since(act.heartbeats) > CLIENT_TIMEOUT {
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
        let addr = ctx.address();
        self.send_heartbeats(ctx);
        
        
        self.state.conn.lock().push(addr);
    }

    fn stopped(&mut self, _: &mut Self::Context) {
        self.state
            .conn
            .lock()
            .retain(|addr| addr.connected());
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
                let connections = self.state.conn.lock();
                for conn in connections.iter() {
                    
                    // Once connected, do something to the data we are receiving 
                    if conn.connected() {
                        log::info!("RECEIVED MESSAGESSSSS ✅✅✅✅");
                    }
                }
            }, 
            Ok(ws::Message::Text(text)) => {
                // Handle text messages
                log::info!("Received text message: {}", text);
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

            _ => ctx.stop(),
        }
    }
}



// pub async fn ws_handler(mut stream: web::Payload) -> Result<HttpResponse> { 
//     let mut transcribed = String::new();

//     while let Some(audio_streams) = stream.try_next().await? { 
//         let mut wav_data = AudioData::parse_wav_file(audio_streams.to_vec()).await.unwrap();
//         let transcriber = tokio::spawn(async move {
//             return wav_data.transcribe_audio().await.unwrap();
//         });
//         transcribed = transcriber.await.unwrap();

//         log::info!("{}", transcribed);
//     }

//     Ok(HttpResponse::Ok().into())
// }