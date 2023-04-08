
use actix_multipart::{Multipart};
use actix_web::{ route, HttpResponse, Result, web, HttpRequest};
use crate::{ml::{
    whisper::{AudioData, upload_audio}, 
    sockets::{WebSocketSession}, prompt::GENERAL_CONTEXT, chat::get_chat_response, tts::process_text_to_audio, text_classification::TextClassification, recommendation::RecommendedActivity}, persistence::{audio_db::{AudioDB, AudioInterface}, audio_analysis::{AnalysisDb, TextAnalysisInterface}}, error::ServerError};
use serde_derive::{Deserialize};
use actix_web_actors::ws;

pub fn configure_service(cfg: &mut web::ServiceConfig) { 
    cfg
    .service(upload)
    .service(get_version)
    .service(get_text_summary)
    .service(get_text_analysis)
    .service(get_related_tags)
    .service(chat_response)
    .service(get_mood_summary)
    .service(get_entry)
    .service(update_entry)
    // .service(
    //     web::resource("/ws")
    //         .route(web::get()
    //             .guard(guard::Header("upgrade", "websocket"))
    //             .to(ws_handler)
    //     )
    // )
    ;
}

#[route("/api/version", method = "GET")]
pub async fn get_version() -> &'static str { 
    return env!("CARGO_PKG_VERSION")
}

/// Websocket connection
async fn ws_handler(req: HttpRequest, stream: web::Payload) -> Result<HttpResponse> { 
    // Create a new WebSocket actor
    let res = ws::start(WebSocketSession::new(), &req, stream);
    log::info!("WebSocket connection established: {:?}", res);
    res
}

#[derive(Deserialize, Debug)]
pub struct Input { 
    // Should now be the id 
    #[serde(rename = "_id")]
    pub id: String 
}

///
/// Get text summary instantly
/// id -> Audio summary id 
#[route("/api/summary", method = "POST")]
pub async fn get_text_summary(input: web::Json<Input>) -> Result<HttpResponse> {

    // Get the AudioMeta from DB
    let mut audio = AudioDB::get_entry(&input.id)   
        .await
        .map_err(|_| ServerError::NotFound(input.id.to_string()))?;
    // Check if a Transcription is prepared

    // Check if Summary exists
    if let Some(summary) = audio.summary { 
        return Ok(HttpResponse::Ok().body(summary))
    } 
    
    // Get the summary and save on database
    let summary = audio.get_summary()
        .await?
        .save()
        .await?
        .summary
        .unwrap();

    Ok(HttpResponse::Ok().body(summary))
}

///
/// Get sentiment analysis from the transcript
#[route("/api/analysis", method = "POST")]
pub async fn get_text_analysis(input: web::Json<Input>) -> Result<HttpResponse> {
    // Get the AudioData from Db 
    let mut audio = AudioDB::get_entry(&input.id)
        .await
        .map_err(|_| ServerError::NotFound(input.id.to_string()))?;

    if let Some(analysis) = audio.text_classification { 
        let serialised = serde_json::to_string(&analysis)?;
        
        return Ok(HttpResponse::Ok().body(serialised))
    }
    
    // Get sentiment analysis and save it on the database 
    let analysis = audio
        .get_sentimental_analysis()
        .await?
        .save()
        .await?
        .text_classification
        .unwrap();
    let serialised = serde_json::to_string(&analysis).unwrap();

    Ok(HttpResponse::Ok().body(serialised))
} 

/// Get related tags from the transcript 
#[route("/api/tags", method = "POST")]
pub async fn get_related_tags(input: web::Json<Input>) -> Result<HttpResponse> {
    // Get the AudioData from DB
    let audio = AudioDB::get_entry(&input.id)
        .await
        .map_err(|_| ServerError::NotFound(input.id.to_string()))?;

    if let Some(tags) = audio.tags {
        let serialised = serde_json::to_string(&tags).unwrap();
        
        return Ok(HttpResponse::Ok().body(serialised))
    } 

    let tags = audio.get_tags()
        .await?
        .save()
        .await?
        .tags
        .unwrap();
    let serialized = serde_json::to_string(&tags)?;

    Ok(HttpResponse::Ok().body(serialized))
} 


/// An API endpoint that accepts user audio and settings for OpenAi response 
/// 
#[route("/api/upload", method = "POST")]
pub async fn upload(payload: Multipart) -> Result<HttpResponse> {
    let audio = upload_audio(payload)
        .await?
        .get_summary()
        .await?
        .get_sentimental_analysis()
        .await?
        .get_tags()
        .await?
        .save()
        .await?;
    log::info!("{audio:#?}");
    let serialized = serde_json::to_string(&audio)?;
    Ok(HttpResponse::Ok().body(serialized))
}

///
///  Allows for 1 on 1 chat with the user with AI
///  Transcribes user audio and return MMPEG back to the user 
#[route("/api/openai-chat", method = "POST")]
pub async fn chat_response(payload: Multipart) -> Result<HttpResponse> {
    let transcribed = upload_audio(payload)
        .await?
        .transcription
        .unwrap();
    
    // Send request to get OpenAI text response
    let resp = get_chat_response(&transcribed, &GENERAL_CONTEXT).await?;
    
    // Send a post request to get a Text to Speech 
    let tts_response = process_text_to_audio(&resp)
        .await?;
    Ok(
        HttpResponse::Ok()
        .content_type("audio/mpeg")
        .body(tts_response)
    )
}
///
/// Retrieves items from the last 7 days 
#[route("/api/mood-summary-update", method = "GET")]
pub async fn get_mood_summary() -> Result<HttpResponse> { 
    let res = AnalysisDb::get_recent().await?;
    let serialized = serde_json::to_string(&res).unwrap();

    log::info!("{serialized:#?}");

    Ok(HttpResponse::Ok().body(serialized))

}
#[route("/api/get-entry", method = "POST")]
pub async fn get_entry(input: web::Json<Input>) -> Result<HttpResponse> { 

    let audio = AudioDB::get_entry(&input.id)
        .await
        .map_err(|_| ServerError::NotFound(input.id.to_string()))?;
    log::info!("{audio:#?}");
    let serialized = serde_json::to_string(&audio).unwrap();
    Ok(HttpResponse::Ok().body(serialized))
}

#[route("/api/update-entry", method = "PUT")]
pub async fn update_entry(data: web::Json<AudioData>) -> Result<HttpResponse> { 
    let audio = AudioDB::update_entry(&data.id, &data).await?;
    
    log::info!("{audio:#?}");
    
    let serialized = serde_json::to_string(&audio).unwrap();
    Ok(HttpResponse::Ok().body(serialized))
}

/// 
/// Generate the weekly summary for the user 
#[route("/api/get-common-mood", method = "GET")]
pub async fn get_common_mood() -> Result<HttpResponse> { 
    let mood = TextClassification::get_most_common_moods().await.unwrap();
    
    log::info!("{mood:?}");
    
    let serialized = serde_json::to_string(&mood).unwrap();
    Ok(HttpResponse::Ok().body(serialized))
}

#[route("/api/get-weekly-summary", method = "GET")]
pub async fn get_weekly_patterns() -> Result<HttpResponse>  { 
    let mood_patterns = TextClassification::get_weekly_patterns().await.unwrap();
    
    
    let serialized = serde_json::to_string(&mood_patterns).unwrap();
    Ok(HttpResponse::Ok().body(serialized))
}

#[derive(Deserialize, Debug)]
pub struct Summaries { 
    summaries: Option<Vec<String>>
}

#[route("/api/get-weekly-recommendation", method = "POST")]
pub async fn get_weekly_recommendation(input: web::Json<Summaries>) -> Result<HttpResponse> { 

    let summaries = input.into_inner().summaries;

    if summaries.is_none() {
        return Ok(HttpResponse::NotAcceptable().into())
    }
    let recommendation = RecommendedActivity::get_personalised_recommendations(summaries.unwrap()).await.unwrap();

    let serialized = serde_json::to_string(&recommendation).unwrap();
    Ok(HttpResponse::Ok().body(serialized))
}