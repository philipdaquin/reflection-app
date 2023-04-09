use bson::oid::ObjectId;
use serde::Deserialize;

pub mod audio_data;
pub mod audio_analysis;
pub mod ws;


#[derive(Deserialize, Debug, Clone)]
pub struct Input { 
    // Should now be the id 
    #[serde(rename = "_id")]
    pub id: Option<String>
}

