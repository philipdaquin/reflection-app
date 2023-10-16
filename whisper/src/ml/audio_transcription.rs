use actix_multipart::Multipart;
use bson::{oid::ObjectId, DateTime};
use chrono::{ Utc, Datelike};
use futures::{Stream, AsyncWriteExt};
use hound::{SampleFormat, WavReader};
use parking_lot::{Mutex};
use serde::{Serialize, Deserialize};
use std::{path::Path,  io::{Cursor}, thread, sync::Arc};
// use whisper_rs::{FullParams, SamplingStrategy, WhisperContext};
use crate::{error::{Result, ServerError}, ml::{SPEECH_ENGINE_MODEL, chat::get_chat_response, prompt::SUMMARISE_TEXT}, persistence::audio_db::{AudioDB, AudioInterface}, controllers::TagResponse};
use num_cpus;
use crate::ml::prompt::GET_TAGS;
use futures_util::stream::{TryStreamExt, StreamExt};
use actix_web::{Result as ActixResult};
use super::{text_classification::TextClassification, whisper::transcribe_audio_in_whisper};
use rayon::prelude::*;
use crossbeam::channel::{unbounded};


const BATCH_SIZE: usize = 4096 ;

// Process audio data in chunks of 5 seconds * 44100 samples/second * 2 channels * 2 bytes/sample = 882000 bytes
const CHUNK_SIZE: usize = 882000;

const NUM_WORKERS: usize = 5;

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct AudioDataDTO { 
    // User Inputs 
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,
    pub title: Option<String>,
    pub image_url: Option<String>,
    pub audio_url: Option<String>,
    pub author: Option<String>,
    pub description: Option<String>,
    pub duration: Option<u64>,
    pub favourite: bool, 
    
    // Server Generated 
    // pub genre: Option<String>,

    pub date: Option<DateTime>,
    pub day: Option<String>,
    pub transcription: Option<String>,
    pub summary: Option<String>,
    pub text_classification: Option<TextClassification>,
    pub tags: Option<Vec<String>>
}

impl AudioDataDTO { 

    ///
    /// 
    /// Upload as a single chunk
    pub async fn new(bytes: Vec<u8>) -> Result<Self> { 
        let id = ObjectId::new().to_string();
        let created_date = Utc::now();
        let bson_date_time = bson::DateTime::from_chrono(created_date);

        let day = created_date.weekday().to_string();
        let transcription = transcribe_audio_in_whisper(&bytes).await?;

        Ok(Self { 
            id: Some(id), 
            transcription: Some(transcription),
            date: Some(bson_date_time), 
            day: Some(day), 
            ..Default::default()
        })
    }

    ///
    /// Transcribe the given WAV FILE
    #[tracing::instrument(level= "debug")]
    pub async fn transcribe_audio(wav_data: Vec<i16>) -> Result<String> {
        let mut res = String::new();
        
        



        Ok(res)
    }
    ///
    /// Get audio summary  
    #[tracing::instrument(level= "debug")]
    pub async fn get_summary(&mut self) -> Result<Self> { 
        if let Some(script) = &self.transcription { 
            let summary = get_chat_response(script, &SUMMARISE_TEXT).await.unwrap_or_default();

            log::info!("SUMMARY: {summary}");

            self.summary = Some(summary);
        } else { 
            return Err(ServerError::MissingTranscript)
        }
        Ok(self.clone())
    }
    ///
    /// Get tags related to the passage
    #[tracing::instrument(level= "debug")]
    pub async fn get_tags(mut self) -> Result<Self> { 
        if let Some(script) = &self.transcription { 
            let resp = get_chat_response(script, &GET_TAGS).await.unwrap();
            let res: TagResponse = serde_json::from_str(&resp).unwrap_or_default();
            log::info!("TAGS: {res:?}");
            self.tags = Some(res.response);
        } else { 
            return Err(ServerError::MissingTranscript)
        }
    
        Ok(self.clone())
    }
    ///
    /// Gets Sentimental analysis of transcribed text
    #[tracing::instrument(level= "debug")]
    pub async fn get_sentimental_analysis(&mut self) -> Result<Self> { 
        
        if let Some(transcript) = &self.transcription { 
            let new_analysis = TextClassification::new(self.id.clone())
                .await
                .get_text_analysis(&transcript)
                .await
                .unwrap();
            
            log::info!("TAGS: {new_analysis:?}");


            self.text_classification = Some(new_analysis);
        } else { 
            return Err(ServerError::MissingTranscript)
        }
        Ok(self.clone())
    }
    
    ///
    /// Deletes both AudioData and Analysis 
    #[tracing::instrument(level= "debug")]
    pub async fn delete_entry(id: ObjectId) -> Result<()> { 
        todo!()
    }
    
    /// 
    /// Save object to database 
    #[tracing::instrument(level= "debug")]
    pub async fn save(&self) -> Result<Self> { 
        log::info!("✅ Saving to database");

        AudioDB::add_entry(self).await
    }
}


/// 
/// Parse a single audio data chunk directly into 16 Hz format 
#[tracing::instrument(level= "debug")]
async fn parse_wav_file(bytes: Vec<u8>) -> Result<Vec<i16>> {
    log::info!("👷‍♂️ Parsing WaV FILE");
    // let reader = BufReader::new(&bytes[..]);
    // let wav_reader = WavReader::new(reader).unwrap();
    let mut reader = Cursor::new(&bytes);
    let wav_reader = WavReader::new(&mut reader).unwrap();
    
    let hound::WavSpec {
        channels,
        sample_rate,
        bits_per_sample,
        sample_format,
    } = wav_reader.spec();

    if channels != 1 {
        panic!("expected mono audio file");
    }
    if sample_format != SampleFormat::Int {
        panic!("expected integer sample format");
    }
    if sample_rate != 16000 {
        log::warn!("expected 16KHz sample rate");
    }
    if bits_per_sample != 16 {
        panic!("expected 16 bits per sample");
    }

    let wav_data = wav_reader
        .into_samples::<i16>()
        .map(|x| x.expect("sample"))
        .collect::<Vec<_>>();

    Ok(wav_data)

}

/// 
/// 
/// Split the payload into multiple smaller batches, which will be processed in parallel 
/// to reduce processing time 
pub async fn upload_single_chunk(mut payload: Multipart) -> Result<Vec<u8>> { 
    let mut bytes = Vec::new();
    while let Some(mut item) = payload.try_next().await.unwrap() { 
        // Write the content of the file of the temporary file 
        while let Some(chunk) = item.try_next().await.unwrap() { 
            bytes.write_all(&chunk).await?;
        }
    }
    Ok(bytes)
}


/// 
/// Helper function for uploading payload into a single chunk
/// Returns AudioData
pub async fn upload_audio(payload: Multipart) -> ActixResult<AudioDataDTO> { 
    // Chunk Audio into batches 
    let audio_batches = upload_single_chunk(payload).await?;
    let wav_data = AudioDataDTO::new(audio_batches).await.unwrap();
    Ok(wav_data)
}
