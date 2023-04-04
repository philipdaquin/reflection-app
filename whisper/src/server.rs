
use actix_web::{ middleware::Logger, App, HttpServer, web};
use actix_cors::Cors;
use crate::{controller::{configure_service}, persistence::db::MongoDbClient};


pub async fn new_server(port: u32) -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let mongodb_client = MongoDbClient::establish_connection()
        .await
        .expect("Unable to establish MongoDB connection");

    log::info!("🚀 Starting HTTP server on port {} ", port);
    log::info!("📭 GraphiQL playground: http://localhost:{}/graphiql", port);
    log::info!("📢 Query at https://studio.apollographql.com/dev");
    
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(mongodb_client.clone()))
            .configure(configure_service)
            .wrap(Cors::permissive())
            .wrap(Logger::default())
    })
    .workers(3)
    .bind(format!("127.0.0.1:{}", port))?
    .run()
    .await
}