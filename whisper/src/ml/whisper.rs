use actix_multipart::Multipart;
use bson::oid::ObjectId;
use hound::{SampleFormat, WavReader};
use serde::{Serialize, Deserialize};
use std::{path::Path, sync::Arc, io::{BufReader, Cursor}};
use whisper_rs::{FullParams, SamplingStrategy, WhisperContext};
use crate::{error::{Result, ServerError}, ml::{SPEECH_ENGINE_MODEL, chat::get_chat_response, prompt::SUMMARISE_TEXT}, persistence::audio_db::{AudioDB, AudioInterface}};
use num_cpus;
use crate::ml::prompt::GET_TAGS;
use futures_util::stream::{TryStreamExt};
use actix_web::Result as ActixResult;
use super::text_classification::TextClassification;
use uuid::Uuid;

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct AudioData { 
    #[serde(rename = "_id")]
    pub id: String,
    pub transcription: Option<String>,
    pub summary: Option<String>,
    pub text_classification: Option<TextClassification>,
    pub tags: Option<Vec<String>>
}

impl AudioData { 

    /// Initialise AudioData by passing through Audio Data
    /// - Parse Audio Bytes into 16 Bytes 
    /// - Transcribe the Audio file
    /// - Return AudioData Object
    pub async fn new(wav: Vec<u8>) -> Result<Self> {
        // Generate a new UUID for the item 
        let id = uuid::Uuid::new_v4().to_string();
        let parsed_wav = parse_wav_file(wav).await?;
        let transcription = AudioData::transcribe_audio(parsed_wav)
            .await
            .map_err(|_| ServerError::MissingTranscript)
            .unwrap();
        
        Ok(Self { 
            id, 
            transcription: Some(transcription), 
            ..Default::default()
        })

    }
    ///
    /// Transcribe the given WAV FILE
    #[tracing::instrument(level= "debug")]
    pub async fn transcribe_audio(wav_data: Vec<i16>) -> Result<String> {
        let mut res = String::new();
    
        let mut samples = whisper_rs::convert_integer_to_float_audio(&wav_data);
        
        samples = whisper_rs::convert_stereo_to_mono_audio(&samples).expect("Failed to convert to mono audio");
        
        let path = format!("./models/{}", SPEECH_ENGINE_MODEL.to_string());
        // Whisper Model 
        let whisper_path = Path::new(&path);
        
        //
        // The decoding strategies are: 
        //  - Beam Search with 5 beams usng log probability for the score function 
        //  - Greedy decoding with best of 5 sampling. 
        let mut params = FullParams::new(SamplingStrategy::Greedy { best_of: 5});
        
        // Output into one single segment
        params.set_single_segment(true);
    
        
        params.set_print_realtime(true);
        params.set_print_progress(true);
        params.set_print_timestamps(false);    
        params.set_print_special(false);
        
        // Keep context between audio chunks 
        params.set_no_context(true);
        
        params.set_offset_ms(500);
    
        // Supress blank outputs
        params.set_suppress_blank(true);
    
        // Speed up audio by x2 (expect reduced accuracy)
        params.set_speed_up(false);
    
        // Audio length in milliseconds 
        params.set_duration_ms(3000);
        // params.set_duration_ms(0);
    
        // The max number of tokens per audio chunk     
        params.set_max_tokens(32);
        // params.set_max_tokens(0);
    
        // Partial encoder context for better performance 
        params.set_audio_ctx(0);
        // Non Speech
        // If the probability of the no speech token is higher than this value AND
        // the decoding has failed due to 'pr'
        params.set_no_speech_thold(0.6);
    
        // Temperature to increase when falling back when the decoding fails to 
        // meet either of the thresholds elow  
        params.set_temperature_inc(-1.0);
    
        // If the averate log probability is lower than this value, treat the decoding as failed 
        // params.set_logprob_thold(100.0);
        params.set_logprob_thold(-1.0);

    
        // Temperature to use for sampling 
        // - Sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random
        //   while lower values like 0.2 will make it more focused and deterministic
        //   If set to 0, the model will use log probability to automatically increase the temperature until certain 
        //   thresholds are hit
        params.set_temperature(0.0);   
    
        // Number of threads to use during computation
        params.set_n_threads(8);
    
        // Translate the source to english 
        params.set_translate(false);
        
    
        // Spoken language
        params.set_language(Some("en"));
    
        log::info!("{}", num_cpus::get());
    
        // Whisper context 
        let mut ctx = WhisperContext::new(&whisper_path.to_string_lossy()).expect("failed to open model");
        // Run the model 
        ctx.full(params, &samples).expect("failed to convert samples");
        
        // Get the number of generate segments
        let num_segments = ctx.full_n_segments();
    
    
        for i in 0..num_segments {
            let segment = ctx.full_get_segment_text(i).expect("failed to get segment");
            // let start_timestamp = ctx.full_get_segment_t0(i);
            // let end_timestamp = ctx.full_get_segment_t1(i);
            // let full_text = format!("[{} - {}]: {}", start_timestamp, end_timestamp, segment);
            res.push_str(&segment);
        }
        // Save in memory 
        log::info!("2. TRANSCRIPT {res}");
    
        Ok(res)
    }
    
    ///
    /// Get audio summary  
    #[tracing::instrument(level= "debug")]
    pub async fn get_summary(&mut self) -> Result<Self> { 
        if let Some(script) = &self.transcription { 
            let summary = get_chat_response(script, &SUMMARISE_TEXT).await.unwrap_or_default();
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
            let resp = get_chat_response(script, &GET_TAGS).await.unwrap_or_default();
            let res: Vec<String> = serde_json::from_str(&resp).unwrap_or_default();
            self.tags = Some(res);
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
            
            let new_analysis = TextClassification::new(&self.id)
                .get_text_analysis(&transcript)
                .await
                .unwrap();
            
            self.text_classification = Some(new_analysis);
        } else { 
            return Err(ServerError::MissingTranscript)
        }
        Ok(self.clone())
    }

    /// 
    /// Save object to database 
    #[tracing::instrument(level= "debug")]
    pub async fn save(&self) -> Result<Self> { 
        AudioDB::add_entry(self).await
    }

}

/// 
/// Parse the audio data as a WAV file 
#[tracing::instrument(level= "debug")]
pub async fn parse_wav_file(bytes: Vec<u8>) -> Result<Vec<i16>> {
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

/// Helper function for receiving and transcribing Audio into String
pub async fn upload_audio(mut payload: Multipart) -> ActixResult<AudioData> { 
    let mut bytes = Vec::new();
    while let Some(mut item) = payload.try_next().await? { 
        // Write the content of the file of the temporary file 
        while let Some(chunk) = item.try_next().await? { 
            bytes.extend_from_slice(&chunk);
        }
    }
    let wav_data = AudioData::new(bytes).await.unwrap();
    Ok(wav_data)
}