use serde::{Deserialize, Serialize};

pub mod openapi_key;
pub mod audio_data;
pub mod audio_analysis;
pub mod ws;
pub mod weekly_controller;
pub mod eleven_labs;
pub mod sse;

#[derive(Deserialize, Debug, Clone)]
pub struct Input { 
    // Should now be the id 
    #[serde(rename = "_id")]
    pub id: Option<String>
}

//  Temporary 
#[derive(Deserialize, Debug, Clone, Default)]
pub struct TagResponse { 
    pub response: Vec<String>
}


//  for Progress bar 
#[derive(Deserialize, Debug, Clone, Default, Serialize)]
pub struct Progress { 
    pub progress: i32
}
