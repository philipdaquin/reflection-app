use actix_web::{web, Result, HttpResponse, route};

use crate::{persistence::daily_db::{DailyAnalysisDb, DailyAnalysisInterface}, ml::response_types::dailydata::DailySummary};

use super::audio_data::InputDate;




pub fn configure_daily_summary(cfg: &mut web::ServiceConfig) { 
    cfg
    .service(get_by_date)
    .service(get_all)
    .service(delete_all)
    ;
} 

#[route("/api/daily/get-all", method = "GET")]
pub async fn get_all() -> Result<HttpResponse> { 
    let analysis = DailyAnalysisDb::get_all()
        .await?
        .into_iter()
        .map(DailySummary::from)
        .collect::<Vec<DailySummary>>();

    Ok(HttpResponse::Ok().json(analysis))
}


/// 
/// 
/// Get the Daily Summary by Date 
#[route("/api/daily/get-by-date", method = "POST")]
pub async fn get_by_date(date: web::Json<InputDate>) -> Result<HttpResponse> { 


    log::warn!("{date:?}");


    let summary = DailyAnalysisDb::get_by_date(date.date)
        .await?
        .map(|f| DailySummary::from(f));
    
    log::info!("{summary:#?}");


    Ok(HttpResponse::Ok().json(summary))
}


///
/// Delete all Entries 
#[route("/api/daily/delete-all", method = "DELETE")]
pub async fn delete_all() -> Result<HttpResponse> { 
    let _ = DailyAnalysisDb::delete_all().await?;
    Ok(HttpResponse::Ok().body("Successfully deleted all items!"))
}