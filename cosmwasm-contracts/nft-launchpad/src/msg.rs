use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Addr, Timestamp};

#[cw_serde]
pub struct InstantiateMsg {
    pub name: String,
    pub supported_networks: Vec<String>,
}

#[cw_serde]
pub enum ExecMsg {
    CreateCollection { 
        // Collection info ----------------------------
        name: String,
        desc: String,
        symbol: String,
        cover_img_uri: String,
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
        expected_public_mint_price: u128,
        expected_mint_date: Timestamp,

        escrow_mint_proceeds_period: Timestamp, 
        dox_state: String,

        dao_whitelist_count: u32,

        // Minting details ----------------------------
        tokens_count: u32,
        unit_price: u128,
        limit_per_address: u32,
        start_time: Timestamp,

        // Whitelist minting --------------------------
        whitelist_addresses: Vec<String>,

        whitelist_unit_price: u128,
        whitelist_limit_per_address: String,
        whitelist_member_limit: u32,
        whitelist_start_time: Timestamp,
        whitelist_end_time: Timestamp,

        // Royalty --------------------------
        royalty_address: Option<Addr>,
        royalty_percentage: Option<u8>,

        // Extend info --------------------------
        base_token_uri: Option<String>,
     },
    UpdateCollection { 
        merkle_root: Option<String>,
        start_time: Option<Vec<String>>,
        whitelist_addresses: Option<Vec<String>>,
        whitelist_start_time: Option<Timestamp>,
        whitelist_end_time: Option<Timestamp>,
     },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(CollectionResp)]
    Collection { addr: Addr },

    #[returns(MintPriceResp)]
    MintPrice { collection_addr: Addr },

    #[returns(MintableTokensResp)]
    MintableTokens { collection_addr: Addr },

    #[returns(TokensMintedToUserResp)]
    TokensMintedToUser { collection_addr: Addr, user_addr: Addr },

    #[returns(TokenInfoResp)]
    TokenInfo { collection_addr: Addr, token_id: u128 },

    #[returns(SupportedNetworksResp)]
    SupportedNetworks {}
}


#[cw_serde]
pub struct SupportedNetworksResp {
    pub networks: Vec<String>
}

#[cw_serde]
pub struct TokenInfoResp {
    pub id: String,
    pub name: String
}

#[cw_serde]
pub struct TokensMintedToUserResp {
    pub count: u128
}

#[cw_serde]
pub struct MintableTokensResp {
   pub count: u128
}

#[cw_serde]
pub struct MintPriceResp {
    pub expected_public_mint_price: u128,
    pub unit_price: u128,
    pub whitelist_unit_price: u128,
}

#[cw_serde]
pub struct CollectionResp {
    pub name: String,
    pub cover_img_uri: String,
    pub desc: String,
    pub symbol: String,
}