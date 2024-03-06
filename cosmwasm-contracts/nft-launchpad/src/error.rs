use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("NFT code id missing.")]
    NftCodeIdMissing,

    #[error("Collection not found.")]
    CollectionNotFound,
}