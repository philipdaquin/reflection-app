use actix_http::{StatusCode, header};
use actix_web::{web, Result, HttpResponse, route, Responder};
use parking_lot::Mutex;
use actix_web_lab::sse;
use crate::broadcast::Broadcaster;



///
/// The configure service for audio data services  
pub fn configure_sse_services(cfg: &mut web::ServiceConfig) { 
    cfg
    .service(sse_handler);
}
///
/// Create a new client connection to the broadcaster, which allows the 
/// client to receive SSE events from the broadcaster in real time as they are generated
#[route("/api/audio/batch-upload/events", method = "GET")]
pub async fn sse_handler(broadcaster: web::Data<Broadcaster>) -> impl Responder { 
    broadcaster.new_client().await 
}