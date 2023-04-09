use actix_multipart::{Multipart};
use actix_web::{ route, HttpResponse, Result, web, HttpRequest};
use bson::oid::ObjectId;
use crate::{ml::{
    whisper::{AudioData, upload_audio}, 
    sockets::{WebSocketSession}, prompt::GENERAL_CONTEXT, chat::get_chat_response, tts::process_text_to_audio, text_classification::TextClassification, recommendation::RecommendedActivity}, persistence::{audio_db::{AudioDB, AudioInterface}, audio_analysis::{AnalysisDb, TextAnalysisInterface}}, error::ServerError};

use super::Input;


///
/// The configure service for audio data services  
pub fn configure_audio_services(cfg: &mut web::ServiceConfig) { 
    cfg
    .service(upload)
    .service(get_text_summary)
    .service(get_text_analysis)
    .service(get_related_tags)
    .service(chat_response)
    .service(get_entry)
    .service(update_entry)
    .service(delete_all_audio_entries)
    .service(delete_audio_entry)
    ;
}
///
/// Get text summary instantly
/// id -> Audio summary id 
#[route("/api/audio/summary", method = "POST")]
pub async fn get_text_summary(input: web::Json<Input>) -> Result<HttpResponse> {

    let id = match &input.id { 
        Some(i) => i,
        None => return Ok(HttpResponse::BadRequest().into())
    };

    
    // Get the AudioMeta from DB
    let mut audio = AudioDB::get_entry(id)   
        .await
        .map_err(|_| ServerError::NotFound(id.to_string()))?;

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
#[route("/api/audio/analysis", method = "POST")]
pub async fn get_text_analysis(input: web::Json<Input>) -> Result<HttpResponse> {

    let id = match &input.id { 
        Some(i) => i,
        None => return Ok(HttpResponse::BadRequest().into())
    };


    // Get the AudioData from Db 
    let mut audio = AudioDB::get_entry(id)
        .await
        .map_err(|_| ServerError::NotFound(id.to_string()))?;

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
#[route("/api/audio/tags", method = "POST")]
pub async fn get_related_tags(input: web::Json<Input>) -> Result<HttpResponse> {
    
    let id = match &input.id { 
        Some(i) => i,
        None => return Ok(HttpResponse::BadRequest().into())
    };

    // Get the AudioData from DB
    let audio = AudioDB::get_entry(id)
        .await
        .map_err(|_| ServerError::NotFound(id.to_string()))?;

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
#[route("/api/audio/upload", method = "POST")]
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
#[route("/api/audio/openai-chat", method = "POST")]
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

#[route("/api/audio/get-entry", method = "POST")]
pub async fn get_entry(input: web::Json<Input>) -> Result<HttpResponse> { 

    let id = match &input.id { 
        Some(i) => i,
        None => return Ok(HttpResponse::BadRequest().into())
    };
    
    log::info!("{id:?}");

    let audio = AudioDB::get_entry(id)
        .await
        .map_err(|_| ServerError::NotFound(id.to_string()))?;
    log::info!("{audio:#?}");
    // let serialized = serde_json::to_string(&audio).unwrap();
    Ok(HttpResponse::Ok().json(audio))
}


#[route("/api/audio/update-entry", method = "PUT")]
pub async fn update_entry(data: web::Json<AudioData>) -> Result<HttpResponse> { 
    let id = match &data.id { 
        Some(i) => i,
        None => return Ok(HttpResponse::BadRequest().into())
    };

    let audio = AudioDB::update_entry(id, &data).await?;
    
    log::info!("{audio:#?}");
    
    let serialized = serde_json::to_string(&audio).unwrap();
    Ok(HttpResponse::Ok().body(serialized))
}

#[route("/api/audio/delete-all", method = "DELETE")]
pub async fn delete_all_audio_entries() -> Result<HttpResponse> { 
    let _ = AudioDB::delete_all_entries().await?;
    Ok(HttpResponse::Ok().body("Successfully deleted all items!"))
}

///
/// Delete Both Text Analysis and Audio Data  
#[route("/api/audio/delete-entry", method = "DELETE")]
pub async fn delete_audio_entry(input: web::Json<Input>) -> Result<HttpResponse> { 
    let id = match &input.id { 
        Some(i) => i,
        None => return Ok(HttpResponse::BadRequest().into())
    };

    let audio = AudioDB::delete_one_entry(id).await?;
         
    Ok(HttpResponse::Ok().json(audio))
    
}

