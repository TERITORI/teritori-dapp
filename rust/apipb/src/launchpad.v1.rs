// @generated
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct UpdateTokensMetadatasRequest {
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
pub struct UpdateTokensMetadatasResponse {
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
// message ProjectInfo {
//    // Collection info ----------------------------
//    string name = 1;
//    string desc = 2;
//    string symbol = 3;
//    string cover_img_uri = 4;
//    string target_network = 5;
//    string external_link = 6;

//    // Collection details ----------------------------
//    string website_link = 7;

//    string twitter_profile = 8;
//    uint64 twitter_followers_count = 9;

//    string contact_discord_name = 10;
//    string contact_email = 11;

//    bool is_project_derivative = 12;

//    string project_type = 13;
//    string project_desc = 14;

//    bool is_applied_previously = 15;

//    // Team info --------------------------------------
//    string team_desc = 16;
//    string team_link = 17;

//    string partners = 18;

//    string investment_desc = 19;
//    string investment_link = 20;

//    string whitepaper_link = 21;
//    string roadmap_link = 22;

//    // Additional info ----------------------------
//    string artwork_desc = 23;

//    bool is_ready_for_mint = 24;

//    uint32 expected_supply = 25;
//    uint64 expected_public_mint_price = 26;
//    uint64 expected_mint_date = 27;

//    uint64 escrow_mint_proceeds_period = 28;
//    bool is_dox = 29;

//    uint32 dao_whitelist_count = 30;

//    // Minting details ----------------------------
//    uint32 tokens_count = 31;
//    uint64 unit_price = 32;
//    uint32 limit_per_address = 33;
//    uint64 start_time = 34;

//    // Whitelist minting --------------------------
//    // repeated WhitelistMinting whitelist_mintings = 35;

//    // Royalty --------------------------
//    string royalty_address = 35;
//    uint32 royalty_percentage = 36;

//    // Extend info --------------------------
//    string base_token_uri = 37;
//    string merkle_root = 38;
//    string deployed_address = 39;
// }

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
