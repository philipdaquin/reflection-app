use std::sync::Arc;

use actix_web::{get, middleware::Logger, route, web, App, HttpServer, Responder};
use actix_cors::Cors;
use parking_lot::Mutex;

use crate::{controller::configure_service, ml::sockets::{WebSocketSession, AppState}};


pub async fn new_server(port: u32) -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    // transcribe_audio(Vec::new()).await.unwrap();
    
    log::info!("🚀 Starting HTTP server on port {} ", port);
    log::info!("📭 GraphiQL playground: http://localhost:{}/graphiql", port);
    log::info!("📢 Query at https://studio.apollographql.com/dev");
    
    let app_state = AppState::default();

    HttpServer::new(move || {
        App::new()
            .app_data(app_state.clone())
            .configure(configure_service)
            .wrap(Cors::permissive())
            .wrap(Logger::default())
    })
    .workers(2)
    .bind(format!("127.0.0.1:{}", port))?
    .run()
    .await
}