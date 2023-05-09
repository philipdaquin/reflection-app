
use actix_http::header;
use actix_multipart::{Multipart};
use actix_web::{ route, HttpResponse, Result, web, HttpRequest};
use bson::oid::ObjectId;
use crate::{ml::{
    text_classification::TextClassification, recommendation::RecommendedActivity, weekly_pattern::WeeklyAnalysisDTO, response_types::weeklydata::WeeklyAnalysis},
    persistence::{audio_analysis::{AnalysisDb, TextAnalysisInterface}, weekly_db::{WeeklyAnalysisDB, WeeklyAnalysisInterface}}, error::ServerError};
use serde_derive::{Deserialize};

use super::{Input, openapi_key::OpenAIClient, audio_data::InputDate};

///
/// The configure service for text analysis services 
pub fn configure_weekly_analysis_service(cfg: &mut web::ServiceConfig) { 
    cfg
    .service(get_weekly_summary)
    .service(delete_all_entries_analysis)
    .service(get_current_avg)
    .service(get_current_week)
    .service(get_all)
    .service(get_one)
    
    ;
}

/// 
/// Retrieve a Weekly Summary using a specific date
/// Uses:
/// - Get Last Week's Data
#[route("/api/weekly/get-by-date", method = "POST")]
pub async fn get_by_date(date: web::Json<InputDate>) -> Result<HttpResponse> { 
    let data = WeeklyAnalysisDB::get_corresponding_week(date.date)
        .await?
        .and_then(|f| Some(WeeklyAnalysis::from(f)));
    Ok(HttpResponse::Ok().json(data))
}


#[route("/api/weekly/get-all", method = "GET")]
pub async fn get_all() -> Result<HttpResponse> { 

    let weekly = WeeklyAnalysisDB::get_all()
        .await?
        .into_iter()
        .map(|f| WeeklyAnalysis::from(f))
        .collect::<Vec<WeeklyAnalysis>>();

    Ok(HttpResponse::Ok().json(weekly))
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

/// 645746ae6f64a3dee48d0517
/// Gets the current week's summary and make sure this object is only updated after a new entry is inserted
/// This endpoint is `subscribed` to the client side and it's not meant for updating values or calling any external API
#[route("/api/weekly/get-current-week", method = "GET")]
pub async fn get_current_week() -> Result<HttpResponse> { 
    
    let weekly_analysis = WeeklyAnalysisDB::get_current_week().await?;

    // Check if the weekly analysis for this current week exist
    let week_dto = match weekly_analysis { 
        Some(mut i) if !i.is_expired() => i,
        _ => {
            log::info!("✅✅✅✅ Initialising a new Weekly DTO");
            // create a new Weekly Analysis, increment total count and save to database 
            let mut new = WeeklyAnalysisDTO::new()
                .save()
                .await
                .unwrap();
            new.increment_entries().await.unwrap();
            new
        }
    };  

    let week = WeeklyAnalysis::from(week_dto);

    log::info!("{week:#?}");


    // Ok(HttpResponse::Ok().into())
    Ok(HttpResponse::Ok().json(week))
}

///
/// Retrieves the current week's summary 
#[route("/api/weekly/get-weekly-summary", method = "GET")]
pub async fn get_weekly_summary(req: HttpRequest) -> Result<HttpResponse> { 
    // Header carries Open api
    if let Some(api_key) = req.headers().get(header::AUTHORIZATION).and_then(|v| v.to_str().ok()) { 
        let key = api_key.strip_prefix("Bearer ").unwrap_or("");
        // Initialise OpenAIClient
        let _ = OpenAIClient::set_key(key).await?;
    } else { 
        return Ok(HttpResponse::Unauthorized().finish().into());
    }
    
    
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

 ///
/// Deletes all entries in Analysis DB
#[route("/api/weekly/delete-entry", method = "DELETE")]
pub async fn delete_one(input: web::Json<Input>) -> Result<HttpResponse> { 
    let id = match &input.id { 
        Some(i) => i,
        None => return Ok(HttpResponse::BadRequest().into())
    };
    
    let bson = ObjectId::parse_str(id).expect("Unable to convert to ObjectId");

    let _ = WeeklyAnalysisDB::delete_one_analysis(bson).await?;
    Ok(HttpResponse::Ok().body("Successfully deleted all items!"))
}
