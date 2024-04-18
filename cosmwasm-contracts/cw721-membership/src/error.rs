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

    #[error("Channel already exists.")]
    ChannelExists,

    #[error("This address does not own a channel.")]
    UnknownChannelAddress,

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

    #[error("Serialization error.")]
    SerializationError,

    #[error("Internal error.")]
    InternalError,

    #[error("No changes.")]
    NoChanges,

    #[error("Expiry overflow.")]
    ExpiryOverflow,

    #[error("Invalid tiers.")]
    InvalidTiers,
}
