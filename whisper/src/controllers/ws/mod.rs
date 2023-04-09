use actix_web_actors::ws;
use actix_web::{HttpResponse, Result, web, HttpRequest, guard};

use crate::ml::sockets::WebSocketSession;

pub fn configure_ws_service(cfg: &mut web::ServiceConfig) { 
    cfg
    .service(
        web::resource("/ws")
            .route(web::get()
                .guard(guard::Header("upgrade", "websocket"))
                .to(ws_handler)
        )
    )
    ;
}
/// Websocket connection
pub(crate) async fn ws_handler(req: HttpRequest, stream: web::Payload) -> Result<HttpResponse> { 
    // Create a new WebSocket actor
    let res = ws::start(WebSocketSession::new(), &req, stream);
    log::info!("WebSocket connection established: {:?}", res);
    res
}
