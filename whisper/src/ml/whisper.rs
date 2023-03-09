use hound::{SampleFormat, WavReader};
use std::path::Path;
use whisper_rs::{FullParams, SamplingStrategy, WhisperContext};
use crate::error::Result;
use std::io::Cursor;
use num_cpus;

/// Parse the audio data as a WAV file 
#[tracing::instrument(level= "debug")]
pub async fn parse_wav_file(bytes: Vec<u8>) -> Result<Vec<i16>> {
 
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

#[tracing::instrument(level= "debug")]
pub async fn transcribe_audio(audio: Vec<i16>) -> Result<String> {
    
    let mut samples = whisper_rs::convert_integer_to_float_audio(&audio);
    
    samples = whisper_rs::convert_stereo_to_mono_audio(&samples);
    
    // Whisper Model 
    let whisper_path = Path::new("./models/ggml-base.en.bin");
    
    //
    // The decoding strategies are: 
    //  - Beam Search with 5 beams usng log probability for the score function 
    //  - Greedy decoding with best of 5 sampling. 
    let mut params = FullParams::new(SamplingStrategy::Greedy { best_of: 0 });
    
    // Output into one single segment
    params.set_single_segment(true);


    params.set_print_realtime(false);
    params.set_print_progress(false);
    params.set_print_timestamps(false);    
    params.set_print_special(false);
    
    // Keep context between audio chunks 
    params.set_no_context(true);
    
    params.set_offset_ms(0);
    
    // Speed up audio by x2 (expect reduced accuracy)
    params.set_speed_up(true);

    // Audio length in milliseconds 
    params.set_duration_ms(10000);

    // The max number of tokens per audio chunk     
    params.set_max_tokens(32);

    // Partial encoder context for better performance 
    params.set_audio_ctx(768);

    // Non Speech
    // If the probability of the no speech token is higher than this value AND
    // the decoding has failed due to 'pr'
    params.set_no_speech_thold(0.6);

    // Temperature to increase when falling back when the decoding fails to 
    // meet either of the thresholds elow  
    params.set_temperature_inc(0.2);

    // If the averate log probability is lower than this value, treat the decoding as failed 
    params.set_logprob_thold(-1.0);

    // Temperature to use for sampling 
    // - Sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random
    //   while lower values like 0.2 will make it more focused and deterministic
    //   If set to 0, the model will use log probability to automatically increase the temperature until certain 
    //   thresholds are hit
    params.set_temperature(-1.0);   

    // Number of threads to use during computation
    params.set_n_threads(i32::min(4, num_cpus::get() as i32));

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