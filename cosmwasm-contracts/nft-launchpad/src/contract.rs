use std::fmt::Debug;

use cosmwasm_schema::cw_serde;
use cosmwasm_std::{
    to_json_binary, Addr, Empty, Order, Response, StdResult, SubMsg, Timestamp, WasmMsg,
};
use cw_storage_plus::{Item, Map};
use sylvia::{
    contract, entry_points,
    types::{ExecCtx, InstantiateCtx, QueryCtx},
};

use crate::error::ContractError;
use cw721_base::msg::InstantiateMsg as NftInstantiateMsg;

// Contract states ------------------------------------------------------
pub struct NftLaunchpad {
    pub(crate) config: Item<'static, Config>, // nft launchpad config
    pub(crate) collection_count: Item<'static, u64>, // count total of collections
    pub(crate) collections: Map<'static, u64, Collection>, // collection id => collection info
    pub(crate) deployed_collections: Map<'static, String, u64>, // collection address => collection id
    pub(crate) pending_collections: Map<'static, u64, Empty>,   // collection
}

// Contract implement -----------------------------------------------------
#[entry_points]
#[contract]
#[error(ContractError)]
impl NftLaunchpad {
    // Init states
    pub const fn new() -> Self {
        Self {
            config: Item::new("config"),

            collection_count: Item::new("collection_count"),
            collections: Map::new("collections"),
            deployed_collections: Map::new("deployed_collections"),
            pending_collections: Map::new("pending_collections"),
        }
    }

    #[msg(instantiate)]
    pub fn instantiate(&self, ctx: InstantiateCtx, config: Config) -> StdResult<Response> {
        self.config.save(ctx.deps.storage, &config)?;
        self.collection_count.save(ctx.deps.storage, &0)?;

        Ok(Response::default()
            .add_attribute("action", "instantiate")
            .add_attribute("launchpad_name", config.name))
    }

    #[msg(exec)]
    pub fn submit_collection(
        &self,
        ctx: ExecCtx,
        collection: Collection,
    ) -> Result<Response, ContractError> {
        let storage = ctx.deps.storage;
        let new_id = self.collection_count.load(storage)? + 1;

        self.collection_count.save(storage, &new_id)?;
        self.collections.save(storage, new_id, &collection)?;
        self.pending_collections.save(storage, new_id, &Empty {})?;

        Ok(Response::default()
            .add_attribute("action", "submit_collection")
            .add_attribute("collection_id", new_id.to_string()))
    }

    #[msg(exec)]
    pub fn deploy_collection(
        &self,
        ctx: ExecCtx,
        collection_id: u64,
    ) -> Result<Response, ContractError> {
        let collection = self
            .collections
            .load(ctx.deps.storage, collection_id)
            .map_err(|_| ContractError::CollectionNotFound)?;

        let config = self.config.load(ctx.deps.storage)?;
        let sender = ctx.info.sender.to_string();
        let nft_code_id = config.nft_code_id.unwrap_or(0);

        if nft_code_id == 0 {
            return Err(ContractError::NftCodeIdMissing);
        }

        // QUESTION: How to ensure that NFT contract has been well deployed ?
        let init_msg = WasmMsg::Instantiate {
            admin: Some(sender.clone()),
            code_id: nft_code_id,
            msg: to_json_binary(&NftInstantiateMsg {
                name: collection.name,
                symbol: collection.symbol.clone(),
                minter: sender,
            })?,
            funds: vec![],
            label: format!("TR721-{} {}", nft_code_id, collection.symbol),
        };

        Ok(Response::default()
            .add_submessage(SubMsg::reply_on_success(init_msg, 1))
            .add_attribute("action", "collection_deployed"))
    }

    #[msg(query)]
    pub fn get_collection_by_id(&self, ctx: QueryCtx, collection_id: u64) -> StdResult<Collection> {
        let collection = self.collections.load(ctx.deps.storage, collection_id)?;
        Ok(collection)
    }

    #[msg(query)]
    pub fn get_pending_collections(&self, ctx: QueryCtx) -> StdResult<Vec<u64>> {
        let mut pending_collections: Vec<u64> = vec![];
        for key in self
            .pending_collections
            .keys(ctx.deps.storage, None, None, Order::Ascending)
        {
            let id = key.unwrap();
            pending_collections.push(id);
        }

        Ok(pending_collections)
    }

    #[msg(query)]
    pub fn get_config(&self, ctx: QueryCtx) -> StdResult<Config> {
        let config = self.config.load(ctx.deps.storage)?;
        Ok(config)
    }
}

// Types definitions ------------------------------------------------------
#[cw_serde]
pub struct Config {
    pub name: String,
    pub nft_code_id: Option<u64>,
    pub supported_networks: Vec<String>,
}

#[cw_serde]
pub struct Collection {
    // Collection info ----------------------------
    pub name: String,
    pub desc: String,
    pub symbol: String,
    pub cover_img_uri: String,
    pub target_network: String,
    pub external_link: Option<String>,

    // Collection details ----------------------------
    pub website_link: Option<String>,

    pub twitter_profile: String,
    pub twitter_followers_count: u64,

    pub contact_discord_name: String,
    pub contact_email: String,

    pub is_project_derivative: bool,

    pub project_type: String,
    pub project_desc: String,

    pub is_applied_previously: bool,

    // Team info --------------------------------------
    pub team_desc: String,
    pub team_link: String,

    pub partners: String,

    pub invested_amount: u64,
    pub investment_link: String,

    pub whitepaper_link: String,
    pub roadmap_link: String,

    // Additional info ----------------------------
    pub artwork_desc: String,

    pub is_ready_for_mint: bool,

    pub expected_supply: u32,
    pub expected_public_mint_price: u64,
    pub expected_mint_date: Timestamp,

    pub escrow_mint_proceeds_period: Timestamp,
    pub dox_state: String,

    pub dao_whitelist_count: u32,

    // Minting details ----------------------------
    pub tokens_count: u32,
    pub unit_price: u64,
    pub limit_per_address: u32,
    pub start_time: Timestamp,

    // Whitelist minting --------------------------
    pub whitelist_addresses: Vec<String>,

    pub whitelist_unit_price: u64,
    pub whitelist_limit_per_address: String,
    pub whitelist_member_limit: u32,
    pub whitelist_start_time: Timestamp,
    pub whitelist_end_time: Timestamp,

    // Royalty --------------------------
    pub royalty_address: Option<Addr>,
    pub royalty_percentage: Option<u8>,

    // Extend info --------------------------
    pub base_token_uri: Option<String>,
}
