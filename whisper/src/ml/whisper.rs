use bytes::{Bytes, BytesMut};
use hound::{SampleFormat, WavReader};
use tempfile::NamedTempFile;
use std::path::Path;
use whisper_rs::{FullParams, SamplingStrategy, WhisperContext};
use crate::error::Result;
use std::io::Cursor;

use super::chat::get_chat_response;

/// Parse the audio data as a WAV file 
#[tracing::instrument(level= "debug")]
pub async fn parse_wav_file(mut bytes: Vec<u8>) -> Result<Vec<i16>> {
 
    let mut reader = Cursor::new(&bytes);
    let mut wav_reader = WavReader::new(&mut reader).unwrap();
    
    if wav_reader.spec().channels != 1 {
        panic!("expected mono audio file");
    }
    if wav_reader.spec().sample_format != SampleFormat::Int {
        panic!("expected integer sample format");
    }
    // if reader.spec().sample_rate != 16000 {
    //     panic!("expected 16KHz sample rate");
    // }
    if wav_reader.spec().bits_per_sample != 16 {
        panic!("expected 16 bits per sample");
    }

    let wav_data = wav_reader
        .into_samples::<i16>()
        .map(|x| x.expect("sample"))
        .collect::<Vec<_>>();

    Ok(wav_data)

}

#[tracing::instrument(level= "debug")]
pub async fn transcribe_audio(audio: Vec<i16>) -> Result<String> {
    
    let samples = whisper_rs::convert_integer_to_float_audio(&audio);
    // Whisper Model 
    let whisper_path = Path::new("./models/ggml-medium.bin");
    
    //
    // The decoding strategies are: 
    //  - Beam Search with 5 beams usng log probability for the score function 
    //  - Greedy decoding with best of 5 sampling. 
    // 
    let mut params = FullParams::new(SamplingStrategy::Greedy { best_of: 5 });
    params.set_offset_ms(0);
    params.set_translate(false);
    params.set_no_context(true);
    params.set_single_segment(true);
    params.set_print_realtime(false);
    params.set_print_progress(false);
    params.set_print_timestamps(true);    
    params.set_print_special(false);
    // params.set_speed_up(true);
    params.set_max_tokens(32);
    // Partial encoder context for better performance 
    params.set_audio_ctx(768);
    // Disable temperature fallback
    params.set_temperature(-1.0);
    // Whisper context 
    let mut ctx = WhisperContext::new(&whisper_path.to_string_lossy()).expect("failed to open model");
    // Run the model 
    ctx.full(params, &samples).expect("failed to convert samples");
    
    let num_segments = ctx.full_n_segments();

    let mut res = "".to_string();

    for i in 0..num_segments {
        let segment = ctx.full_get_segment_text(i).expect("failed to get segment");
        let start_timestamp = ctx.full_get_segment_t0(i);
        let end_timestamp = ctx.full_get_segment_t1(i);
        println!("[{} - {}]: {}", start_timestamp, end_timestamp, segment);

        res.push_str(&segment);
    }

    Ok(res)
}