use actix_web::{web, Result, HttpResponse, route};




pub fn configure_audio_services(cfg: &mut web::ServiceConfig) {

} 


#[route("/api/daily/get-summary", method = "GET")]
pub async fn get_all_entries() -> Result<HttpResponse> { 
    todo!()
}