use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error(transparent)]
    Cw721BaseError(#[from] cw721_base::ContractError),

    #[error("Unauthorized")]
    Unauthorized,

    #[error("NFT already requested")]
    NftAlreadyRequested,

    #[error("NFT already claimed")]
    NftAlreadyClaimed,

    #[error("NFT not requested yet")]
    NftNotRequested,

    #[error("Merkle proof is invalid")]
    InvalidMerkleProof,

    #[error("Royalty percentage must be between 0 and 100")]
    InvalidRoyaltyPercentage,

    #[error("Mint has not started yet")]
    MintNotStarted,

    #[error("Exceed max tokens")]
    MintExceedMaxTokens,

    #[error("Exceed max per user")]
    MintExceedMaxPerUser,

    #[error("Exceed max per whitelisted user")]
    WhitelistMintExceedMaxPerUser,

    #[error("Invalid fund")]
    InvalidFund,

    #[error("Invalid denom")]
    InvalidDenom,

    #[error("Invalid amount")]
    InvalidAmount,
}
