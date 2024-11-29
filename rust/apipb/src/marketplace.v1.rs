// @generated
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Attribute {
    #[prost(string, tag="1")]
    pub trait_type: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub value: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct PriceRange {
    #[prost(string, tag="1")]
    pub min: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub max: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Nft {
    #[prost(string, tag="1")]
    pub id: ::prost::alloc::string::String,
    #[prost(string, tag="14")]
    pub network_id: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub image_uri: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub name: ::prost::alloc::string::String,
    #[prost(string, tag="5")]
    pub mint_address: ::prost::alloc::string::String,
    #[prost(string, tag="6")]
    pub price: ::prost::alloc::string::String,
    #[prost(string, tag="7")]
    pub denom: ::prost::alloc::string::String,
    #[prost(bool, tag="8")]
    pub is_listed: bool,
    #[prost(string, tag="9")]
    pub text_insert: ::prost::alloc::string::String,
    #[prost(string, tag="10")]
    pub collection_name: ::prost::alloc::string::String,
    #[prost(string, tag="13")]
    pub owner_id: ::prost::alloc::string::String,
    #[prost(string, tag="15")]
    pub nft_contract_address: ::prost::alloc::string::String,
    #[prost(string, tag="16")]
    pub locked_on: ::prost::alloc::string::String,
    #[prost(message, repeated, tag="17")]
    pub attributes: ::prost::alloc::vec::Vec<Attribute>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Amount {
    #[prost(string, tag="1")]
    pub denom: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub quantity: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Collection {
    #[prost(string, tag="1")]
    pub id: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub image_uri: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub collection_name: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub creator_name: ::prost::alloc::string::String,
    #[prost(bool, tag="5")]
    pub verified: bool,
    #[prost(string, tag="6")]
    pub mint_address: ::prost::alloc::string::String,
    #[prost(string, tag="11")]
    pub network_id: ::prost::alloc::string::String,
    #[prost(string, tag="8")]
    pub volume: ::prost::alloc::string::String,
    #[prost(string, tag="9")]
    pub volume_denom: ::prost::alloc::string::String,
    #[prost(string, tag="10")]
    pub creator_id: ::prost::alloc::string::String,
    #[prost(bool, tag="12")]
    pub secondary_during_mint: bool,
    #[prost(string, tag="13")]
    pub website_url: ::prost::alloc::string::String,
    #[prost(string, tag="14")]
    pub twitter_url: ::prost::alloc::string::String,
    #[prost(string, tag="15")]
    pub floor_price: ::prost::alloc::string::String,
    #[prost(int64, tag="16")]
    pub max_supply: i64,
    #[prost(string, tag="17")]
    pub mint_price: ::prost::alloc::string::String,
    #[prost(string, tag="18")]
    pub total_volume: ::prost::alloc::string::String,
    #[prost(int64, tag="19")]
    pub num_trades: i64,
    #[prost(int32, tag="20")]
    pub num_owners: i32,
    #[prost(string, tag="21")]
    pub denom: ::prost::alloc::string::String,
    #[prost(float, tag="22")]
    pub volume_compare: f32,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct CollectionStats {
    #[prost(message, repeated, tag="1")]
    pub floor_price: ::prost::alloc::vec::Vec<Amount>,
    #[prost(string, tag="2")]
    pub total_volume: ::prost::alloc::string::String,
    #[prost(int32, tag="3")]
    pub owners: i32,
    #[prost(int32, tag="4")]
    pub listed: i32,
    #[prost(int64, tag="5")]
    pub total_supply: i64,
    #[prost(int32, tag="6")]
    pub owned: i32,
    #[prost(float, tag="7")]
    pub avg_price_period: f32,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct AttributeRarityFloor {
    #[prost(string, tag="1")]
    pub trait_type: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub value: ::prost::alloc::string::String,
    #[prost(int32, tag="3")]
    pub counta: i32,
    #[prost(float, tag="4")]
    pub floor: f32,
    #[prost(string, tag="5")]
    pub collection_id: ::prost::alloc::string::String,
    #[prost(float, tag="6")]
    pub rare_ratio: f32,
    #[prost(int32, tag="7")]
    pub collection_size: i32,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct NftCollectionAttributesResponse {
    #[prost(message, optional, tag="1")]
    pub attributes: ::core::option::Option<AttributeRarityFloor>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Activity {
    #[prost(string, tag="1")]
    pub id: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub transaction_kind: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub target_name: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub target_image_uri: ::prost::alloc::string::String,
    #[prost(string, tag="5")]
    pub contract_name: ::prost::alloc::string::String,
    #[prost(string, tag="6")]
    pub time: ::prost::alloc::string::String,
    #[prost(string, tag="7")]
    pub amount: ::prost::alloc::string::String,
    #[prost(string, tag="8")]
    pub denom: ::prost::alloc::string::String,
    #[prost(string, tag="9")]
    pub transaction_id: ::prost::alloc::string::String,
    #[prost(string, tag="10")]
    pub buyer_id: ::prost::alloc::string::String,
    #[prost(string, tag="11")]
    pub seller_id: ::prost::alloc::string::String,
    #[prost(double, tag="12")]
    pub usd_price: f64,
    #[prost(string, tag="13")]
    pub target_id: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Quest {
    #[prost(string, tag="1")]
    pub id: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub title: ::prost::alloc::string::String,
    #[prost(bool, tag="3")]
    pub completed: bool,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct PriceDatum {
    #[prost(string, tag="3")]
    pub price: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub time: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct CollectionsRequest {
    #[prost(int32, tag="2")]
    pub limit: i32,
    #[prost(int32, tag="3")]
    pub offset: i32,
    #[prost(enumeration="Sort", tag="4")]
    pub sort: i32,
    #[prost(enumeration="SortDirection", tag="5")]
    pub sort_direction: i32,
    #[prost(bool, tag="6")]
    pub upcoming: bool,
    #[prost(string, tag="7")]
    pub network_id: ::prost::alloc::string::String,
    #[prost(enumeration="MintState", tag="8")]
    pub mint_state: i32,
    #[prost(int32, optional, tag="9")]
    pub period_in_minutes: ::core::option::Option<i32>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct CollectionStatsRequest {
    #[prost(string, tag="1")]
    pub collection_id: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub owner_id: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct NftCollectionAttributesRequest {
    #[prost(string, tag="1")]
    pub collection_id: ::prost::alloc::string::String,
    #[prost(message, repeated, tag="2")]
    pub where_attributes: ::prost::alloc::vec::Vec<Attribute>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct CollectionStatsResponse {
    #[prost(message, optional, tag="1")]
    pub stats: ::core::option::Option<CollectionStats>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct CollectionsResponse {
    #[prost(message, optional, tag="1")]
    pub collection: ::core::option::Option<Collection>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct NfTsRequest {
    #[prost(int32, tag="1")]
    pub limit: i32,
    #[prost(int32, tag="2")]
    pub offset: i32,
    #[prost(string, tag="3")]
    pub collection_id: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub owner_id: ::prost::alloc::string::String,
    #[prost(enumeration="Sort", tag="5")]
    pub sort: i32,
    #[prost(enumeration="SortDirection", tag="6")]
    pub sort_direction: i32,
    #[prost(message, repeated, tag="7")]
    pub attributes: ::prost::alloc::vec::Vec<Attribute>,
    #[prost(bool, tag="8")]
    pub is_listed: bool,
    #[prost(message, optional, tag="9")]
    pub price_range: ::core::option::Option<PriceRange>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct NfTsResponse {
    #[prost(message, optional, tag="1")]
    pub nft: ::core::option::Option<Nft>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QuestsRequest {
    #[prost(int32, tag="1")]
    pub limit: i32,
    #[prost(int32, tag="2")]
    pub offset: i32,
    #[prost(string, tag="3")]
    pub user_id: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QuestsResponse {
    #[prost(message, optional, tag="1")]
    pub quest: ::core::option::Option<Quest>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct ActivityRequest {
    #[prost(string, tag="1")]
    pub collection_id: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub nft_id: ::prost::alloc::string::String,
    #[prost(int32, tag="3")]
    pub limit: i32,
    #[prost(int32, tag="4")]
    pub offset: i32,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct ActivityResponse {
    #[prost(message, optional, tag="1")]
    pub activity: ::core::option::Option<Activity>,
    #[prost(int64, tag="2")]
    pub total: i64,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct NftPriceHistoryRequest {
    #[prost(string, tag="1")]
    pub id: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct NftPriceHistoryResponse {
    #[prost(message, repeated, tag="1")]
    pub data: ::prost::alloc::vec::Vec<PriceDatum>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Action {
    #[prost(string, tag="1")]
    pub label: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub url: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct News {
    #[prost(string, tag="1")]
    pub title: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub subtitle: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub text: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub image: ::prost::alloc::string::String,
    #[prost(message, repeated, tag="5")]
    pub actions: ::prost::alloc::vec::Vec<Action>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Banner {
    #[prost(string, tag="1")]
    pub image: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub url: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct BannersRequest {
    #[prost(bool, tag="1")]
    pub testnet: bool,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct BannersResponse {
    #[prost(message, repeated, tag="1")]
    pub banners: ::prost::alloc::vec::Vec<Banner>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct NewsRequest {
    #[prost(bool, tag="1")]
    pub testnet: bool,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct NewsResponse {
    #[prost(message, repeated, tag="1")]
    pub news: ::prost::alloc::vec::Vec<News>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct DAppsRequest {
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct DAppsGroupsRequest {
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct SearchNamesRequest {
    #[prost(string, tag="1")]
    pub network_id: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub input: ::prost::alloc::string::String,
    #[prost(int32, tag="3")]
    pub limit: i32,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct SearchNamesResponse {
    #[prost(string, repeated, tag="1")]
    pub names: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct SearchCollectionsRequest {
    #[prost(string, tag="1")]
    pub input: ::prost::alloc::string::String,
    #[prost(int32, tag="2")]
    pub limit: i32,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct SearchCollectionsResponse {
    #[prost(message, repeated, tag="1")]
    pub collections: ::prost::alloc::vec::Vec<Collection>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct LeaderboardEntry {
    #[prost(uint32, tag="1")]
    pub rank: u32,
    #[prost(string, tag="2")]
    pub user_id: ::prost::alloc::string::String,
    #[prost(double, tag="3")]
    pub total_xp: f64,
    #[prost(double, tag="4")]
    pub mint_xp: f64,
    #[prost(double, tag="5")]
    pub buy_xp: f64,
    #[prost(double, tag="6")]
    pub sell_xp: f64,
    #[prost(double, tag="7")]
    pub boost: f64,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct LeaderboardRequest {
    #[prost(string, tag="1")]
    pub network_id: ::prost::alloc::string::String,
    #[prost(uint32, tag="2")]
    pub period_hours: u32,
    #[prost(uint32, tag="3")]
    pub limit: u32,
    #[prost(uint32, tag="4")]
    pub offset: u32,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct LeaderboardResponse {
    #[prost(message, optional, tag="1")]
    pub entry: ::core::option::Option<LeaderboardEntry>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Coin {
    #[prost(string, tag="1")]
    pub amount: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub denom: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct PopularCollection {
    #[prost(string, tag="1")]
    pub id: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub name: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub image_uri: ::prost::alloc::string::String,
    #[prost(message, repeated, tag="4")]
    pub floor_prices: ::prost::alloc::vec::Vec<Coin>,
    #[prost(message, repeated, tag="5")]
    pub trade_volumes_by_denom: ::prost::alloc::vec::Vec<Coin>,
    #[prost(message, repeated, tag="15")]
    pub mint_volumes_by_denom: ::prost::alloc::vec::Vec<Coin>,
    #[prost(double, tag="6")]
    pub trade_usd_volume: f64,
    #[prost(double, tag="7")]
    pub trade_usd_volume_prev: f64,
    #[prost(double, tag="8")]
    pub mint_usd_volume: f64,
    #[prost(double, tag="9")]
    pub mint_usd_volume_prev: f64,
    #[prost(uint64, tag="10")]
    pub trades_count: u64,
    #[prost(uint64, tag="16")]
    pub mints_count: u64,
    #[prost(uint64, tag="11")]
    pub owners_count: u64,
    #[prost(uint32, tag="12")]
    pub rank: u32,
    #[prost(int64, tag="13")]
    pub max_supply: i64,
    #[prost(uint64, tag="14")]
    pub current_supply: u64,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct PopularCollectionsRequest {
    #[prost(string, tag="1")]
    pub network_id: ::prost::alloc::string::String,
    #[prost(uint32, tag="2")]
    pub period_hours: u32,
    #[prost(uint32, tag="3")]
    pub limit: u32,
    #[prost(uint32, tag="4")]
    pub offset: u32,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct PopularCollectionsResponse {
    #[prost(message, optional, tag="1")]
    pub collection: ::core::option::Option<PopularCollection>,
}
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[repr(i32)]
pub enum Sort {
    Unspecified = 0,
    Price = 1,
    Volume = 2,
    MarketCap = 3,
    CreatedAt = 4,
    VolumeUsd = 5,
}
impl Sort {
    /// String value of the enum field names used in the ProtoBuf definition.
    ///
    /// The values are not transformed in any way and thus are considered stable
    /// (if the ProtoBuf definition does not change) and safe for programmatic use.
    pub fn as_str_name(&self) -> &'static str {
        match self {
            Sort::Unspecified => "SORT_UNSPECIFIED",
            Sort::Price => "SORT_PRICE",
            Sort::Volume => "SORT_VOLUME",
            Sort::MarketCap => "SORT_MARKET_CAP",
            Sort::CreatedAt => "SORT_CREATED_AT",
            Sort::VolumeUsd => "SORT_VOLUME_USD",
        }
    }
    /// Creates an enum from field names used in the ProtoBuf definition.
    pub fn from_str_name(value: &str) -> ::core::option::Option<Self> {
        match value {
            "SORT_UNSPECIFIED" => Some(Self::Unspecified),
            "SORT_PRICE" => Some(Self::Price),
            "SORT_VOLUME" => Some(Self::Volume),
            "SORT_MARKET_CAP" => Some(Self::MarketCap),
            "SORT_CREATED_AT" => Some(Self::CreatedAt),
            "SORT_VOLUME_USD" => Some(Self::VolumeUsd),
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
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[repr(i32)]
pub enum MintState {
    Unspecified = 0,
    Running = 1,
    Ended = 2,
}
impl MintState {
    /// String value of the enum field names used in the ProtoBuf definition.
    ///
    /// The values are not transformed in any way and thus are considered stable
    /// (if the ProtoBuf definition does not change) and safe for programmatic use.
    pub fn as_str_name(&self) -> &'static str {
        match self {
            MintState::Unspecified => "MINT_STATE_UNSPECIFIED",
            MintState::Running => "MINT_STATE_RUNNING",
            MintState::Ended => "MINT_STATE_ENDED",
        }
    }
    /// Creates an enum from field names used in the ProtoBuf definition.
    pub fn from_str_name(value: &str) -> ::core::option::Option<Self> {
        match value {
            "MINT_STATE_UNSPECIFIED" => Some(Self::Unspecified),
            "MINT_STATE_RUNNING" => Some(Self::Running),
            "MINT_STATE_ENDED" => Some(Self::Ended),
            _ => None,
        }
    }
}
// @@protoc_insertion_point(module)
