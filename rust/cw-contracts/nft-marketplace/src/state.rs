use cosmwasm_std::{Addr, Uint128};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cw_storage_plus::{Item, Map};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Config {
    pub owner: Addr,
    pub fee_bp: Uint128, // based on 10000
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct NFTInfo {
    pub owner: String,
    pub denom: String,
    pub amount: Uint128,
}

// put the length bytes at the first for compatibility with legacy singleton store
pub const CONFIG: Item<Config> = Item::new("config");

// nft_contract_addr + nft_token_id => nft list info
pub const NFT_LIST: Map<String, NFTInfo> = Map::new("nft_list");
