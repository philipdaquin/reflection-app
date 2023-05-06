use actix_web::{web, Result, HttpResponse, route};

use crate::{persistence::daily_db::{DailyAnalysisDb, DailyAnalysisInterface}, ml::response_types::dailydata::DailySummary};

use super::audio_data::InputDate;




pub fn configure_daily_summary(cfg: &mut web::ServiceConfig) { 
    cfg.service(get_by_date);
} 

/// 
/// 
/// Get the Daily Summary by Date 
#[route("/api/daily/get-by-date", method = "POST")]
pub async fn get_by_date(date: web::Json<InputDate>) -> Result<HttpResponse> { 
    let summary = DailyAnalysisDb::get_by_date(date.date)
        .await?
        .map(|f| DailySummary::from(f));
    
    log::info!("{summary:#?}");


    Ok(HttpResponse::Ok().json(summary))
}