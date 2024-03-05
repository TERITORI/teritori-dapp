use cosmwasm_schema::cw_serde;
use cosmwasm_std::Addr;
use cw_storage_plus::Map;

pub static COLLECTIONS: Map<u32, Collection> = Map::new("collections");

#[cw_serde]
pub struct Collection {
    pub creator: Addr,
    pub name: String,
    pub image_uri: String,
    pub merkle_root: Option<String>,
}
