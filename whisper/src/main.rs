use whisper::server::new_server;
use whisper::error::Result;
use dotenv::dotenv;

#[actix_web::main]
async fn main() -> Result<()> { 
    dotenv().ok();

    let backup = std::env::var("BACKUP_PORT")
        .unwrap_or("4001".to_string())
        .parse::<u32>()
        .unwrap_or(4001);

    let port = std::env::var("PORT")
        .ok()
        .and_then(|port| port.parse::<u32>().ok())
        .unwrap_or(backup);
        
    new_server(port)
        .await
        .map_err(Into::into)
}
