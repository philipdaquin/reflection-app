
use actix_multipart::{Multipart};
use actix_web::{ route, HttpResponse, Result, web, HttpRequest};
use bson::oid::ObjectId;
use crate::{ml::{
    text_classification::TextClassification, 
    recommendation::RecommendedActivity, 
    response_types::{weeklydata::WeeklyAnalysis, audioanalysis::AudioAnalysis}},
    persistence::{audio_analysis::{AnalysisDb, TextAnalysisInterface}, 
}, 
};
use serde_derive::{Deserialize};

use super::Input;

///
/// The configure service for text analysis services 
pub fn configure_analysis_service(cfg: &mut web::ServiceConfig) { 
    cfg
    .service(get_version)
    .service(get_mood_summary)
    .service(get_common_mood)
    .service(get_weekly_patterns)
    .service(delete_all_entries_analysis)
    .service(delete_entry)
    .service(get_weekly_recommendation)

    ;
}

#[route("/api/version", method = "GET")]
pub async fn get_version() -> &'static str { 
    return env!("CARGO_PKG_VERSION")
}

///
/// Retrieves items from the last 7 days 
#[route("/api/analysis/get-mood-summary", method = "GET")]
pub async fn get_mood_summary() -> Result<HttpResponse> { 
    let res = AnalysisDb::get_recent()
        .await?
        .into_iter()
        .map(AudioAnalysis::from)
        .collect::<Vec<AudioAnalysis>>();

    Ok(HttpResponse::Ok().json(res))
}

/// 
/// Generate the weekly summary for the user 
#[route("/api/analysis/get-common-mood", method = "GET")]
pub async fn get_common_mood() -> Result<HttpResponse> { 
    let mood = TextClassification::get_most_common_moods().await.unwrap();
    Ok(HttpResponse::Ok().json(mood))
}

///
/// 
/// Gets weekly patterns based on the last 3 entries 
#[route("/api/analysis/get-weekly-patterns", method = "GET")]
pub async fn get_weekly_patterns() -> Result<HttpResponse>  { 
    let mood_patterns = TextClassification::get_weekly_patterns()
        .await?
        .into_iter()
        .map(AudioAnalysis::from)
        .collect::<Vec<AudioAnalysis>>();
    Ok(HttpResponse::Ok().json(mood_patterns))
}

#[derive(Deserialize, Debug)]
pub struct Summaries { 
    summaries: Option<Vec<String>>
}
///
/// 
#[route("/api/analysis/get-weekly-recommendation", method = "POST")]
pub async fn get_weekly_recommendation(input: web::Json<Summaries>) -> Result<HttpResponse> { 
    
    let summaries = input.into_inner().summaries;

    if summaries.is_none() {
        return Ok(HttpResponse::NotAcceptable().into())
    }
    let recommendation = RecommendedActivity::get_personalised_recommendations(summaries.unwrap()).await.unwrap();

    Ok(HttpResponse::Ok().json(recommendation))
}

///
/// Deletes all entries in Analysis DB
#[route("/api/analysis/delete-all", method = "DELETE")]
pub async fn delete_all_entries_analysis() -> Result<HttpResponse> { 
    AnalysisDb::delete_all_entries().await?;
    Ok(HttpResponse::Ok().body("Successfully deleted all items!"))
}

///
/// Delete Both Text Analysis and Audio Data  
#[route("/api/analysis/delete-entry", method = "DELETE")]
pub async fn delete_entry(input: web::Json<Input>) -> Result<HttpResponse> { 
    let id = match &input.id { 
        Some(i) => i,
        None => return Ok(HttpResponse::BadRequest().into())
    };
    let bson = ObjectId::parse_str(id).expect("Unable to convert to ObjectId");

    let audio = AnalysisDb::delete_one_analysis(bson)
        .await?
        .map(|f| AudioAnalysis::from(f));
         
    Ok(HttpResponse::Ok().json(audio))
}

///
/// Filter query by 
/// - 24 hours,
/// - 7 Days, 
/// - 14 Days
/// - 30 Days, 
/// - Max
#[route("/api/analysis/filter", method = "DELETE")]
pub async fn filter_analysis() -> Result<HttpResponse> { 
    todo!()
}
