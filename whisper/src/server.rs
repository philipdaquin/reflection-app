
use actix_web::{ middleware::Logger, App, HttpServer};
use actix_cors::Cors;
use crate::{controller::{configure_service}};


pub async fn new_server(port: u32) -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    // transcribe_audio(Vec::new()).await.unwrap();
    
    log::info!("🚀 Starting HTTP server on port {} ", port);
    log::info!("📭 GraphiQL playground: http://localhost:{}/graphiql", port);
    log::info!("📢 Query at https://studio.apollographql.com/dev");
    
    HttpServer::new(move || {
        App::new()
            .configure(configure_service)
            .wrap(Cors::permissive())
            .wrap(Logger::default())
    })
    .workers(3)
    .bind(format!("127.0.0.1:{}", port))?
    .run()
    .await
}