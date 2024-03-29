use std::time::Duration;

use hyper_tls::HttpsConnector;
use lazy_static::lazy_static;
use serde_derive::{Deserialize, Serialize};

use actix_web::{Result};
use hyper::{header, Body, Client, Request, body::{aggregate, Buf}};
use dotenv::dotenv;

use crate::{ml::{ENGINE}, controllers::openapi_key::OpenAIClient};

#[derive(Debug, Deserialize, Default)]
struct ChatAIChoices { 
    text: String, 
    index: u8, 
    logprobs: Option<u8>,
    token_logprobs: Option<Vec<f64>>,
    finish_reason: String
}

#[derive(Debug, Deserialize, Default)]
struct ChatResponse { 
    id: Option<String>, 
    object: Option<String>,
    created: Option<u64>,
    model: Option<String>,
    choices: Vec<ChatAIChoices>
}


#[derive(Serialize, Debug)]
struct OAIRequest<'a> { 
    prompt: &'a str,
    temperature: f32, 
    max_tokens: u32,
    stop: String 
}


/// 
/// Receives text input from the user and sends out request to OpenAI GPT
#[tracing::instrument(fields(input), level= "debug")]
pub async fn get_chat_response(input: &str, context: &str) -> Result<String> {
    
    dotenv().ok();

    log::info!("Input: {}", input);

    // let preamble = "You are a very curious bot, and you want to know more about the users problem. \n
    //     Dont give any advice yet, ask for more clarifiications. \n
    //     If it's a sad prompt, you need to match your response with the same tone and choice of words \n 
    //     If sad, add pauses in the form of '...' to make the message more human.";

    let https = HttpsConnector::new();
    let client = Client::builder()
        .http2_keep_alive_timeout(Duration::from_secs(60))
        .build(https);
    
    // Construct the API endpoint URL
    let endpoint_url = format!("https://api.openai.com/v1/engines/{}/completions", ENGINE.to_string());
    // Construct the request body 
    // let token = std::env::var("OPENAI_API_KEY").expect("Missing Open AI Token");
    let token = OpenAIClient::get_key();
    let header = format!("Bearer {}", token);
    let prompt = &format!("{} ### {}", context, input);
    // let prompt = input;


    let oi_request = OAIRequest {
        prompt,
        temperature: 0.5,
        max_tokens: 256,
        stop: format!("stop")
    };

    let body = Body::from(serde_json::to_vec(&oi_request)?);

    // Send the request to the OpenAI Chat API
    let request = Request::post(endpoint_url)
        .header(header::CONTENT_TYPE, "application/json")
        .header("Authorization", &header)
        .body(body)
        .unwrap();

    let resp = client
        .request(request)
        .await
        .unwrap();
    let body = aggregate(resp)
        .await
        .map_err(|e| log::error!("{e:?}"))
        .unwrap();

    // Extract the response body as a string
    let resp: ChatResponse = serde_json::from_reader(body.reader())
        .map_err(|e| {
            log::error!("Failed to deserialize chat response: {:#?}", e);
        })
        .unwrap_or_default();
    
    log::info!("CHATGPT RESPONSE: {resp:#?}");
    
    let mut response = resp.choices[0].text.to_string();
    
    if response.is_empty() { 
        response = "I'm sorry, would you please repeat that again?".to_string()
    }

    Ok(response)
}

