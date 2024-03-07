use cosmwasm_std::{Instantiate2AddressError, StdError};
use thiserror::Error;
use cw_utils::ParseReplyError;

#[derive(Error, Debug, PartialEq)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("NFT code id missing.")]
    NftCodeIdMissing,

    #[error("Collection not found.")]
    CollectionNotFound,

    #[error("Collection not found.")]
    Forbidden,

    #[error("Unable to parse reply.")]
    ParseReplyError(#[from] ParseReplyError),

    #[error("Unknown reply id {reply_id}.")]
    UnknownReply { reply_id: u64 },

    #[error("{0}")]
    Instantiate2AddressError(#[from] Instantiate2AddressError),
}