use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error(transparent)]
    Cw721BaseError(#[from] cw721_base::ContractError),

    #[error("Royalty percentage must be between 0 and 100")]
    InvalidRoyaltyPercentage,
}
