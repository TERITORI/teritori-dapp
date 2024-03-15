// @generated
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct DaOsRequest {
    #[prost(string, tag="1")]
    pub network_id: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub member_address: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct DaOsResponse {
    #[prost(message, repeated, tag="1")]
    pub daos: ::prost::alloc::vec::Vec<Dao>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Dao {
    #[prost(string, tag="1")]
    pub id: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub admin: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub contract_address: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub name: ::prost::alloc::string::String,
    #[prost(string, tag="5")]
    pub description: ::prost::alloc::string::String,
    #[prost(string, tag="6")]
    pub image_url: ::prost::alloc::string::String,
    #[prost(string, tag="7")]
    pub quorum: ::prost::alloc::string::String,
    #[prost(string, tag="8")]
    pub threshold: ::prost::alloc::string::String,
    #[prost(string, tag="9")]
    pub token_name: ::prost::alloc::string::String,
    #[prost(string, tag="10")]
    pub token_symbol: ::prost::alloc::string::String,
    #[prost(uint64, tag="11")]
    pub unstaking_duration: u64,
}
// @@protoc_insertion_point(module)
