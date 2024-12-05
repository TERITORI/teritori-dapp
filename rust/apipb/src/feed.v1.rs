// @generated
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct IpfsKeyRequest {
    #[prost(string, tag="1")]
    pub user_id: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct IpfsKeyResponse {
    #[prost(string, tag="1")]
    pub jwt: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Reaction {
    #[prost(string, tag="1")]
    pub icon: ::prost::alloc::string::String,
    #[prost(uint32, tag="2")]
    pub count: u32,
    #[prost(bool, tag="3")]
    pub own_state: bool,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Post {
    #[prost(uint32, tag="1")]
    pub category: u32,
    #[prost(bool, tag="2")]
    pub is_deleted: bool,
    /// use local_identifier
    #[deprecated]
    #[prost(string, tag="3")]
    pub identifier: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub metadata: ::prost::alloc::string::String,
    #[prost(string, tag="5")]
    pub parent_post_identifier: ::prost::alloc::string::String,
    #[prost(uint32, tag="6")]
    pub sub_post_length: u32,
    #[prost(string, tag="7")]
    pub author_id: ::prost::alloc::string::String,
    #[prost(int64, tag="8")]
    pub created_at: i64,
    #[prost(message, repeated, tag="9")]
    pub reactions: ::prost::alloc::vec::Vec<Reaction>,
    #[prost(int64, tag="10")]
    pub tip_amount: i64,
    #[prost(uint32, tag="11")]
    pub premium_level: u32,
    #[prost(string, tag="12")]
    pub id: ::prost::alloc::string::String,
    #[prost(string, tag="13")]
    pub local_identifier: ::prost::alloc::string::String,
    #[prost(string, tag="14")]
    pub network_id: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct PostFilter {
    #[prost(string, tag="1")]
    pub user: ::prost::alloc::string::String,
    #[prost(string, repeated, tag="2")]
    pub mentions: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
    #[prost(uint32, repeated, tag="3")]
    pub categories: ::prost::alloc::vec::Vec<u32>,
    #[prost(string, repeated, tag="4")]
    pub hashtags: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
    /// inclusive
    #[prost(int32, tag="5")]
    pub premium_level_min: i32,
    /// inclusive, -1 means infinity
    #[prost(int32, tag="6")]
    pub premium_level_max: i32,
    #[prost(string, tag="7")]
    pub network_id: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct PostsRequest {
    #[prost(message, optional, tag="1")]
    pub filter: ::core::option::Option<PostFilter>,
    #[prost(uint32, tag="2")]
    pub limit: u32,
    #[prost(uint32, tag="3")]
    pub offset: u32,
    #[prost(string, tag="4")]
    pub query_user_id: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct PostsWithLocationRequest {
    #[prost(float, tag="1")]
    pub north: f32,
    #[prost(float, tag="2")]
    pub south: f32,
    #[prost(float, tag="3")]
    pub west: f32,
    #[prost(float, tag="4")]
    pub east: f32,
    #[prost(string, repeated, tag="5")]
    pub hashtags: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
    #[prost(uint32, tag="6")]
    pub limit: u32,
    #[prost(string, tag="7")]
    pub network_id: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct AggregatedPost {
    #[prost(float, tag="1")]
    pub lat: f32,
    #[prost(float, tag="2")]
    pub long: f32,
    #[prost(int64, tag="3")]
    pub total_points: i64,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct PostsResponse {
    #[prost(message, repeated, tag="1")]
    pub posts: ::prost::alloc::vec::Vec<Post>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct PostsWithLocationResponse {
    #[prost(message, repeated, tag="1")]
    pub posts: ::prost::alloc::vec::Vec<Post>,
    #[prost(message, repeated, tag="2")]
    pub aggregated_posts: ::prost::alloc::vec::Vec<AggregatedPost>,
    #[prost(bool, tag="3")]
    pub is_aggregated: bool,
}
// @@protoc_insertion_point(module)
