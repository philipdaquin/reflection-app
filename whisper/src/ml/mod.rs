pub mod whisper;
pub mod audio_transcription;
pub mod chat;
pub mod tts;
pub mod prompt;
pub mod sockets;
pub mod text_classification;
use lazy_static::lazy_static;
pub mod recommendation;
pub mod weekly_pattern;
pub mod response_types;
pub mod daily_summary;

lazy_static! { 
    pub static ref OPENAI_API_KEY: String = std::env::var("OPENAI_API_KEY").expect("Unable to read OPEN API KEY");
    pub static ref ELEVEN_LABS_API_KEY: String = std::env::var("ELEVEN_LABS_API_KEY").expect("Unable to read ELEVEN_LABS_API_KEY");
    
    
    
    /// Goes Back to Default Values     
    pub static ref ENGINE: String = std::env::var("CHAT_MODEL_ENGINE")
        .unwrap_or("text-davinci-003".to_string());

    pub static ref VOICEID: String = std::env::var("VOICE_ID")
        .unwrap_or("MF3mGyEYCl7XYWbV9V6O".to_string());
    
    pub static ref SPEECH_ENGINE_MODEL: String = std::env::var("VOICE_ENGINE")
        .unwrap_or("ggml-base.en.bin".to_string());
}