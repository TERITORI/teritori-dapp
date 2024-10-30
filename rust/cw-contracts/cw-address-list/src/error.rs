use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Address already registered.")]
    AddressAlreadyRegistered,

    #[error("Address not registered.")]
    AddressNotRegistered,

    #[error("Invalid cursor.")]
    InvalidCursor,

    #[error("Unauthorized.")]
    Unauthorized,

    #[error("Already admin.")]
    AlreadyAdmin,
}
