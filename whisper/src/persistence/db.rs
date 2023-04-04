use mongodb::{Client, Collection, options::{ClientOptions, Credential}};
use once_cell::sync::OnceCell;
use crate::error::Result;
use lazy_static::lazy_static;

lazy_static! { 
    pub static ref MONGO_URI: String = std::env::var("MONGODB_URI").unwrap_or_else(|_| "mongodb://localhost:27017".into());
    pub static ref MONGODB_USERNAME: String = std::env::var("MONGODB_USERNAME").unwrap_or_else(|_| "mongodb://localhost:27017".into());
    pub static ref MONGODB_PASSWORD: String = std::env::var("MONGODB_PASSWORD").unwrap_or_else(|_| "mongodb://localhost:27017".into());
}


#[derive(Debug, Clone)]
pub struct MongoDbClient(pub Client);

pub static MONGOCONN: OnceCell<MongoDbClient> = OnceCell::new();

/// Singleton implementation of MongoClient Connection 
#[inline]
pub(crate) fn get_mongo_client() -> &'static MongoDbClient { 
    MONGOCONN.get().expect("Missing Mongo Client")
}

impl From<Client> for MongoDbClient { 
    fn from(value: Client) -> Self {
        Self(value)
    }
}

impl MongoDbClient {  
    pub async fn establish_connection() -> Result<&'static Self> { 
        let mut client_options = ClientOptions::parse(MONGO_URI.as_str())
            .await
            .expect("Failed to created MongoDB client");

        let credential = Credential::builder()
            .username(MONGODB_USERNAME.to_string())
            .password(MONGODB_PASSWORD.to_string())
            .build();   
        client_options.credential = Some(credential);


        let client = Client::with_options(client_options).expect("Unable to establish connection");
        
        // let client = Client::with_uri_str(MONGO_URI.to_string())
        //     .await
        //     .expect("Failed to create MongoDB client");
        
        //  Store Current Session as a global variable
        let mongo = MongoDbClient::from(client);
        let _ = MONGOCONN.set(mongo);

        Ok(MONGOCONN.get().unwrap())
    }
    /// Returns the Instantiation of Collection 
    pub fn get_collection<T>(column_name: &str, db_name: &str) -> Collection<T> { 
        get_mongo_client().0.database(db_name).collection(column_name)
    }  
}


