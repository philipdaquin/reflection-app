
use thiserror::Error;
pub type Result<T> = std::result::Result<T, ServerError>;
use std::io;

use actix_web::Error as ActixError;


#[derive(Error, Debug)]
pub enum ServerError { 
    #[error("Input / Output operation fails: {0:#?}")]
    IoError(#[source] io::Error), 
    
    
    #[error("Actix Error Server occurred!")]
    HttpError(#[source] ActixError)

    
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