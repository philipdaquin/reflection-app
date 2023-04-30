use bson::oid::ObjectId;
use serde::Serialize;


#[derive(Debug, Serialize)]
struct Daily { 
    id: ObjectId,

    total_entries: i32,

    overall_mood: Option<String>,

    current_avg: Option<f32>,

    change_avg: Option<f32>,

    
    
}