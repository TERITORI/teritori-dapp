// @generated
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct CalculateMerkleRootRequest {
    #[prost(string, tag="1")]
    pub user: ::prost::alloc::string::String,
    #[prost(uint32, tag="2")]
    pub project_id: u32,
    #[prost(string, tag="3")]
    pub network_id: ::prost::alloc::string::String,
    #[prost(message, repeated, tag="4")]
    pub metadatas: ::prost::alloc::vec::Vec<Metadata>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct CalculateMerkleRootResponse {
    #[prost(string, tag="1")]
    pub merkle_root: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct UploadMetadataRequest {
    #[prost(string, tag="1")]
    pub user: ::prost::alloc::string::String,
    #[prost(uint32, tag="2")]
    pub project_id: u32,
    #[prost(string, tag="3")]
    pub network_id: ::prost::alloc::string::String,
    #[prost(message, repeated, tag="4")]
    pub metadatas: ::prost::alloc::vec::Vec<Metadata>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct UploadMetadataResponse {
    #[prost(string, tag="1")]
    pub merkle_root: ::prost::alloc::string::String,
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
    #[prost(uint64, tag="19")]
    pub invested_amount: u64,
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
    #[prost(string, tag="29")]
    pub dox_state: ::prost::alloc::string::String,
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
    /// Whitelist minting --------------------------
    #[prost(string, repeated, tag="35")]
    pub whitelist_addresses: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
    #[prost(uint64, tag="36")]
    pub whitelist_unit_price: u64,
    #[prost(string, tag="37")]
    pub whitelist_limit_per_address: ::prost::alloc::string::String,
    #[prost(uint32, tag="38")]
    pub whitelist_member_limit: u32,
    #[prost(uint64, tag="39")]
    pub whitelist_start_time: u64,
    #[prost(uint64, tag="40")]
    pub whitelist_end_time: u64,
    /// Royalty --------------------------
    #[prost(string, tag="41")]
    pub royalty_address: ::prost::alloc::string::String,
    #[prost(uint32, tag="42")]
    pub royalty_percentage: u32,
    /// Extend info --------------------------
    #[prost(string, tag="43")]
    pub base_token_uri: ::prost::alloc::string::String,
    #[prost(string, tag="44")]
    pub merkle_root: ::prost::alloc::string::String,
    #[prost(string, tag="45")]
    pub deployed_address: ::prost::alloc::string::String,
}
// @@protoc_insertion_point(module)
