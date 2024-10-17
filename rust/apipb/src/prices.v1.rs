// @generated
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct PricesRequest {
    #[prost(string, tag="1")]
    pub id: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub time: ::prost::alloc::string::String,
    #[prost(string, repeated, tag="3")]
    pub vs_ids: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Price {
    #[prost(string, tag="1")]
    pub id: ::prost::alloc::string::String,
    #[prost(double, tag="2")]
    pub value: f64,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct PricesResponse {
    #[prost(message, repeated, tag="1")]
    pub prices: ::prost::alloc::vec::Vec<Price>,
}
// @@protoc_insertion_point(module)
