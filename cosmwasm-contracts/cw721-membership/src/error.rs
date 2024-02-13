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

    #[error("Channel already exists.")]
    ChannelExists,

    #[error("Channel does not exist.")]
    ChannelNotFound,

    #[error("Membership kind does not exists.")]
    MembershipKindNotFound,

    #[error("Unauthorized.")]
    Unauthorized,

    #[error("Invalid token ID.")]
    InvalidTokenId,

    #[error("Nft not found.")]
    NftNotFound,

    #[error("Cannot transfer to self.")]
    CannotTransferToSelf,

    #[error("Invalid funds.")]
    InvalidFunds,
}
