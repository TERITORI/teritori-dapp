use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Timelock is not in the future")]
    TimelockNotInFuture,

    #[error("Timelock not expired")]
    TimelockNotExpired,

    #[error("Invalid preimage")]
    InvalidPreimage,

    #[error("Already redeemed")]
    AlreadyRedeemed,

    #[error("Already refunded")]
    AlreadyRefunded,

    #[error("Invalid cursor.")]
    InvalidCursor,

    #[error("Unauthorized.")]
    Unauthorized,

    #[error("Already admin.")]
    AlreadyAdmin,
}
