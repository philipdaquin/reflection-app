
use serde::Serialize;
use thiserror::Error;
pub type Result<T> = std::result::Result<T, ServerError>;
use std::io;
use mongodb::error::Error as MongoError;
use actix_web::{Error as ActixError, ResponseError, HttpResponse};


#[derive(Error, Debug)]
pub enum ServerError { 
    #[error("Input / Output operation fails: {0:#?}")]
    IoError(#[source] io::Error), 
    
    
    #[error("Actix Error Server occurred!")]
    HttpError(#[source] ActixError),

    #[error("Mongo Error Server occurred!")]
    MongoDbError(#[source] MongoError),

    #[error("Unable to find by item by id: {0}")]
    NotFound(String),

    #[error("Missing Audio Transcript. Reupload the audio script.")]
    MissingTranscript,

    #[error("User is not authorized")]
    Unauthorized,

    #[error("Incorrect credentials provided")]
    IncorrectCredentials,

    #[error("Not authorized to request the specified resource")]
    Forbidden,

    #[error("Unexpected error occurred")]
    UnexpectedError,

    #[error("Internal Server Error. Message: {0}")]
    ServerError(String),

    #[error("A server error occurred: {0}")]
    DatabaseError(String),
    
    #[error("Missing Open AI API Key")]
    MissingOpenAIAPIKey,

    #[error("Missing Eleven Labs API Key")]
    MissingElevenLabsKey,
    
}


impl From<io::Error> for ServerError { 
    fn from(value: io::Error) -> Self {
        ServerError::IoError(value)
    }
}


impl From<ActixError> for ServerError { 
    fn from(value: ActixError) -> Self {
        ServerError::HttpError(value)
    }
}

impl From<MongoError> for ServerError { 
    fn from(value: MongoError) -> Self {
        ServerError::MongoDbError(value)
    }
}
#[derive(Debug, Serialize)]
struct Messages(Vec<String>);

impl ResponseError for ServerError {
    fn error_response(&self) -> HttpResponse {
        match self {
            Self::NotFound(_) => HttpResponse::NotFound().finish(),
            Self::Unauthorized | Self::IncorrectCredentials => {
                HttpResponse::Unauthorized().finish()
            }
            Self::Forbidden => HttpResponse::Forbidden().finish(),
           
            Self::ServerError(error) => {
                HttpResponse::InternalServerError().finish()
            }
            Self::UnexpectedError => HttpResponse::InternalServerError().finish(),
            // Catch all, as most of the time we should be using GraphQL errors
            _ => HttpResponse::InternalServerError().finish(),
        }
    }
}