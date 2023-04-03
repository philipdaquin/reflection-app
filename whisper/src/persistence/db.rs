use mongodb::{Client, Collection};
use once_cell::sync::OnceCell;
use crate::error::Result;
use lazy_static::lazy_static;

lazy_static! { 
    pub static ref MONGO_URI: String = std::env::var("MONGODB_URI").unwrap_or_else(|_| "mongodb://localhost:27017".into());
}


#[derive(Debug, Clone)]
pub struct MongoDbClient(pub Client);

pub static MONGOCONN: OnceCell<MongoDbClient> = OnceCell::new();

#[inline]
/// Singleton implementation of MongoClient Connection 
pub(crate) fn get_mongo_client() -> &'static MongoDbClient { 
    MONGOCONN.get().expect("Missing Mongo Client")
}

impl MongoDbClient {  
    pub async fn establish_connection() -> Self { 
        let client = Client::with_uri_str(MONGO_URI.as_str())
            .await
            .expect("Failed to created MongoDB client");
        Self(client)
    }
    /// Returns the Instantiation of Collection 
    pub fn get_collection<T>(column_name: &str, db_name: &str) -> Collection<T> { 
        get_mongo_client().0.database(db_name).collection(column_name)
    }  
}


