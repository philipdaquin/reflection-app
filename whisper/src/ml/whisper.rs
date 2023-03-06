use bytes::{Bytes, BytesMut};
use hound::{SampleFormat, WavReader};
use tempfile::NamedTempFile;
use std::path::Path;
use whisper_rs::{FullParams, SamplingStrategy, WhisperContext};
use crate::error::Result;
use std::io::Cursor;

/// Parse the audio data as a WAV file 
#[tracing::instrument(level= "debug")]
pub async fn parse_wav_file(mut file: &NamedTempFile) -> Vec<i16> {
    
    
    let temp_file_path = file.path();
    let content = std::fs::read(temp_file_path).unwrap();
    
    
    let reader = 
        WavReader::new(&content[..]).unwrap();

    if reader.spec().channels != 1 {
        panic!("expected mono audio file");
    }
    if reader.spec().sample_format != SampleFormat::Int {
        panic!("expected integer sample format");
    }
    // if reader.spec().sample_rate != 16000 {
    //     panic!("expected 16KHz sample rate");
    // }
    if reader.spec().bits_per_sample != 16 {
        panic!("expected 16 bits per sample");
    }

    reader
        .into_samples::<i16>()
        .map(|x| x.expect("sample"))
        .collect::<Vec<_>>()
}

#[tracing::instrument(level= "debug")]
pub async fn transcribe_audio(audio: Vec<i16>) -> Result<String> {
    
    let samples = whisper_rs::convert_integer_to_float_audio(&audio);

    // Whisper Model 
    let whisper_path = Path::new("./models/ggml-medium.bin");

    let mut ctx = WhisperContext::new(&whisper_path.to_string_lossy())
        .expect("failed to open model");
    let params = FullParams::new(SamplingStrategy::default());

    ctx.full(params, &samples)
        .expect("failed to convert samples");

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