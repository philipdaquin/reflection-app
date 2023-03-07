
use serde_derive::{Serialize, Deserialize};
use dotenv::dotenv;
use hyper::{header, Body, Client, Request, body::{aggregate, Buf}, client::HttpConnector, StatusCode};
use hyper_tls::HttpsConnector;
use actix_multipart::Multipart;
use actix_web::Result;
use hyper::Response;

#[derive(Debug, Serialize, Default)]
struct VoiceSettings { 
    stability: u32, 
    similarity_boost: u32
}

#[derive(Debug, Serialize)]
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

    let connector = HttpConnector::new();
    let client = Client::builder().build(connector);


    let api_key = std::env::var("ELEVEN_LABS_API_KEY").expect("Unable to read ELEVAN LABS API KEY");
    let header = format!("Bearer {}", api_key);
    
    // Default Voice is Elli
    let voice_id = "MF3mGyEYCl7XYWbV9V6O";
    let tts_request = OAIRequest { 
        text: input.to_string(), 
        voice_settings: VoiceSettings::default()
    };
    let endpoint_url = format!("https://api.elevenlabs.io/v1/text-to-speech/{}", voice_id);
    let body = Body::from(serde_json::to_vec(&tts_request)?);
    
    
    // Send the request to the endpoint API
    let request = Request::post(endpoint_url)
        // .header(header::CONTENT_TYPE, "application/json")
        .header(header::ACCEPT, "audio/mpeg")
        .header("Authorization", &header)
        .body(body)
        .unwrap();

    // Extract the response 
    let resp = client
        .request(request)
        .await
        .unwrap();

    // Build the response 
    let body = hyper::body::to_bytes(resp)
        .await
        .unwrap()
        .to_vec();


    Ok(body)

}
