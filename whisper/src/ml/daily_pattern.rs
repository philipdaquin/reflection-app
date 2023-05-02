use bson::oid::ObjectId;
use serde::Serialize;


#[derive(Debug, Serialize)]
pub struct Daily { 
    id: ObjectId,

    total_entries: i32,

    overall_mood: Option<String>,

    // Daily Average 
    current_avg: Option<f32>,

    
}