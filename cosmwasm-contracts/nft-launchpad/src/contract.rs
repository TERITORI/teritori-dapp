use cosmwasm_schema::cw_serde;
use cosmwasm_std::{
    entry_point, instantiate2_address, to_json_binary, Addr, Binary, CodeInfoResponse, DepsMut,
    Empty, Env, Order, Reply, Response, StdResult, SubMsg, Timestamp, WasmMsg,
};
use cw_storage_plus::{Item, Map};
use cw_utils::parse_reply_instantiate_data;
use sylvia::{
    contract, entry_points,
    types::{ExecCtx, InstantiateCtx, QueryCtx},
};

use crate::error::ContractError;
use cw721_base::msg::InstantiateMsg as NftInstantiateMsg;

const INSTANTIATE_REPLY_ID: u64 = 1u64;

// Contract states ------------------------------------------------------
pub struct NftLaunchpad {
    pub(crate) config: Item<'static, Config>, // nft launchpad config
    pub(crate) collections: Map<'static, u64, Collection>, // collection id => collection info

    pub(crate) deployed_collections: Map<'static, String, u64>, // collection address => collection id
    pub(crate) submitted_collections: Map<'static, u64, Empty>, // collection id
    pub(crate) completed_collections: Map<'static, u64, Empty>, // collection id
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
            deployed_collections: Map::new("deployed_collections"),
            submitted_collections: Map::new("submitted_collections"),
            completed_collections: Map::new("completed_collections"),
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
        mut collection: Collection,
    ) -> Result<Response, ContractError> {
        let storage = ctx.deps.storage;

        // Increase collection id by 1
        let last_collection = self.collections.last(storage).unwrap();
        let new_id: u64 = match last_collection {
            Some(item) => item.0 + 1,
            None => 1,
        };

        collection.state = Some(CollectionState::Submitted);

        self.collections.save(storage, new_id, &collection)?;
        self.submitted_collections
            .save(storage, new_id, &Empty {})?;

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

        // Only allow to update merke root before deployed
        let mut collection = self
            .collections
            .load(storage, collection_id)
            .map_err(|_| ContractError::CollectionNotFound)?;

        if collection.state == Some(CollectionState::Deployed) {
            return Err(ContractError::Forbidden);
        }

        // If merkle root was empty then update state to completed
        if collection.merkle_root == None {
            self.submitted_collections.remove(storage, collection_id);
            self.completed_collections
                .save(storage, collection_id, &Empty {})?;
        }

        // Update merkle root to collection
        collection.merkle_root = Some(merkle_root.clone());
        collection.state = Some(CollectionState::Completed);

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
        // Only allow to deploy completed collection
        let mut collection = self
            .collections
            .load(ctx.deps.storage, collection_id)
            .map_err(|_| ContractError::CollectionNotFound)?;

        // Check nft code id
        let config = self.config.load(ctx.deps.storage)?;
        let sender = ctx.info.sender.to_string();
        let nft_code_id = config.nft_code_id.unwrap_or(0);

        if nft_code_id == 0 {
            return Err(ContractError::NftCodeIdMissing);
        }

        // Check collection state
        if collection.state != Some(CollectionState::Completed) {
            return Err(ContractError::Forbidden);
        }

        // Instantiate Nft contract using Instantiate2
        // let creator = ctx
        //     .deps
        //     .api
        //     .addr_canonicalize(ctx.env.contract.address.as_str())?;
        // let CodeInfoResponse { checksum, .. } =
        //     ctx.deps.querier.query_wasm_code_info(nft_code_id)?;

        // // Create salt from collection id
        // let salt = Binary::from(format!("collection-{collection_id}").as_bytes());

        // let instantiate2_addr = instantiate2_address(&checksum, &creator, &salt)?;
        // let addr = ctx.deps.api.addr_humanize(&instantiate2_addr)?;

        // QUESTION: How to ensure that NFT contract has been well deployed ?
        let instantiate_msg = WasmMsg::Instantiate {
            admin: Some(sender.clone()),
            code_id: nft_code_id,
            msg: to_json_binary(&NftInstantiateMsg {
                name: collection.name.clone(),
                symbol: collection.symbol.clone(),
                minter: sender,
            })?,
            funds: vec![],
            label: format!("TR721-{} {}", nft_code_id, collection.symbol),
        };

        // Update collection states
        // self.deployed_collections
        //     .save(ctx.deps.storage, addr.to_string(), &collection_id)?;
        // self.completed_collections
        //     .remove(ctx.deps.storage, collection_id);

        // collection.state = Some(CollectionState::Deployed);
        // self.collections
        //     .save(ctx.deps.storage, collection_id, &collection)?;

        let submessage = SubMsg::reply_on_success(instantiate_msg, INSTANTIATE_REPLY_ID);

        Ok(Response::new()
            .add_submessage(submessage)
            .add_attribute("action", "collection_deployed"))
    }

    #[msg(query)]
    pub fn get_collection_by_id(&self, ctx: QueryCtx, collection_id: u64) -> StdResult<Collection> {
        let collection = self.collections.load(ctx.deps.storage, collection_id)?;
        Ok(collection)
    }

    #[msg(query)]
    pub fn get_collection_by_addr(
        &self,
        ctx: QueryCtx,
        collection_addr: String,
    ) -> StdResult<Collection> {
        let deployed_collection_id = self
            .deployed_collections
            .load(ctx.deps.storage, collection_addr)?;

        let collection = self
            .collections
            .load(ctx.deps.storage, deployed_collection_id)?;

        Ok(collection)
    }

    #[msg(query)]
    pub fn get_summited_collections(&self, ctx: QueryCtx) -> StdResult<Vec<u64>> {
        // NOTE: The pending collections should not be too many so it might be ok to iter map here ?
        let summited_collections: Vec<u64> = self
            .submitted_collections
            .keys(ctx.deps.storage, None, None, Order::Ascending)
            .map(|item| item.unwrap())
            .collect();

        Ok(summited_collections)
    }

    #[msg(query)]
    pub fn get_config(&self, ctx: QueryCtx) -> StdResult<Config> {
        let config = self.config.load(ctx.deps.storage)?;
        Ok(config)
    }

    // Reply ---------------------------------------------------------------
    fn reply(&self, deps: DepsMut, env: Env, reply: Reply) -> Result<Response, ContractError> {
        match reply.id {
            INSTANTIATE_REPLY_ID => handle_instantiate_reply(&self, deps, env, reply),
            reply_id => Err(ContractError::UnknownReply { reply_id }),
        }
    }
}

#[entry_point]
pub fn reply(deps: DepsMut, env: Env, reply: Reply) -> Result<Response, ContractError> {
    NftLaunchpad::new().reply(deps, env, reply)
}

fn handle_instantiate_reply(
    _instance: &NftLaunchpad,
    _deps: DepsMut,
    _env: Env,
    reply: Reply,
) -> Result<Response, ContractError> {
    let _res = parse_reply_instantiate_data(reply)?;

    Ok(Response::new())
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
    pub merkle_root: Option<String>,
    pub state: Option<CollectionState>,
}
#[cw_serde]
pub enum CollectionState {
    Submitted, // When user summit the collection but missing merkle root
    Completed, // When user fulfil all needed info (including merkle root)
    Deployed,  // When collection has been deployed
}
