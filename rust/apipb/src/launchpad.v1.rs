// @generated
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct UpdateCollectionMetadatasRequest {
    #[prost(string, tag="1")]
    pub sender: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub network_id: ::prost::alloc::string::String,
    #[prost(uint32, tag="3")]
    pub project_id: u32,
    #[prost(message, repeated, tag="4")]
    pub metadatas: ::prost::alloc::vec::Vec<Metadata>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct UpdateCollectionMetadatasResponse {
    #[prost(string, tag="1")]
    pub merkle_root: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct CalculateCollectionMerkleRootRequest {
    #[prost(string, tag="1")]
    pub sender: ::prost::alloc::string::String,
    #[prost(message, repeated, tag="2")]
    pub metadatas: ::prost::alloc::vec::Vec<Metadata>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct CalculateCollectionMerkleRootResponse {
    #[prost(string, tag="1")]
    pub merkle_root: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct TokenMetadataRequest {
    #[prost(string, tag="1")]
    pub sender: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub network_id: ::prost::alloc::string::String,
    #[prost(uint32, tag="3")]
    pub project_id: u32,
    #[prost(uint32, tag="4")]
    pub token_id: u32,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct TokenMetadataResponse {
    #[prost(string, tag="1")]
    pub merkle_root: ::prost::alloc::string::String,
    #[prost(message, optional, tag="2")]
    pub metadata: ::core::option::Option<Metadata>,
    #[prost(string, repeated, tag="3")]
    pub merkle_proof: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct UpdateCollectionWhitelistsRequest {
    #[prost(string, tag="1")]
    pub sender: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub network_id: ::prost::alloc::string::String,
    #[prost(uint32, tag="3")]
    pub project_id: u32,
    #[prost(message, repeated, tag="4")]
    pub whitelist_mint_infos: ::prost::alloc::vec::Vec<WhitelistMintInfo>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct UpdateCollectionWhitelistsResponse {
    #[prost(string, repeated, tag="1")]
    pub merkle_roots: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct WhitelistedAddressMerkleInfoRequest {
    #[prost(string, tag="1")]
    pub sender: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub network_id: ::prost::alloc::string::String,
    #[prost(uint32, tag="3")]
    pub project_id: u32,
    #[prost(uint32, tag="4")]
    pub whitelist_id: u32,
    #[prost(string, tag="5")]
    pub address: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct WhitelistedAddressMerkleInfoResponse {
    #[prost(string, tag="1")]
    pub merkle_root: ::prost::alloc::string::String,
    #[prost(string, repeated, tag="2")]
    pub merkle_proof: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Metadata {
    #[prost(string, optional, tag="1")]
    pub image: ::core::option::Option<::prost::alloc::string::String>,
    #[prost(string, optional, tag="2")]
    pub image_data: ::core::option::Option<::prost::alloc::string::String>,
    #[prost(string, optional, tag="3")]
    pub external_url: ::core::option::Option<::prost::alloc::string::String>,
    #[prost(string, optional, tag="4")]
    pub description: ::core::option::Option<::prost::alloc::string::String>,
    #[prost(string, optional, tag="5")]
    pub name: ::core::option::Option<::prost::alloc::string::String>,
    #[prost(message, repeated, tag="6")]
    pub attributes: ::prost::alloc::vec::Vec<Trait>,
    #[prost(string, optional, tag="7")]
    pub background_color: ::core::option::Option<::prost::alloc::string::String>,
    #[prost(string, optional, tag="8")]
    pub animation_url: ::core::option::Option<::prost::alloc::string::String>,
    #[prost(string, optional, tag="9")]
    pub youtube_url: ::core::option::Option<::prost::alloc::string::String>,
    #[prost(uint64, optional, tag="10")]
    pub royalty_percentage: ::core::option::Option<u64>,
    #[prost(string, optional, tag="11")]
    pub royalty_payment_address: ::core::option::Option<::prost::alloc::string::String>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Trait {
    #[prost(string, optional, tag="1")]
    pub display_type: ::core::option::Option<::prost::alloc::string::String>,
    #[prost(string, tag="2")]
    pub trait_type: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub value: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Collection {
    /// Collection info ----------------------------
    #[prost(string, tag="1")]
    pub name: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub desc: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub symbol: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub cover_img_uri: ::prost::alloc::string::String,
    #[prost(string, tag="5")]
    pub target_network: ::prost::alloc::string::String,
    #[prost(string, tag="6")]
    pub external_link: ::prost::alloc::string::String,
    /// Collection details ----------------------------
    #[prost(string, tag="7")]
    pub website_link: ::prost::alloc::string::String,
    #[prost(string, tag="8")]
    pub twitter_profile: ::prost::alloc::string::String,
    #[prost(uint64, tag="9")]
    pub twitter_followers_count: u64,
    #[prost(string, tag="10")]
    pub contact_discord_name: ::prost::alloc::string::String,
    #[prost(string, tag="11")]
    pub contact_email: ::prost::alloc::string::String,
    #[prost(bool, tag="12")]
    pub is_project_derivative: bool,
    #[prost(string, tag="13")]
    pub project_type: ::prost::alloc::string::String,
    #[prost(string, tag="14")]
    pub project_desc: ::prost::alloc::string::String,
    #[prost(bool, tag="15")]
    pub is_applied_previously: bool,
    /// Team info --------------------------------------
    #[prost(string, tag="16")]
    pub team_desc: ::prost::alloc::string::String,
    #[prost(string, tag="17")]
    pub team_link: ::prost::alloc::string::String,
    #[prost(string, tag="18")]
    pub partners: ::prost::alloc::string::String,
    #[prost(string, tag="19")]
    pub investment_desc: ::prost::alloc::string::String,
    #[prost(string, tag="20")]
    pub investment_link: ::prost::alloc::string::String,
    #[prost(string, tag="21")]
    pub whitepaper_link: ::prost::alloc::string::String,
    #[prost(string, tag="22")]
    pub roadmap_link: ::prost::alloc::string::String,
    /// Additional info ----------------------------
    #[prost(string, tag="23")]
    pub artwork_desc: ::prost::alloc::string::String,
    #[prost(bool, tag="24")]
    pub is_ready_for_mint: bool,
    #[prost(uint32, tag="25")]
    pub expected_supply: u32,
    #[prost(uint64, tag="26")]
    pub expected_public_mint_price: u64,
    #[prost(uint64, tag="27")]
    pub expected_mint_date: u64,
    #[prost(uint64, tag="28")]
    pub escrow_mint_proceeds_period: u64,
    #[prost(bool, tag="29")]
    pub is_dox: bool,
    #[prost(uint32, tag="30")]
    pub dao_whitelist_count: u32,
    /// Minting details ----------------------------
    #[prost(uint32, tag="31")]
    pub tokens_count: u32,
    #[prost(uint64, tag="32")]
    pub unit_price: u64,
    #[prost(uint32, tag="33")]
    pub limit_per_address: u32,
    #[prost(uint64, tag="34")]
    pub start_time: u64,
    // Whitelist minting --------------------------
    // repeated WhitelistMinting whitelist_mintings = 35;

    /// Royalty --------------------------
    #[prost(string, tag="35")]
    pub royalty_address: ::prost::alloc::string::String,
    #[prost(uint32, tag="36")]
    pub royalty_percentage: u32,
    /// Extend info --------------------------
    #[prost(string, tag="37")]
    pub base_token_uri: ::prost::alloc::string::String,
    #[prost(string, tag="38")]
    pub merkle_root: ::prost::alloc::string::String,
    #[prost(string, tag="39")]
    pub deployed_address: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct WhitelistMintInfo {
    #[prost(string, repeated, tag="1")]
    pub addresses: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
    #[prost(uint64, tag="2")]
    pub unit_price: u64,
    #[prost(string, tag="3")]
    pub denom: ::prost::alloc::string::String,
    #[prost(uint32, tag="4")]
    pub limit_per_address: u32,
    #[prost(uint32, tag="5")]
    pub addresses_count: u32,
    #[prost(uint64, tag="6")]
    pub start_time: u64,
    #[prost(uint64, tag="7")]
    pub end_time: u64,
}
// @@protoc_insertion_point(module)
