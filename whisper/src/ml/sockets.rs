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


pub struct WebSocketSession { 
    heartbeats: Instant

}

impl WebSocketSession { 
    pub fn new() -> Self { 
        Self  { 
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

    }

    // fn stopped(&mut self, _: &mut Self::Context) {
    //     todo!()
    // }
}
// Handle the messages that are sent over the socket 
impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for WebSocketSession {
    fn handle(
        &mut self,
        msg: Result<ws::Message, ws::ProtocolError>,
        ctx: &mut Self::Context,
    ) {
        match msg {
            // Ok(ws::Message::Binary(bin)) => {
            //     todo!()
            // }, 
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