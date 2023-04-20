
use actix_multipart::{Multipart};
use actix_web::{ route, HttpResponse, Result, web, HttpRequest};
use bson::oid::ObjectId;
use crate::{ml::{
    text_classification::TextClassification, recommendation::RecommendedActivity, weekly_pattern::WeeklyAnalysisDTO, response_types::weeklydata::WeeklyAnalysis},
    persistence::{audio_analysis::{AnalysisDb, TextAnalysisInterface}, weekly_db::{WeeklyAnalysisDB, WeeklyAnalysisInterface}}, error::ServerError};
use serde_derive::{Deserialize};

use super::Input;

///
/// The configure service for text analysis services 
pub fn configure_weekly_analysis_service(cfg: &mut web::ServiceConfig) { 
    cfg
    .service(get_weekly_summary)
    .service(delete_all_entries_analysis)
    .service(get_current_avg)
    .service(get_current_week)
    ;
}


#[route("/api/weekly/get-one", method = "POST")]
pub async fn get_one(input: web::Json<Input>) -> Result<HttpResponse> {
    let id = match &input.id { 
        Some(i) => i,
        None => return Ok(HttpResponse::BadRequest().into())
    };
    let bson = ObjectId::parse_str(id).expect("Unable to convert to ObjectId");
    
    let data = WeeklyAnalysisDB::get_one_analysis(bson).await?;

    Ok(HttpResponse::Ok().json(WeeklyAnalysis::from(data)))
}

/// Fetch the new update average value 
#[route("/api/weekly/get-current-average", method = "POST")]
pub async fn get_current_avg(input: web::Json<Input>) -> Result<HttpResponse> { 

    let id = match &input.id { 
        Some(i) => i,
        None => return Ok(HttpResponse::BadRequest().into())
    };

    let bson = ObjectId::parse_str(id).expect("Unable to convert to ObjectId");

    // get id object
    let mut object = WeeklyAnalysisDB::get_one_analysis(bson).await?;
    // update the value 
    let avg = object
        .get_weekly_average()
        .await?
        .weekly_avg
        .unwrap_or_default();

    // return the single value 
    Ok(HttpResponse::Ok().json(avg))
}

/// 
/// Gets the current week's summary 
#[route("/api/weekly/get-current-week", method = "GET")]
pub async fn get_current_week() -> Result<HttpResponse> { 
    let weekly_analysis = WeeklyAnalysisDB::get_current_week()
        .await?
        .map(|f| WeeklyAnalysis::from(f));
    Ok(HttpResponse::Ok().json(weekly_analysis))
}

///
/// Retrieves the current week's summary 
#[route("/api/weekly/get-weekly-summary", method = "GET")]
pub async fn get_weekly_summary() -> Result<HttpResponse> { 
    if let Some(item) = WeeklyAnalysisDB::get_first_item().await? { 
        let serialized = serde_json::to_string(&item).unwrap();
        Ok(HttpResponse::Ok().body(serialized))
    } else { 
        let weekly_summary = WeeklyAnalysisDTO::new()
            .get_min_mood()
            .await?
            .get_max_mood()
            .await?
            .get_inflection_point()
            .await?
            .get_common_wood()
            .await?
            .get_weekly_average()
            .await?
            .get_total_entries()
            .await?
            .generate_recommendations()
            .await?
            .save()
            .await?;
        Ok(HttpResponse::Ok().json(WeeklyAnalysis::from(weekly_summary)))
    }
}

 ///
/// Deletes all entries in Analysis DB
#[route("/api/weekly/delete-all", method = "DELETE")]
pub async fn delete_all_entries_analysis() -> Result<HttpResponse> { 
    let _ = WeeklyAnalysisDB::delete_all_entries().await?;
    Ok(HttpResponse::Ok().body("Successfully deleted all items!"))
}
