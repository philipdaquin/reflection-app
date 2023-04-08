pub mod whisper;
pub mod chat;
pub mod tts;
pub mod prompt;
pub mod sockets;
pub mod text_classification;
use lazy_static::lazy_static;
pub mod recommendation;

lazy_static! { 
    
    pub static ref ENGINE: String = std::env::var("CHAT_MODEL_ENGINE").expect("Unable to read Engine ID");
    pub static ref OPENAI_API_KEY: String = std::env::var("OPENAI_API_KEY").expect("Unable to read OPEN API KEY");
    pub static ref VOICEID: String = std::env::var("VOICE_ID").expect("Unable to read VOICE ID");
    pub static ref ELEVEN_LABS_API_KEY: String = std::env::var("ELEVEN_LABS_API_KEY").expect("Unable to read ELEVEN_LABS_API_KEY");
    pub static ref SPEECH_ENGINE_MODEL: String = std::env::var("VOICE_ENGINE").expect("Unable to read the VOICE ENGINE FOR ELEVEN LABS");

}
