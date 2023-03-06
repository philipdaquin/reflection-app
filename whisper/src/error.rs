
use thiserror::Error;
pub type Result<T> = std::result::Result<T, ServerError>;
use std::io;

#[derive(Error, Debug)]
pub enum ServerError { 
    #[error("Input / Output operation fails: {0:#?}")]
    IoError(#[source] io::Error), 
    
}


impl From<io::Error> for ServerError { 
    fn from(value: io::Error) -> Self {
        ServerError::IoError(value)
    }
}
