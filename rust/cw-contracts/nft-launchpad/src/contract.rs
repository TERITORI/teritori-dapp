use cosmwasm_schema::cw_serde;
use cosmwasm_std::{
    to_json_binary, Addr, Order, Reply, Response, StdResult, SubMsg, Timestamp, WasmMsg,
};
use cw_storage_plus::{Item, Map};
use cw_utils::parse_reply_instantiate_data;
use sylvia::{
    contract, entry_points,
    types::{ExecCtx, InstantiateCtx, QueryCtx, ReplyCtx},
};

use crate::error::ContractError;

use nft_tr721::{contract::sv::InstantiateMsg as Tr721InstantiateMsg, test_helpers::get_default_mint_info};

const INSTANTIATE_REPLY_ID: u64 = 1u64;

// Contract states ------------------------------------------------------
pub struct NftLaunchpad {
    pub(crate) config: Item<'static, Config>, // nft launchpad config
    pub(crate) collections: Map<'static, u64, Collection>, // collection id => collection info

    pub(crate) instantiating_collection_id: Item<'static, u64>,
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

            collections: Map::new("collections"),
            instantiating_collection_id: Item::new("instantiating_collection_id"),
        }
    }

    #[msg(instantiate)]
    pub fn instantiate(&self, ctx: InstantiateCtx, config: Config) -> StdResult<Response> {
        self.config.save(ctx.deps.storage, &config)?;

        Ok(Response::new()
            .add_attribute("action", "instantiate")
            .add_attribute("launchpad_name", config.name))
    }

    #[msg(exec)]
    pub fn update_config(&self, ctx: ExecCtx, changes: Config) -> StdResult<Response> {
        self.config.save(ctx.deps.storage, &changes)?;

        Ok(Response::new().add_attribute("action", "update_config"))
    }

    #[msg(exec)]
    pub fn submit_collection(
        &self,
        ctx: ExecCtx,
        collection: Collection,
    ) -> Result<Response, ContractError> {
        let storage = ctx.deps.storage;

        // Increase collection id by 1
        let last_collection = self.collections.last(storage).unwrap();
        let new_id: u64 = match last_collection {
            Some(item) => item.0 + 1,
            None => 1,
        };

        // Add new collection
        self.collections.save(storage, new_id, &collection)?;

        Ok(Response::new()
            .add_attribute("action", "submit_collection")
            .add_attribute("collection_id", new_id.to_string()))
    }

    #[msg(exec)]
    pub fn update_merkle_root(
        &self,
        ctx: ExecCtx,
        collection_id: u64,
        merkle_root: String,
    ) -> Result<Response, ContractError> {
        let storage = ctx.deps.storage;

        let mut collection = self
            .collections
            .load(storage, collection_id)
            .map_err(|_| ContractError::CollectionNotFound)?;

        // Do not allow to update merke root if the collection has been deployed already
        if collection.deployed_address.is_some() {
            return Err(ContractError::Forbidden);
        }

        // Update merkle root
        collection.merkle_root = Some(merkle_root.clone());

        // Update collection
        self.collections.save(storage, collection_id, &collection)?;

        Ok(Response::new()
            .add_attribute("action", "update_merkle_root")
            .add_attribute("merkle_root", merkle_root))
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

        // Do not allow to deploy collection if merkle root is not set
        if collection.merkle_root.is_none() {
            return Err(ContractError::MerkleRootMissing);
        }

        let config = self.config.load(ctx.deps.storage)?;
        let sender = ctx.info.sender.to_string();
        let nft_code_id = config.nft_code_id;

        // Do not allow to deploy collection is nft_code_is is not set
        if nft_code_id.is_none() {
            return Err(ContractError::NftCodeIdMissing);
        }

        // NOTE: cannot use wasm_instantiate because we need to specify admin
        let instantiate_msg = WasmMsg::Instantiate {
            admin: Some(sender.clone()),
            code_id: nft_code_id.unwrap(),
            msg: to_json_binary(&Tr721InstantiateMsg {
                name: collection.name.clone(),
                symbol: collection.symbol.clone(),
                minter: sender,
                launchpad_contract: "launchpad_contract".to_string(),
                mint_info: get_default_mint_info(),
            })?,
            funds: vec![],
            label: format!(
                "TR721 codeId:{} collectionId:{} symbol:{}",
                nft_code_id.unwrap(),
                collection_id,
                collection.symbol
            ),
        };

        // Update instantiating collection id
        self.instantiating_collection_id
            .save(ctx.deps.storage, &collection_id)?;

        let submessage = SubMsg::reply_on_success(instantiate_msg, INSTANTIATE_REPLY_ID);

        Ok(Response::new()
            .add_submessage(submessage)
            .add_attribute("action", "collection_deployed")
            .add_attribute("collection_id", collection_id.to_string()))
    }

    #[msg(query)]
    pub fn get_collection_by_id(&self, ctx: QueryCtx, collection_id: u64) -> StdResult<Collection> {
        let collection = self.collections.load(ctx.deps.storage, collection_id)?;
        Ok(collection)
    }

    // NOTE: This might be costly !!!
    #[msg(query)]
    pub fn get_collection_by_addr(
        &self,
        ctx: QueryCtx,
        collection_addr: String,
    ) -> Result<Collection, ContractError> {
        for item in self
            .collections
            .range(ctx.deps.storage, None, None, Order::Ascending)
        {
            let (_key, collection) = item?;

            if collection.deployed_address == Some(collection_addr.clone()) {
                return Ok(collection);
            }
        }

        Err(ContractError::CollectionNotFound)
    }

    #[msg(query)]
    pub fn get_config(&self, ctx: QueryCtx) -> StdResult<Config> {
        let config = self.config.load(ctx.deps.storage)?;
        Ok(config)
    }

    #[msg(reply)]
    pub fn handle_reply(&self, ctx: ReplyCtx, msg: Reply) -> Result<Response, ContractError> {
        let msg_id = msg.id;
        let storage = ctx.deps.storage;

        if msg_id == INSTANTIATE_REPLY_ID {
            let resp = parse_reply_instantiate_data(msg).unwrap();
            let deployed_addr = resp.contract_address;

            // Get instantiating collection id
            let collection_id = self.instantiating_collection_id.load(storage)?;

            // Update collection states
            let mut collection = self.collections.load(storage, collection_id)?;
            collection.deployed_address = Some(deployed_addr.clone());
            self.collections.save(storage, collection_id, &collection)?;

            return Ok(Response::new()
                .add_attribute("action", "collection_instantiated")
                .add_attribute("collection_id", collection_id.to_string())
                .add_attribute("collection_addr", deployed_addr));
        }

        Err(ContractError::UnknownReply { reply_id: msg_id })
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
pub struct WhitelistMinting {
    pub addresses: Vec<String>,
    pub unit_price: u64,
    pub limit_per_address: String,
    pub member_limit: u32,
    pub start_time: Timestamp,
    pub end_time: Timestamp,
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
    pub whitelist_mintings: Vec<WhitelistMinting>,

    // Royalty --------------------------
    pub royalty_address: Option<Addr>,
    pub royalty_percentage: Option<u8>,

    // Extend info --------------------------
    pub base_token_uri: Option<String>,
    pub merkle_root: Option<String>,
    pub deployed_address: Option<String>,
}

#[cw_serde]
pub enum CollectionState {
    Pending,  // When user summit the collection but not deployed yet
    Deployed, // When collection has been deployed
}

// This is subset of collection, contains only needed info for minting
#[cw_serde]
pub struct CollectionInfo {
    // Collection info ----------------------------
    pub name: String,
    pub symbol: String,

    // Minting details ----------------------------
    pub tokens_count: u32,
    pub unit_price: u64,
    pub limit_per_address: u32,
    pub start_time: Timestamp,

    // Whitelist minting --------------------------
    pub whitelist_mintings: Vec<WhitelistMinting>,

    // Royalty --------------------------
    pub royalty_address: Option<Addr>,
    pub royalty_percentage: Option<u8>,

    // Extend info --------------------------
    pub base_token_uri: Option<String>,
    pub merkle_root: Option<String>,
}
