use cosmwasm_std::{Instantiate2AddressError, StdError};
use cw_utils::ParseReplyError;
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("NFT Code id missing.")]
    NftCodeIdMissing,

    #[error("Merkle root missing.")]
    MerkleRootMissing,

    #[error("Deployer missing.")]
    DeployerMissing,

    #[error("Unauthorized.")]
    Unauthorized,

    #[error("Must provide atleast 1 mint period.")]
    MintPeriodRequired,

    #[error("Collection symbol exists.")]
    CollectionSymbolExists,

    #[error("Collection symbol invalid. Only accept upper alphanumeric chars")]
    CollectionSymbolInvalid,

    #[error("Collection not found.")]
    CollectionNotFound,

    #[error("Collection not deployed.")]
    CollectionNotDeployed,

    #[error("Wrong collection owner.")]
    WrongCollectionOwner,

    #[error("Wrong deployer.")]
    WrongDeployer,

    #[error("Already deployed.")]
    AlreadyDeployed,

    #[error("Unable to parse reply.")]
    ParseReplyError(#[from] ParseReplyError),

    #[error("Unknown reply id {reply_id}.")]
    UnknownReply { reply_id: u64 },

    #[error("{0}")]
    Instantiate2AddressError(#[from] Instantiate2AddressError),
}