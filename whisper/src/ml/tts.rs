
use serde_derive::{Serialize, Deserialize};
use dotenv::dotenv;
use hyper::{header, Body, Client, Request, body::{aggregate, Buf}, client::HttpConnector, StatusCode};
use hyper_tls::HttpsConnector;
use actix_multipart::Multipart;
use actix_web::Result;
use hyper::Response;

#[derive(Debug, Serialize, Default, Deserialize)]
struct VoiceSettings { 
    stability: u32, 
    similarity_boost: u32
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


    let api_key = std::env::var("ELEVEN_LABS_API_KEY").expect("Unable to read ELEVAN LABS API KEY");
    let header = format!("{}", api_key);
    
    // Default Voice is Elli
    let voice_id = "";
    let tts_request = OAIRequest { 
        text: input.to_string(), 
        voice_settings: VoiceSettings::default()
    };
    let endpoint_url = "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM";
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
