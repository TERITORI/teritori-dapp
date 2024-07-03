// @generated
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct CollectionsByCreatorRequest {
    #[prost(string, tag="1")]
    pub creator_id: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub network_id: ::prost::alloc::string::String,
    #[prost(int32, tag="3")]
    pub limit: i32,
    #[prost(int32, tag="4")]
    pub offset: i32,
    #[prost(enumeration="Sort", tag="5")]
    pub sort: i32,
    #[prost(enumeration="SortDirection", tag="6")]
    pub sort_direction: i32,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct CollectionsByCreatorResponse {
    #[prost(string, repeated, tag="1")]
    pub collections: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct LaunchpadProjectsRequest {
    #[prost(string, tag="1")]
    pub network_id: ::prost::alloc::string::String,
    #[prost(int32, tag="2")]
    pub limit: i32,
    #[prost(int32, tag="3")]
    pub offset: i32,
    #[prost(enumeration="Sort", tag="4")]
    pub sort: i32,
    ///   TODO: user authentication (Member of the admin DAO)
    #[prost(enumeration="SortDirection", tag="5")]
    pub sort_direction: i32,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct LaunchpadProjectsResponse {
    #[prost(message, repeated, tag="1")]
    pub projects: ::prost::alloc::vec::Vec<LaunchpadProject>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct UploadMetadatasRequest {
    #[prost(string, tag="1")]
    pub sender: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub network_id: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub project_id: ::prost::alloc::string::String,
    #[prost(message, repeated, tag="4")]
    pub metadatas: ::prost::alloc::vec::Vec<Metadata>,
    #[prost(string, optional, tag="5")]
    pub pinata_jwt: ::core::option::Option<::prost::alloc::string::String>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct UploadMetadatasResponse {
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
    #[prost(string, tag="3")]
    pub project_id: ::prost::alloc::string::String,
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
pub struct LaunchpadProject {
    #[prost(string, tag="1")]
    pub id: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub network_id: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub collection_name: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub creator_id: ::prost::alloc::string::String,
    #[prost(string, tag="5")]
    pub collection_data: ::prost::alloc::string::String,
    #[prost(string, optional, tag="6")]
    pub merkle_root: ::core::option::Option<::prost::alloc::string::String>,
}
// message UpdateCollectionWhitelistsRequest {
//    string sender = 1;
//    string network_id = 2;
//    uint32 project_id = 3;
//    repeated WhitelistMintInfo whitelist_mint_infos = 4; 
// }

// message UpdateCollectionWhitelistsResponse {
//    repeated string merkle_roots = 1;
// }

// message WhitelistedAddressMerkleInfoRequest {
//    string sender = 1;
//    string network_id = 2;
//    uint32 project_id = 3;
//    uint32 whitelist_id = 4;
//    string address = 5;
// }

// message WhitelistedAddressMerkleInfoResponse {
//    string merkle_root = 1;
//    repeated string merkle_proof = 2;
// }

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
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[repr(i32)]
pub enum Sort {
    Unspecified = 0,
    CollectionName = 1,
}
impl Sort {
    /// String value of the enum field names used in the ProtoBuf definition.
    ///
    /// The values are not transformed in any way and thus are considered stable
    /// (if the ProtoBuf definition does not change) and safe for programmatic use.
    pub fn as_str_name(&self) -> &'static str {
        match self {
            Sort::Unspecified => "SORT_UNSPECIFIED",
            Sort::CollectionName => "SORT_COLLECTION_NAME",
        }
    }
    /// Creates an enum from field names used in the ProtoBuf definition.
    pub fn from_str_name(value: &str) -> ::core::option::Option<Self> {
        match value {
            "SORT_UNSPECIFIED" => Some(Self::Unspecified),
            "SORT_COLLECTION_NAME" => Some(Self::CollectionName),
            _ => None,
        }
    }
}
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[repr(i32)]
pub enum SortDirection {
    Unspecified = 0,
    Ascending = 1,
    Descending = 2,
}
impl SortDirection {
    /// String value of the enum field names used in the ProtoBuf definition.
    ///
    /// The values are not transformed in any way and thus are considered stable
    /// (if the ProtoBuf definition does not change) and safe for programmatic use.
    pub fn as_str_name(&self) -> &'static str {
        match self {
            SortDirection::Unspecified => "SORT_DIRECTION_UNSPECIFIED",
            SortDirection::Ascending => "SORT_DIRECTION_ASCENDING",
            SortDirection::Descending => "SORT_DIRECTION_DESCENDING",
        }
    }
    /// Creates an enum from field names used in the ProtoBuf definition.
    pub fn from_str_name(value: &str) -> ::core::option::Option<Self> {
        match value {
            "SORT_DIRECTION_UNSPECIFIED" => Some(Self::Unspecified),
            "SORT_DIRECTION_ASCENDING" => Some(Self::Ascending),
            "SORT_DIRECTION_DESCENDING" => Some(Self::Descending),
            _ => None,
        }
    }
}
// @@protoc_insertion_point(module)
