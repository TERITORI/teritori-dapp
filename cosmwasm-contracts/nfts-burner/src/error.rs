use cosmwasm_std::{DivideByZeroError, OverflowError, StdError};
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("{0}")]
    Overflow(#[from] OverflowError),

    #[error("{0}")]
    DivideByZero(#[from] DivideByZeroError),

    #[error("{0}")]
    DecodeError(#[from] base64::DecodeError),

    #[error("{0}")]
    ParseIntError(#[from] std::num::ParseIntError),

    #[error("{0}")]
    OwnershipError(#[from] cw_ownable::OwnershipError),

    #[error("Unauthorized collection.")]
    UnauthorizedCollection,

    #[error("Not admin.")]
    NotAdmin,

    #[error("Already burned.")]
    AlreadyBurned,

    #[error("Unknown reply type '{0}'.")]
    UnknownReplyType(u64),

    #[error("Event value not found for path '{0}.{1}'.")]
    EventValueNotFound(String, String),

    #[error("Entry not found.")]
    EntryNotFound,
}
