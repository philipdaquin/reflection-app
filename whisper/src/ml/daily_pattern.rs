use bson::oid::ObjectId;
use serde::Serialize;


#[derive(Debug, Serialize)]
struct Daily { 
    id: ObjectId,

    total_entries: i32,
    
}