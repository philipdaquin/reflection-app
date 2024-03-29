
use std::sync::Arc;
use dotenv::dotenv;

use actix_web::{ middleware::Logger, App, HttpServer, web};
use actix_cors::Cors;
use crate::{persistence::{db::MongoDbClient}, controllers::{audio_data::configure_audio_services, ws::configure_ws_service, audio_analysis::configure_analysis_service, weekly_controller::configure_weekly_analysis_service, sse::configure_sse_services, daily_data::configure_daily_summary}, broadcast::Broadcaster};


pub async fn new_server(port: u32) -> std::io::Result<()> {
    dotenv().ok();
    
    
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    let url = std::env::var("MONGODB_URI").unwrap_or_else(|_| "mongodb://mongo-db:27017".into());

    let mongodb_client = MongoDbClient::establish_connection(&url)
        .await
        .expect("Unable to make a connection to MongoDB Server"); 
    // Fail fast

    // This createa new SSE Client
    let broadcaster = Broadcaster::create();
    log::info!("🚀 Starting HTTP server on port 'http://0.0.0.0:{}' ", port);
    log::info!("🤖 Connected to MongoDB!",);
    
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(mongodb_client.clone()))
            .app_data(web::Data::from(Arc::clone(&broadcaster)))
            .configure(configure_weekly_analysis_service)
            .configure(configure_analysis_service)
            .configure(configure_audio_services)
            .configure(configure_sse_services)
            .configure(configure_ws_service)
            .configure(configure_daily_summary)
            .wrap(Cors::permissive())
            .wrap(Logger::default())
    })
    .workers(3)
    .bind(format!("0.0.0.0:{}", port))?
    .run()
    .await
}