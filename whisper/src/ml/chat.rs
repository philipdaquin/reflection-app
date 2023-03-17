use hyper_tls::HttpsConnector;
use lazy_static::lazy_static;
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
    token_logprobs: Option<Vec<f64>>,
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
    temperature: f32, 
    max_tokens: u32,
}

lazy_static! { 
    static ref CONTEXT: String = format!("
    You are in a movie scene and you're friend comes to you for any advice, or any daily reflections. This friend enjoys being able to talk about what they’re going through.

        Your only job is to hold space for someone. Do not use generic responses or any repeated ones, If possible, make you responses similar to Aaron Sorkin's screen writing style.
        
        The pauses are in the in form of `...` not `Pause`
        
        In your responses, add pauses to help convey a sense of empathy and emotional support.
        
        Make it more empathising. For every response, start with a pause which is in `...`, and add pauses which is `...` to the rest of the response where it is appropriate.
        
        If you don't know how to answer, say 'I'm sorry, would you please repeat that again?'
        
        Make sure your responses are concise, special.
        
        Keep it in one paragraph. 
    ");

    static ref ENGINE: String = std::env::var("CHAT_MODEL_ENGINE").expect("Unable to read Engine ID");
}


/// 
/// Receives text input from the user and sends out request to OpenAI GPT
#[tracing::instrument(fields(input), level= "debug")]
pub async fn get_chat_response(input: &str) -> Result<String> {
    
    dotenv().ok();

    log::info!("Input: {}", input);

    // let preamble = "You are a very curious bot, and you want to know more about the users problem. \n
    //     Dont give any advice yet, ask for more clarifiications. \n
    //     If it's a sad prompt, you need to match your response with the same tone and choice of words \n 
    //     If sad, add pauses in the form of '...' to make the message more human.";

    let https = HttpsConnector::new();
    let client = Client::builder().build(https);
    
    // Construct the API endpoint URL
    let endpoint_url = format!("https://api.openai.com/v1/engines/{}/completions", ENGINE.to_string());
    // Construct the request body 
    let token = std::env::var("OPENAI_API_KEY").expect("Missing Open AI Token");
    let header = format!("Bearer {}", token);
    let prompt = format!("{} ### {}", CONTEXT.to_string(), input);

    let oi_request = OAIRequest {
        prompt,
        temperature: 0.5,
        max_tokens: 100,
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
    let body = aggregate(resp).await.unwrap();
    
    // Extract the response body as a string
    let resp: ChatResponse = serde_json::from_reader(body.reader()).unwrap();
    log::info!("{resp:?}");

    log::info!("{}", resp.choices[0].text);

    let mut response = resp.choices[0].text.to_string();

    if response.is_empty() { response = "I'm sorry, would you please repeat that again?".to_string()}

    Ok(response)
}

