// @generated
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Multisig {
    #[prost(string, tag="1")]
    pub created_at: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub chain_id: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub address: ::prost::alloc::string::String,
    #[prost(bool, tag="5")]
    pub joined: bool,
    #[prost(string, tag="6")]
    pub name: ::prost::alloc::string::String,
    #[prost(string, tag="7")]
    pub pubkey_json: ::prost::alloc::string::String,
    #[prost(string, repeated, tag="8")]
    pub users_addresses: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
    #[prost(uint32, tag="9")]
    pub threshold: u32,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Signature {
    #[prost(string, tag="1")]
    pub value: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub user_address: ::prost::alloc::string::String,
    #[prost(bytes="vec", tag="3")]
    pub body_bytes: ::prost::alloc::vec::Vec<u8>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Transaction {
    #[prost(string, tag="1")]
    pub created_at: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub final_hash: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub multisig_address: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub chain_id: ::prost::alloc::string::String,
    #[prost(message, repeated, tag="5")]
    pub msgs: ::prost::alloc::vec::Vec<::prost_types::Any>,
    #[prost(string, tag="6")]
    pub fee_json: ::prost::alloc::string::String,
    #[prost(uint32, tag="7")]
    pub account_number: u32,
    #[prost(uint32, tag="8")]
    pub sequence: u32,
    #[prost(string, tag="9")]
    pub creator_address: ::prost::alloc::string::String,
    #[prost(uint32, tag="10")]
    pub threshold: u32,
    #[prost(uint32, tag="11")]
    pub members_count: u32,
    #[prost(string, tag="12")]
    pub memo: ::prost::alloc::string::String,
    #[prost(message, repeated, tag="13")]
    pub signatures: ::prost::alloc::vec::Vec<Signature>,
    #[prost(string, tag="14")]
    pub multisig_pubkey_json: ::prost::alloc::string::String,
    #[prost(uint32, tag="15")]
    pub id: u32,
}
/// we use string here because browser storage poorly supports bytes
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Token {
    /// base64
    #[prost(string, tag="1")]
    pub nonce: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub expiration: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub user_address: ::prost::alloc::string::String,
    /// base64 signature by server of protobuf encoding of Token with server_signature field zeroed out
    #[prost(string, tag="5")]
    pub server_signature: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Challenge {
    #[prost(bytes="vec", tag="1")]
    pub nonce: ::prost::alloc::vec::Vec<u8>,
    #[prost(string, tag="2")]
    pub expiration: ::prost::alloc::string::String,
    /// signature by server of protobuf encoding of Challenge with server_signature field zeroed out
    #[prost(bytes="vec", tag="3")]
    pub server_signature: ::prost::alloc::vec::Vec<u8>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MultisigsRequest {
    #[prost(message, optional, tag="1")]
    pub auth_token: ::core::option::Option<Token>,
    #[prost(uint32, tag="2")]
    pub limit: u32,
    #[prost(string, tag="3")]
    pub start_after: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub chain_id: ::prost::alloc::string::String,
    #[prost(enumeration="JoinState", tag="5")]
    pub join_state: i32,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MultisigsResponse {
    #[prost(message, repeated, tag="1")]
    pub multisigs: ::prost::alloc::vec::Vec<Multisig>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MultisigInfoRequest {
    #[prost(message, optional, tag="1")]
    pub auth_token: ::core::option::Option<Token>,
    #[prost(string, tag="2")]
    pub multisig_address: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub chain_id: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MultisigInfoResponse {
    #[prost(message, optional, tag="1")]
    pub multisig: ::core::option::Option<Multisig>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct TransactionsRequest {
    #[prost(message, optional, tag="1")]
    pub auth_token: ::core::option::Option<Token>,
    #[prost(uint32, tag="2")]
    pub limit: u32,
    #[prost(string, tag="3")]
    pub start_after: ::prost::alloc::string::String,
    /// if unspecified, return transactions for all multisigs of this user
    #[prost(string, tag="4")]
    pub multisig_address: ::prost::alloc::string::String,
    #[prost(string, tag="5")]
    pub chain_id: ::prost::alloc::string::String,
    #[prost(string, repeated, tag="6")]
    pub types: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
    #[prost(enumeration="ExecutionState", tag="7")]
    pub execution_state: i32,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct TransactionsResponse {
    #[prost(message, repeated, tag="1")]
    pub transactions: ::prost::alloc::vec::Vec<Transaction>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct CreateOrJoinMultisigRequest {
    #[prost(string, tag="1")]
    pub chain_id: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub multisig_pubkey_json: ::prost::alloc::string::String,
    #[prost(message, optional, tag="3")]
    pub auth_token: ::core::option::Option<Token>,
    #[prost(string, tag="4")]
    pub name: ::prost::alloc::string::String,
    #[prost(string, tag="5")]
    pub bech32_prefix: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct CreateOrJoinMultisigResponse {
    #[prost(bool, tag="1")]
    pub created: bool,
    #[prost(bool, tag="2")]
    pub joined: bool,
    #[prost(string, tag="3")]
    pub multisig_address: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct LeaveMultisigRequest {
    #[prost(string, tag="1")]
    pub multisig_address: ::prost::alloc::string::String,
    #[prost(message, optional, tag="2")]
    pub auth_token: ::core::option::Option<Token>,
    #[prost(string, tag="3")]
    pub chain_id: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct LeaveMultisigResponse {
    #[prost(bool, tag="1")]
    pub left: bool,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct CreateTransactionRequest {
    #[prost(message, optional, tag="1")]
    pub auth_token: ::core::option::Option<Token>,
    #[prost(string, tag="3")]
    pub multisig_address: ::prost::alloc::string::String,
    #[prost(uint32, tag="4")]
    pub account_number: u32,
    #[prost(uint32, tag="5")]
    pub sequence: u32,
    #[prost(message, repeated, tag="6")]
    pub msgs: ::prost::alloc::vec::Vec<::prost_types::Any>,
    #[prost(string, tag="7")]
    pub fee_json: ::prost::alloc::string::String,
    #[prost(string, tag="8")]
    pub chain_id: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct CreateTransactionResponse {
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct SignTransactionRequest {
    #[prost(message, optional, tag="1")]
    pub auth_token: ::core::option::Option<Token>,
    #[prost(string, tag="2")]
    pub signature: ::prost::alloc::string::String,
    #[prost(uint32, tag="3")]
    pub transaction_id: u32,
    #[prost(bytes="vec", tag="4")]
    pub body_bytes: ::prost::alloc::vec::Vec<u8>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct SignTransactionResponse {
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct CompleteTransactionRequest {
    #[prost(message, optional, tag="1")]
    pub auth_token: ::core::option::Option<Token>,
    #[prost(uint32, tag="2")]
    pub transaction_id: u32,
    #[prost(string, tag="3")]
    pub final_hash: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct CompleteTransactionResponse {
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct ClearSignaturesRequest {
    #[prost(message, optional, tag="1")]
    pub auth_token: ::core::option::Option<Token>,
    #[prost(string, tag="2")]
    pub multisig_chain_id: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub multisig_address: ::prost::alloc::string::String,
    #[prost(uint32, tag="4")]
    pub sequence: u32,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct ClearSignaturesResponse {
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct GetChallengeRequest {
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct GetChallengeResponse {
    #[prost(message, optional, tag="1")]
    pub challenge: ::core::option::Option<Challenge>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct TokenRequestInfo {
    #[prost(string, tag="1")]
    pub kind: ::prost::alloc::string::String,
    #[prost(message, optional, tag="2")]
    pub challenge: ::core::option::Option<Challenge>,
    #[prost(string, tag="3")]
    pub user_bech32_prefix: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub user_pubkey_json: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct GetTokenRequest {
    /// protojson encoding of TokenRequestInfo
    #[prost(string, tag="1")]
    pub info_json: ::prost::alloc::string::String,
    /// signature by client of info_json
    #[prost(string, tag="2")]
    pub user_signature: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct GetTokenResponse {
    #[prost(message, optional, tag="1")]
    pub auth_token: ::core::option::Option<Token>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct TransactionsCountsRequest {
    #[prost(message, optional, tag="1")]
    pub auth_token: ::core::option::Option<Token>,
    /// if unspecified, return transactions for all multisigs of this user
    #[prost(string, tag="2")]
    pub multisig_address: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub chain_id: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct TransactionsCount {
    #[prost(uint32, tag="1")]
    pub total: u32,
    #[prost(uint32, tag="2")]
    pub pending: u32,
    #[prost(uint32, tag="3")]
    pub executed: u32,
    #[prost(string, tag="4")]
    pub r#type: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct TransactionsCountsResponse {
    #[prost(message, optional, tag="1")]
    pub all: ::core::option::Option<TransactionsCount>,
    #[prost(message, repeated, tag="2")]
    pub by_type: ::prost::alloc::vec::Vec<TransactionsCount>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct ValidateTokenRequest {
    #[prost(message, optional, tag="1")]
    pub auth_token: ::core::option::Option<Token>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct ValidateTokenResponse {
}
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[repr(i32)]
pub enum JoinState {
    Unspecified = 0,
    In = 1,
    Out = 2,
}
impl JoinState {
    /// String value of the enum field names used in the ProtoBuf definition.
    ///
    /// The values are not transformed in any way and thus are considered stable
    /// (if the ProtoBuf definition does not change) and safe for programmatic use.
    pub fn as_str_name(&self) -> &'static str {
        match self {
            JoinState::Unspecified => "JOIN_STATE_UNSPECIFIED",
            JoinState::In => "JOIN_STATE_IN",
            JoinState::Out => "JOIN_STATE_OUT",
        }
    }
    /// Creates an enum from field names used in the ProtoBuf definition.
    pub fn from_str_name(value: &str) -> ::core::option::Option<Self> {
        match value {
            "JOIN_STATE_UNSPECIFIED" => Some(Self::Unspecified),
            "JOIN_STATE_IN" => Some(Self::In),
            "JOIN_STATE_OUT" => Some(Self::Out),
            _ => None,
        }
    }
}
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[repr(i32)]
pub enum ExecutionState {
    Unspecified = 0,
    Pending = 1,
    Executed = 2,
}
impl ExecutionState {
    /// String value of the enum field names used in the ProtoBuf definition.
    ///
    /// The values are not transformed in any way and thus are considered stable
    /// (if the ProtoBuf definition does not change) and safe for programmatic use.
    pub fn as_str_name(&self) -> &'static str {
        match self {
            ExecutionState::Unspecified => "EXECUTION_STATE_UNSPECIFIED",
            ExecutionState::Pending => "EXECUTION_STATE_PENDING",
            ExecutionState::Executed => "EXECUTION_STATE_EXECUTED",
        }
    }
    /// Creates an enum from field names used in the ProtoBuf definition.
    pub fn from_str_name(value: &str) -> ::core::option::Option<Self> {
        match value {
            "EXECUTION_STATE_UNSPECIFIED" => Some(Self::Unspecified),
            "EXECUTION_STATE_PENDING" => Some(Self::Pending),
            "EXECUTION_STATE_EXECUTED" => Some(Self::Executed),
            _ => None,
        }
    }
}
// @@protoc_insertion_point(module)
