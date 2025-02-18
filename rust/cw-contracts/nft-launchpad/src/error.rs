use cosmwasm_std::StdError;
use cw_utils::ParseReplyError;
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Merkle root missing.")]
    MerkleRootMissing,

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

    #[error("Wrong collection owner.")]
    WrongCollectionOwner,

    #[error("Wrong deployer.")]
    WrongDeployer,

    #[error("Already deployed.")]
    AlreadyDeployed,

    #[error("No result in reply.")]
    NoResultInReply,

    #[error("Unable to parse reply.")]
    ParseReplyError(#[from] ParseReplyError),

    #[error("Unknown reply id {reply_id}.")]
    UnknownReply { reply_id: u64 },

    #[error("Event value not found for path '{0}.{1}'.")]
    EventValueNotFound(String, String),
}
