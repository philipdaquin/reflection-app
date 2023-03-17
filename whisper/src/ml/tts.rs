
use lazy_static::lazy_static;
use serde_derive::{Serialize, Deserialize};
use dotenv::dotenv;
use hyper::{header, Body, Client, Request, body::{aggregate, Buf}, client::HttpConnector, StatusCode};
use hyper_tls::HttpsConnector;
use actix_multipart::Multipart;
use actix_web::Result;
use hyper::Response;

lazy_static! { 
    static ref OPENAI_API_KEY: String = std::env::var("OPENAI_API_KEY")
        .expect("Unable to read OPEN API KEY");

    static ref VOICEID: String = std::env::var("VOICE_ID")
        .expect("Unable to read VOICE ID");

    static ref ELEVEN_LABS_API_KEY: String = std::env::var("ELEVEN_LABS_API_KEY")
        .expect("Unable to read ELEVEN_LABS_API_KEY");
}


#[derive(Debug, Serialize, Deserialize)]
struct VoiceSettings { 
    stability: f32, 
    similarity_boost: f32
}

impl Default for VoiceSettings { 
    fn default() -> Self {
        Self { 
            stability: 0.75,
            similarity_boost: 0.75
        }
    }
}


#[derive(Debug, Serialize, Deserialize)]
struct OAIRequest { 
    text: String, 
    voice_settings: VoiceSettings
}

#[derive(Debug, Deserialize)]
struct ValidationError { 
    detail: Option<Vec<OIErrorMessage>>
}
#[derive(Debug, Deserialize)]
struct OIErrorMessage { 
    loc: Option<Vec<String>>,
    msg: Option<String>,
    type_: Option<String>
}

/// Send OpenAI response to Speech
#[tracing::instrument(fields(input), level= "debug")]
pub async fn process_text_to_audio(input: &str) -> Result<Vec<u8>> {
    dotenv().ok();

    log::info!("Sending request to ElevenLabs...");

    let connector = HttpsConnector::new();
    let client = Client::builder().build(connector);
    let header = format!("{}", ELEVEN_LABS_API_KEY.to_string());
    
    // Default Voice is Elli
    let tts_request = OAIRequest { 
        text: input.to_string(), 
        voice_settings: VoiceSettings::default()
    };
    let endpoint_url = format!("https://api.elevenlabs.io/v1/text-to-speech/{}", VOICEID.to_string());
    let body = Body::from(serde_json::to_vec(&tts_request)?);
    log::info!("{:?}", body);
    
    // Send the request to the endpoint API
    let request = Request::post(endpoint_url)
        .header(header::CONTENT_TYPE, "application/json")
        .header("xi-api-key", header)
        .header(header::ACCEPT, "audio/mpeg")
        .body(body)
        .unwrap();

    // Extract the response 
    let resp = client
        .request(request)
        .await
        .unwrap();
        // .into_body();

    // Extract the body from the Response and convert it to bytes
    let body = hyper::body::to_bytes(resp)
        .await
        .unwrap()
        .to_vec();

    // log::info!("{:#?}", resp.status());

    Ok(body)

}
