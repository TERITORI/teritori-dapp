use cosmwasm_schema::cw_serde;
use cosmwasm_std::{Addr, Timestamp};
use cw_storage_plus::Map;

pub static COLLECTIONS: Map<u128, Collection> = Map::new("collections");

#[cw_serde]
pub struct Collection {
      // Collection info ----------------------------
      pub name: String,
      pub desc: String,
      pub symbol: String,
      pub cover_img_uri: String,
      target_network: String,
      external_link: Option<String>,

      // Collection details ----------------------------
      website_link: Option<String>,

      twitter_profile: String,
      twitter_followers_count: u64,

      contact_discord_name: String,
      contact_email: String,

      is_project_derivative: bool,

      project_type: String,
      project_desc: String,

      is_applied_previously: bool,

      // Team info --------------------------------------
      team_desc: String,
      team_link: String,

      partners: String,

      invested_amount: u128,
      investment_link: String,

      whitepaper_link: String,
      roadmap_link: String,

      // Additional info ----------------------------
      artwork_desc: String,

      is_ready_for_mint: bool,

      expected_supply: u32,
      pub expected_public_mint_price: u128,
      expected_mint_date: Timestamp,

      escrow_mint_proceeds_period: Timestamp, 
      dox_state: String,

      dao_whitelist_count: u32,

      // Minting details ----------------------------
      tokens_count: u32,
      pub unit_price: u128,
      limit_per_address: u32,
      start_time: Timestamp,

      // Whitelist minting --------------------------
      whitelist_addresses: Vec<String>,

      pub whitelist_unit_price: u128,
      whitelist_limit_per_address: String,
      whitelist_member_limit: u32,
      whitelist_start_time: Timestamp,
      whitelist_end_time: Timestamp,

      // Royalty --------------------------
      royalty_address: Option<Addr>,
      royalty_percentage: Option<u8>,

      // Extend info --------------------------
      base_token_uri: Option<String>,
}
