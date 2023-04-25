use actix_http::{StatusCode, header};
use actix_web::{web, Result, HttpResponse, route, Responder};
use parking_lot::Mutex;
use actix_web_lab::sse;
use crate::broadcast::Broadcaster;

///
/// Create a new client connection to the broadcaster, which allows the 
/// client to receive SSE events from the broadcaster in real time as they are generated
#[route("/api/audio/events", method = "GET")]
pub async fn sse_handler(broadcaster: web::Data<Mutex<Broadcaster>>) -> impl Responder { 
    let rx = broadcaster
        .lock()
        .new_client()
        .await;
    rx
}