use hyper_tls::HttpsConnector;
use serde_derive::{Deserialize, Serialize};

use actix_web::{
    get, middleware::Logger, route, 
    App, HttpServer, Responder, HttpResponse, 
    HttpRequest, guard, Result, web
};
use hyper::{header, Body, Client, Request, body::{aggregate, Buf}};
use dotenv::dotenv;

#[derive(Debug, Deserialize)]
struct ChatAIChoices { 
    text: String, 
    index: u8, 
    logprobs: Option<u8>,
    finish_reason: String
}

#[derive(Debug, Deserialize)]
struct ChatResponse { 
    id: Option<String>, 
    object: Option<String>,
    created: Option<u64>,
    model: Option<String>,
    choices: Vec<ChatAIChoices>
}
#[derive(Serialize, Debug)]
struct OAIRequest { 
    prompt: String, 
    max_tokens: u32
}

/// 
/// Receives text input from the user and sends out request to OpenAI GPT
/// 
/// 
pub async fn get_chat_response(input: &str) -> Result<()> {
    
    dotenv().ok();

    log::info!("{}", input);

    // let preamble = "You are a very curious bot, and you want to know more about the users problem. 
    //     Dont give any advice yet, ask for more clarifiications.
    //     If it's a sad prompt, you need to match your response with the same tone and choice of words";

    let https = HttpsConnector::new();
    let client = Client::builder().build(https);
    
    // Construct the API endpoint URL
    let endpoint_url = "https://api.openai.com/v1/engines/text-davinci-001/completions";

    // Construct the request body 
    let token = std::env::var("OPENAI_API_KEY").expect("Missing Open AI Token");
    let header = format!("Bearer {}", token);
    // let prompt = format!("{} `{}`", preamble, input);
    let prompt = format!("Answer the prompt in a short and concise manner: {}", input);


    let oi_request = OAIRequest {
        prompt,
        max_tokens: 100,
    };
    let body = Body::from(serde_json::to_vec(&oi_request)?);

    // Send the request to the OpenAI Chat API
    let request = Request::post(endpoint_url)
        .header(header::CONTENT_TYPE, "application/json")
        .header("Authorization", &header)
        .body(body)
        .unwrap();

    let resp = client.request(request).await.unwrap();
    let body = aggregate(resp).await.unwrap();
    
    // Extract the response body as a string
    let resp: ChatResponse = serde_json::from_reader(body.reader()).unwrap();

    log::info!("{}", resp.choices[0].text);
    Ok(())
}

