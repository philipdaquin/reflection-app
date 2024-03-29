use actix_multipart::{Multipart};
use actix_web::{ route, http::header, HttpResponse, Result, web, HttpRequest};
use chrono::{NaiveDate, DateTime, Utc};
use serde::{Deserialize, Serialize};
use crate::{ml::{
    audio_transcription::{AudioDataDTO, upload_audio}, 
    prompt::GENERAL_CONTEXT, 
    chat::get_chat_response, 
    tts::process_text_to_audio, 
    response_types::{audiodata::AudioData, audioanalysis::AudioAnalysis}, daily_summary::DailySummaryDTO, weekly_pattern::WeeklyAnalysisDTO},
    persistence::{audio_db::{AudioDB, AudioInterface}, 
    audio_analysis::{AnalysisDb, TextAnalysisInterface}, daily_db::{DailyAnalysisDb, DailyAnalysisInterface}, weekly_db::{WeeklyAnalysisDB, WeeklyAnalysisInterface}}, 
    error::ServerError, controllers::openapi_key::OpenAIClient, broadcast::Broadcaster, 
};
use actix_web_lab::sse::{self, ChannelStream, Sse};


use super::{Input, eleven_labs::ElevenLabsClient, Progress};


///
/// The configure service for audio data services  
pub fn configure_audio_services(cfg: &mut web::ServiceConfig) { 
    cfg
    .service(upload)
    .service(get_all_entries)
    .service(get_all_by_date)
    .service(get_all_by_week)
    .service(get_current_week)
    .service(get_recent_entries)
    .service(get_text_summary)
    .service(get_text_analysis)
    .service(get_related_tags)
    .service(batch_upload)
    .service(get_entry)
    .service(chat_response)
    .service(update_entry)
    .service(delete_all_audio_entries)
    .service(delete_audio_entry)
    .service(updated_new_fields)
    ;
}
#[route("/api/audio/get-all", method = "GET")]
pub async fn get_all_entries() -> Result<HttpResponse> { 
    let res = AudioDB::get_all_entries()
        .await?
        .into_iter()
        .map(AudioData::from)
        .collect::<Vec<AudioData>>();

    Ok(HttpResponse::Ok().json(res))
}
#[route("/api/audio/update-fields", method = "PUT")]
pub async fn updated_new_fields() -> Result<HttpResponse> { 
    let res = AudioDB::update_fields()
        .await?
        .into_iter()
        .map(AudioData::from)
        .collect::<Vec<AudioData>>();

    Ok(HttpResponse::Ok().json(res))
}

#[derive(Deserialize, Debug, Clone, Default)]
pub struct InputDate { 
    pub date: DateTime<Utc>
}
///
/// Retrieves all entries by a specific date
#[route("/api/audio/get-all-by-date", method = "POST")]
pub async fn get_all_by_date(date: web::Json<InputDate>) -> Result<HttpResponse> {
    // log::info!("{date:?}");
    
    let res = AudioDB::get_all_by_date(date.date)
        .await?
        .into_iter()
        .map(AudioData::from)
        .collect::<Vec<AudioData>>();

    Ok(HttpResponse::Ok().json(res))
}
///
/// Retrieves all entries within the corresponding week by a specific date
#[route("/api/audio/get-all-by-week", method = "POST")]
pub async fn get_all_by_week(date: web::Json<InputDate>) -> Result<HttpResponse> {
    let res = AudioDB::get_all_by_week(date.date)
        .await?
        .into_iter()
        .map(AudioData::from)
        .collect::<Vec<AudioData>>();

    Ok(HttpResponse::Ok().json(res))
}
///
/// Retrieves all entries within the corresponding week by a specific date
#[route("/api/audio/get-current-week", method = "GET")]
pub async fn get_current_week() -> Result<HttpResponse> {
    let res = AudioDB::get_current_week()
        .await?
        .into_iter()
        .map(AudioData::from)
        .collect::<Vec<AudioData>>();

    Ok(HttpResponse::Ok().json(res))
}
///
/// Retrieves the recent audio journal entries 
#[route("/api/audio/get-recent", method = "GET")]
pub async fn get_recent_entries() -> Result<HttpResponse> {
    let res = AudioDB::get_recent()
        .await?
        .into_iter()
        .map(AudioData::from)
        .collect::<Vec<AudioData>>();

    Ok(HttpResponse::Ok().json(res))
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
    // let serialised = serde_json::to_string(&analysis).unwrap();

    Ok(HttpResponse::Ok().json(AudioAnalysis::from(analysis)))
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
    // let serialized = serde_json::to_string(&tags)?;

    Ok(HttpResponse::Ok().json(tags))
} 

/// 
/// REQUIRES: Bearer - apikey
/// An API endpoint that accepts user audio and settings for OpenAi response 
#[route("/api/audio/upload", method = "POST")]
pub async fn upload(
    req: HttpRequest, 
    payload: Multipart,
    broadcast: web::Data<Broadcaster>
) -> Result<HttpResponse> {
    // log::info!("✅✅ Initialising the key");
    
    if let Some(api_key) = req.headers().get("Authorization").and_then(|v| v.to_str().ok()) { 
        let key = api_key.strip_prefix("Bearer ").unwrap_or("");
        // Initialise OpenAIClient
        let _ = OpenAIClient::set_key(key).await?;
    } else { 
        return Ok(HttpResponse::Unauthorized().finish().into());
    }


    let mut progress = Progress::default();
    progress.progress += 10;
    broadcast.broadcast(&serde_json::to_string(&progress).unwrap()).await;

    let mut audio = upload_audio(payload).await?;
        
        progress.progress += 20;
        broadcast.broadcast(&serde_json::to_string(&progress).unwrap()).await;

        audio.get_summary().await?;

        progress.progress += 20;
        broadcast.broadcast(&serde_json::to_string(&progress).unwrap()).await;


        audio.get_sentimental_analysis().await?;
        
        progress.progress += 20;
        broadcast.broadcast(&serde_json::to_string(&progress).unwrap()).await;

        audio.clone()
            .get_tags()
            .await?
            .save()
            .await?;

        progress.progress += 30;
        broadcast.broadcast(&serde_json::to_string(&progress).unwrap()).await;

     //
    // Initialise / Update the Daily Summary 
    // - Check if there's a summary for the current day
    // If found, update the values
    // else, create a new summary
    // if let Some(summary) = DailyAnalysisDb
    // log::info!("✅✅ Creating a Daily Summary");

    let daily_summary = DailyAnalysisDb::get_by_date(audio.date.unwrap().to_chrono()).await?;
    
    if let Some(mut summary) = daily_summary { 
        // Check if its expired
        if !summary.is_expired() { 
            // Update the daily summary and save to database 
            summary.update().await?;
        } 
    
    } else { 
        // Create a new daily summary and save to database  
        // log::info!("✅✅ Creating a new Summary");

        DailySummaryDTO::new()
            .save()
            .await?
            .increment_entries()
            .await?;
    }   

    Ok(HttpResponse::Ok().json(AudioData::from(audio)))
}


#[route("/api/audio/batch-upload", method = "POST")]
pub async fn batch_upload(
    req: HttpRequest, 
    payload: Multipart,
    broadcast: web::Data<Broadcaster>
) -> Result<HttpResponse> { 
    if let Some(api_key) = req.headers().get(header::AUTHORIZATION).and_then(|v| v.to_str().ok()) { 
        let key = api_key.strip_prefix("Bearer ").unwrap_or("");
        // Initialise OpenAIClient
        let _ = OpenAIClient::set_key(key).await?;
    } else { 
        return Ok(HttpResponse::Unauthorized().finish().into());
    }

    let mut progress = Progress::default();
    progress.progress += 10;
    broadcast.broadcast(&serde_json::to_string(&progress).unwrap()).await;

    let mut audio = upload_audio(payload).await?;
        
        progress.progress += 20;
        broadcast.broadcast(&serde_json::to_string(&progress).unwrap()).await;

        audio.get_summary().await?;

        progress.progress += 20;
        broadcast.broadcast(&serde_json::to_string(&progress).unwrap()).await;

        audio.get_sentimental_analysis().await?;
        progress.progress += 20;
        broadcast.broadcast(&serde_json::to_string(&progress).unwrap()).await;

        audio.clone()
            .get_tags()
            .await?
            .save()
            .await?;

        progress.progress += 30;
        broadcast.broadcast(&serde_json::to_string(&progress).unwrap()).await;

    //
    // Initialise / Update the Daily Summary 
    // - Check if there's a summary for the current day
    // If found, update the values
    // else, create a new summary
    // if let Some(summary) = DailyAnalysisDb
    // log::info!("✅✅ Creating a Daily Summary");

    let daily_summary = DailyAnalysisDb::get_by_date(audio.date.unwrap().to_chrono()).await?;
    
    if let Some(mut summary) = daily_summary { 
        // Check if its expired
        if !summary.is_expired() { 
            // Update the daily summary and save to database 
            summary.update().await?;
        } 
    
    } else { 
        // Create a new daily summary and save to database  
        // log::info!("✅✅ Creating a new Summary");

        DailySummaryDTO::new()
            .save()
            .await?
            .increment_entries()
            .await?;
    }   


    Ok(HttpResponse::Ok().json(AudioData::from(audio)))
}


///
///  Allows for 1 on 1 chat with the user with AI
/// 
///     X-API-KEY-OPENAI
///     X-API-KEY-ELEVENLABS
/// 
///  Transcribes user audio and return MMPEG back to the user 
#[route("/api/audio/openai-chat", method = "POST")]
pub async fn chat_response(req: HttpRequest, payload: Multipart) -> Result<HttpResponse> {
    
    // Initialise eleven labs client and open ai client 
    if let Some(openai) = req.headers()
        .get("X-API-KEY-OPENAI")
        .and_then(|v| v.to_str().ok())
    { 
        let _ = OpenAIClient::set_key(openai).await?;
    }
    
    if let Some(elevenlabs) = req.headers()
        .get("X-API-KEY-ELEVENLABS")
        .and_then(|v| v.to_str().ok()) 
    { 
        let _ = ElevenLabsClient::set_key(elevenlabs).await?;
    }
    
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
    
    // log::info!("{id:?}");

    let audio = AudioDB::get_entry(id)
        .await
        .map_err(|_| ServerError::NotFound(id.to_string()))?;
    // log::info!("{audio:#?}");
    // let serialized = serde_json::to_string(&audio).unwrap();
    Ok(HttpResponse::Ok().json(AudioData::from(audio)))
}

///
/// 
#[route("/api/audio/update-entry", method = "PUT")]
pub async fn update_entry(data: web::Json<AudioData>) -> Result<HttpResponse> { 
    
    let data = data.into_inner();
    let audio_data = AudioDataDTO::from(data);

    let id = match &audio_data.id { 
        Some(i) => i.to_string(),
        None => return Ok(HttpResponse::BadRequest().into())
    };
    let audio = AudioDB::update_entry(&id, &audio_data).await?;
    
    // log::info!("{audio:#?}");
    
    Ok(HttpResponse::Ok().json(AudioData::from(audio)))
}

///
/// Delete all Audio Data entries
#[route("/api/audio/delete-all", method = "DELETE")]
pub async fn delete_all_audio_entries() -> Result<HttpResponse> { 
    let _ = AudioDB::delete_all_entries().await?;
    Ok(HttpResponse::Ok().body("Successfully deleted all items!"))
}

///
/// Delete all records on AudioData including TextClassification Data 
#[route("/api/audio/delete-entry", method = "DELETE")]
pub async fn delete_audio_entry(input: web::Json<Input>) -> Result<HttpResponse> { 
    
    let id = match &input.id { 
        Some(i) => i,
        None => return Ok(HttpResponse::BadRequest().into())
    };

    let audio = AudioDB::delete_one_entry(id).await?;
    
    if let Some(text) = audio.and_then(|analysis| analysis.text_classification)  { 
        // log::info!("🏃‍♂️");
        
        let bson = text.id.expect("Unable to read id for TextClassification");
        AnalysisDb::delete_one_analysis(bson).await.unwrap();
    } 
         
    Ok(HttpResponse::Ok().into())
    
}

