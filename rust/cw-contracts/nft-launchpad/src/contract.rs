use cosmwasm_schema::cw_serde;
use cosmwasm_std::{
    attr, to_json_binary, Addr, Reply, Response, StdResult, SubMsg, SubMsgResult, WasmMsg,
};
use cw_storage_plus::{Item, Map};
use cw_utils::parse_reply_instantiate_data;
use sylvia::{
    contract, entry_points,
    types::{ExecCtx, InstantiateCtx, QueryCtx, ReplyCtx},
};

use crate::{error::ContractError, utils::get_events_values};
use nft_tr721::{
    contract::sv::InstantiateMsg as Tr721InstantiateMsg,
    contract::{MintInfo as Tr721MintInfo, MintPeriod as Tr721MintPeriod},
};

use dao_proposal_single::msg::ExecuteMsg as DaoExecuteMsg;
use dao_voting::proposal::SingleChoiceProposeMsg;

const INSTANTIATE_REPLY_ID: u64 = 1u64;
const EXECUTE_REPLY_ID: u64 = 2u64;

#[derive(serde::Serialize)]
pub enum ExecuteMsg {
    DeployCollection { collection_id: String },
}

// Contract states ------------------------------------------------------
pub struct NftLaunchpad {
    pub(crate) config: Item<'static, Config>, // nft launchpad config
    pub(crate) collections: Map<'static, String, CollectionProject>, // collection id => collection info
    pub(crate) instantiating_collection_id: Item<'static, String>,
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
    // Only owner can execute it.
    pub fn update_config(
        &self,
        ctx: ExecCtx,
        changes: ConfigChanges,
    ) -> Result<Response, ContractError> {
        let mut config = self.config.load(ctx.deps.storage)?;
        let mut attributes = vec![attr("action", "update_config")];

        // Permission check
        if ctx.info.sender != config.owner {
            return Err(ContractError::Unauthorized);
        }

        // Save new config
        if let Some(name) = changes.name {
            config.name = name.clone();
            attributes.push(attr("new_name", name.to_string()))
        }
        if let Some(nft_code_id) = changes.nft_code_id {
            config.nft_code_id = nft_code_id;
            attributes.push(attr("new_nft_code_id", nft_code_id.to_string()))
        }
        if let Some(admin) = &changes.admin {
            config.admin = ctx.deps.api.addr_validate(&admin)?;
            attributes.push(attr("new_admin", admin))
        }
        if let Some(owner) = changes.owner {
            config.owner = ctx.deps.api.addr_validate(&owner)?;
            attributes.push(attr("new_owner", owner))
        }
        if let Some(proposal_single_contract) = changes.proposal_single_contract {
            config.proposal_single_contract =
                ctx.deps.api.addr_validate(&proposal_single_contract)?;
            attributes.push(attr("new_name", proposal_single_contract.to_string()))
        }
        self.config.save(ctx.deps.storage, &config)?;

        Ok(Response::new().add_attributes(attributes))
    }

    #[msg(exec)]
    pub fn submit_collection(
        &self,
        ctx: ExecCtx,
        collection: CollectionProject,
    ) -> Result<Response, ContractError> {
        let storage = ctx.deps.storage;

        // Check if collection symbol is alphanumeric
        if !collection
            .to_owned()
            .symbol
            .chars()
            .all(|char| char.is_numeric() || char.is_uppercase())
        {
            return Err(ContractError::CollectionSymbolInvalid);
        }

        // Check if collection have at least 1 mint period
        if collection.mint_periods.len() == 0 {
            return Err(ContractError::MintPeriodRequired);
        }

        // Check if collection symbol exists
        let symbol_exist = self.collections.has(storage, collection.symbol.to_owned());
        if symbol_exist {
            return Err(ContractError::CollectionSymbolExists);
        }

        let collection_id = collection.to_owned().symbol;

        let sender = ctx.info.sender.to_string();

        let mut collection_with_owner = collection.clone();
        collection_with_owner.owner = Some(sender.to_owned());

        // Add new collection
        self.collections
            .save(storage, collection_id.to_owned(), &collection_with_owner)?;

        Ok(Response::new()
            .add_attribute("action", "submit_collection")
            .add_attribute("collection_id", collection_id)
            .add_attribute("owner", sender))
    }

    #[msg(exec)]
    pub fn update_merkle_root(
        &self,
        ctx: ExecCtx,
        collection_id: String,
        merkle_root: String,
    ) -> Result<Response, ContractError> {
        let storage = ctx.deps.storage;
        let config = self.config.load(storage)?;
        let proposal_single_contract = config.proposal_single_contract;

        let mut collection = self
            .collections
            .load(storage, collection_id.to_owned())
            .map_err(|_| ContractError::CollectionNotFound)?;

        let sender = ctx.info.sender.to_string();
        if sender != collection.owner.clone().unwrap() {
            return Err(ContractError::WrongCollectionOwner);
        }

        // Do not allow to update merke root if the collection has been deployed already
        if collection.deployed_address.is_some() {
            return Err(ContractError::AlreadyDeployed);
        }

        // Update merkle root
        collection.metadatas_merkle_root = Some(merkle_root.clone());

        // Update collection
        self.collections
            .save(storage, collection_id.clone(), &collection)?;

        // Create the deploy_collection proposal message
        let deploy_collection_msg = cosmwasm_std::CosmosMsg::Wasm(WasmMsg::Execute {
            contract_addr: ctx.env.contract.address.to_string(),
            msg: to_json_binary(&ExecuteMsg::DeployCollection {
                collection_id: collection_id.clone(),
            })?,
            funds: vec![],
        });
        let single_choice_propose_msg = SingleChoiceProposeMsg {
            title: format!("Propose to deploy collection {}", collection_id),
            description: format!(
                "Requesting approval to deploy the collection {} with ID {}",
                collection.name, collection_id
            ),
            msgs: vec![deploy_collection_msg],
            proposer: None,
            vote: None,
        };
        let propose_execute_msg = WasmMsg::Execute {
            contract_addr: proposal_single_contract.to_string(),
            msg: to_json_binary(&DaoExecuteMsg::Propose(single_choice_propose_msg))?,
            funds: vec![],
        };

        let submessage = SubMsg::reply_on_success(propose_execute_msg, EXECUTE_REPLY_ID);

        Ok(Response::new()
            .add_submessage(submessage)
            .add_attribute("action", "update_merkle_root")
            .add_attribute("merkle_root", merkle_root))
    }

    #[msg(exec)]
    pub fn deploy_collection(
        &self,
        ctx: ExecCtx,
        collection_id: String,
    ) -> Result<Response, ContractError> {
        let sender = ctx.info.sender.to_string();
        let config = self.config.load(ctx.deps.storage)?;

        // Only allow launchpad_admin to deploy
        if sender != config.admin {
            return Err(ContractError::WrongDeployer);
        }

        let collection = self
            .collections
            .load(ctx.deps.storage, collection_id.to_owned())
            .map_err(|_| ContractError::CollectionNotFound)?;

        // Do not allow to deploy collection if merkle root is not set
        if collection.metadatas_merkle_root.is_none() {
            return Err(ContractError::MerkleRootMissing);
        }

        let nft_code_id = config.nft_code_id;

        // NOTE: cannot use wasm_instantiate because we need to specify admin
        let instantiate_msg = WasmMsg::Instantiate {
            admin: Some(sender.clone()),
            code_id: nft_code_id,
            msg: to_json_binary(&Tr721InstantiateMsg {
                admin: sender.clone(),
                name: collection.name.clone(),
                symbol: collection.symbol.clone(),
                minter: sender,
                launchpad_contract: "launchpad_contract".to_string(),
                mint_info: Tr721MintInfo {
                    metadatas_merkle_root: collection.metadatas_merkle_root.unwrap(),
                    tokens_count: collection.tokens_count,
                    royalty_address: collection.royalty_address,
                    royalty_percentage: collection.royalty_percentage,
                },
                mint_periods: collection.mint_periods,
            })?,
            funds: vec![],
            label: format!(
                "TR721 codeId:{} collectionId:{} symbol:{}",
                nft_code_id, collection_id, collection.symbol
            ),
        };

        // Update instantiating collection id
        self.instantiating_collection_id
            .save(ctx.deps.storage, &collection_id)?;

        let submessage = SubMsg::reply_on_success(instantiate_msg, INSTANTIATE_REPLY_ID);

        Ok(Response::new()
            .add_submessage(submessage)
            .add_attribute("action", "deploy_collection")
            .add_attribute("collection_id", collection_id))
    }

    #[msg(query)]
    pub fn get_collection_by_id(
        &self,
        ctx: QueryCtx,
        collection_id: String,
    ) -> StdResult<CollectionProject> {
        let collection = self.collections.load(ctx.deps.storage, collection_id)?;
        Ok(collection)
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

        // dao single execute (propose) submessage
        if msg_id == EXECUTE_REPLY_ID {
            if let SubMsgResult::Ok(resp) = msg.result {
                // Get proposal id from dao-proposal-single execute_propose response attributes
                let proposal_id = get_events_values(&resp.events, "wasm", "proposal_id")
                    .first()
                    .ok_or(ContractError::EventValueNotFound(
                        "wasm".to_string(),
                        "proposal_id".to_string(),
                    ))?
                    .to_owned();

                return Ok(Response::new()
                    .add_attribute("action", "execute_propose")
                    .add_attribute("proposal_id", proposal_id));
                // About these attributes, we could just get the ones from dao-proposal-single execute_propose,
                // but it's better to emit ourselves and so centralise proposal_id handling here
            }
            return Err(ContractError::NoResultInReply);
        }

        // tr271 instantiate submessage
        if msg_id == INSTANTIATE_REPLY_ID {
            let parse_reply_result = parse_reply_instantiate_data(msg);
            match parse_reply_result {
                Ok(parse_reply_data) => {
                    let deployed_addr = parse_reply_data.contract_address;
                    // Get instantiating collection id
                    let collection_id = self.instantiating_collection_id.load(storage)?;
                    // Update collection states
                    let mut collection =
                        self.collections.load(storage, collection_id.to_owned())?;
                    collection.deployed_address = Some(deployed_addr.clone());
                    self.collections
                        .save(storage, collection_id.to_owned(), &collection)?;

                    return Ok(Response::new()
                        .add_attribute("action", "instantiate_collection")
                        .add_attribute("collection_addr", deployed_addr));
                }
                Err(parse_reply_error) => {
                    return Err(ContractError::ParseReplyError(parse_reply_error.into()))
                }
            }
        }

        Err(ContractError::UnknownReply { reply_id: msg_id })
    }
}

// Types definitions ------------------------------------------------------
#[cw_serde]
pub struct Config {
    pub name: String,
    pub nft_code_id: u64,
    pub admin: Addr,
    pub owner: Addr,
    pub proposal_single_contract: Addr,
}

#[cw_serde]
pub struct ConfigChanges {
    pub name: Option<String>,
    pub nft_code_id: Option<u64>,
    pub admin: Option<String>,
    pub owner: Option<String>,
    pub proposal_single_contract: Option<String>,
}

#[cw_serde]
#[derive(Default)]
pub struct CollectionProject {
    // Info ----------------------------
    pub name: String,
    pub desc: String,
    pub symbol: String, // Unique
    pub cover_img_uri: String,
    pub target_network: String,
    // Details ----------------------------
    pub website_link: Option<String>,
    pub contact_email: Option<String>,
    pub project_type: Option<String>,
    pub artwork_desc: Option<String>,
    // Team info --------------------------------------
    pub team_desc: Option<String>,
    pub partners: Option<String>,
    pub investment_desc: Option<String>,
    pub investment_link: Option<String>,
    // Minting details ----------------------------
    pub reveal_time: Option<u64>,
    pub tokens_count: u64,
    // Mint periods --------------------------
    pub mint_periods: Vec<Tr721MintPeriod>,
    // Royalty --------------------------
    pub royalty_address: Option<Addr>,
    pub royalty_percentage: Option<u8>,
    // Extend info --------------------------
    pub base_token_uri: Option<String>,
    pub metadatas_merkle_root: Option<String>,
    pub deployed_address: Option<String>,
    pub owner: Option<String>,
}
