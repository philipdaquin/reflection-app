
use actix_multipart::{Multipart};
use actix_web::{ route, HttpResponse, Result, web, HttpRequest};
use bson::oid::ObjectId;
use crate::{ml::{
    text_classification::TextClassification, recommendation::RecommendedActivity, weekly_pattern::WeeklyAnalysis},
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
    ;
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


#[route("/api/weekly/get-current-week", method = "GET")]
pub async fn get_current_week() -> Result<HttpResponse> { 
    todo!()
}

#[route("/api/weekly/get-current-week", method = "GET")]
pub async fn get_specific_day() -> Result<HttpResponse> { 
    todo!()
}


///
/// Retrieves the current week's summary 
#[route("/api/weekly/get-weekly-summary", method = "GET")]
pub async fn get_weekly_summary() -> Result<HttpResponse> { 

    // Get the first item 
    if let Some(item) = WeeklyAnalysisDB::get_first_item().await? { 
        let serialized = serde_json::to_string(&item).unwrap();
        
        log::info!("✅✅ FOUND ITEM ON DATBASE!!");
        
        
        Ok(HttpResponse::Ok().body(serialized))
    } else { 
        // Heavy computation 
        log::info!("Fetching to database..");

        let weekly_summary = WeeklyAnalysis::new()
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
        log::info!("✅✅✅✅ {weekly_summary:#?}");
        
        // let serialized = serde_json::to_string(&weekly_summary).unwrap();
        Ok(HttpResponse::Ok().json(weekly_summary))
    }

    // Save to database
}

 ///
/// Deletes all entries in Analysis DB
#[route("/api/weekly/delete-all", method = "DELETE")]
pub async fn delete_all_entries_analysis() -> Result<HttpResponse> { 
    let _ = WeeklyAnalysisDB::delete_all_entries().await?;
    Ok(HttpResponse::Ok().body("Successfully deleted all items!"))
}
