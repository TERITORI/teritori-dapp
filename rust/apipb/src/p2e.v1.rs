// @generated
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MerkleDataRequest {
    #[prost(string, tag="1")]
    pub user_id: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub token: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub network_id: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct UserReward {
    #[prost(string, tag="1")]
    pub to: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub token: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub amount: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MerkleDataResponse {
    #[prost(string, repeated, tag="1")]
    pub proof: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
    #[prost(message, optional, tag="2")]
    pub user_reward: ::core::option::Option<UserReward>,
    #[prost(string, tag="3")]
    pub claimable_amount: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct AllSeasonsRequest {
    #[prost(string, tag="1")]
    pub network_id: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct SeasonWithoutPrize {
    #[prost(string, tag="1")]
    pub id: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub boss_name: ::prost::alloc::string::String,
    #[prost(int32, tag="3")]
    pub boss_hp: i32,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct AllSeasonsResponse {
    #[prost(message, repeated, tag="1")]
    pub seasons: ::prost::alloc::vec::Vec<SeasonWithoutPrize>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct CurrentSeasonRequest {
    #[prost(string, tag="1")]
    pub network_id: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct CurrentSeasonResponse {
    #[prost(string, tag="1")]
    pub id: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub denom: ::prost::alloc::string::String,
    #[prost(int32, tag="3")]
    pub total_prize: i32,
    #[prost(string, tag="4")]
    pub boss_name: ::prost::alloc::string::String,
    #[prost(int32, tag="5")]
    pub boss_hp: i32,
    #[prost(float, tag="6")]
    pub remaining_hp: f32,
    #[prost(string, tag="7")]
    pub boss_image: ::prost::alloc::string::String,
    #[prost(bool, tag="8")]
    pub is_pre: bool,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct UserRankRequest {
    #[prost(string, tag="1")]
    pub season_id: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub user_id: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub network_id: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct UserRankResponse {
    #[prost(message, optional, tag="1")]
    pub user_score: ::core::option::Option<UserScore>,
    #[prost(int32, tag="2")]
    pub total_users: i32,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct LeaderboardRequest {
    #[prost(string, tag="1")]
    pub season_id: ::prost::alloc::string::String,
    #[prost(int32, tag="2")]
    pub limit: i32,
    #[prost(int32, tag="3")]
    pub offset: i32,
    #[prost(string, tag="4")]
    pub network_id: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct UserScore {
    #[prost(int32, tag="1")]
    pub rank: i32,
    #[prost(int32, tag="2")]
    pub snapshot_rank: i32,
    #[prost(string, tag="3")]
    pub user_id: ::prost::alloc::string::String,
    #[prost(int64, tag="4")]
    pub in_progress_score: i64,
    #[prost(int64, tag="5")]
    pub snapshot_score: i64,
    #[prost(string, tag="6")]
    pub season_id: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct LeaderboardResponse {
    #[prost(message, optional, tag="1")]
    pub user_score: ::core::option::Option<UserScore>,
}
// @@protoc_insertion_point(module)
