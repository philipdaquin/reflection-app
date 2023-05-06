
use std::sync::Arc;

use actix_web::{ middleware::Logger, App, HttpServer, web};
use actix_cors::Cors;
use crate::{persistence::db::MongoDbClient, controllers::{audio_data::configure_audio_services, ws::configure_ws_service, audio_analysis::configure_analysis_service, weekly_controller::configure_weekly_analysis_service, sse::configure_sse_services, daily_data::configure_daily_summary}, broadcast::Broadcaster};


pub async fn new_server(port: u32) -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let mongodb_client = MongoDbClient::establish_connection()
        .await
        .expect("Unable to establish MongoDB connection");

    // This createa new SSE Client
    let broadcaster = Broadcaster::create();
    log::info!("🚀 Starting HTTP server on port {} ", port);
    log::info!("📭 GraphiQL playground: http://localhost:{}/graphiql", port);
    log::info!("📢 Query at https://studio.apollographql.com/dev");
    
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
    .bind(format!("127.0.0.1:{}", port))?
    .run()
    .await
}