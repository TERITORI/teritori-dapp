use std::vec;

use crate::error::ContractError;
use cosmwasm_std::{
    to_json_binary, Addr, Binary, CosmosMsg, Event, Reply, Response, StdResult, Storage, SubMsg,
    SubMsgResult,
};
use cw721::Cw721ExecuteMsg;
use cw_ownable::{Ownership, OwnershipError};
use cw_storage_plus::{Item, Map};
use sylvia::types::{ExecCtx, InstantiateCtx, QueryCtx, ReplyCtx};
use sylvia::{contract, entry_points};

pub struct NftsBurnerContract {
    pub(crate) ownership: Item<'static, Option<Addr>>,
    pub(crate) authorized_collections: Map<'static, Addr, ()>,
    pub(crate) burned_by_user: Map<'static, Addr, u32>,
    pub(crate) burned_total: Item<'static, u32>,
    pub(crate) burned_by_collection: Map<'static, Addr, u32>,
    pub(crate) burned_nfts: Map<'static, (Addr, String), ()>,
    pub(crate) burn_failed: Map<'static, (Addr, String), ()>,
}

const BURN_REPLY_ID: u64 = 1;

#[entry_points]
#[contract]
#[error(ContractError)]
impl NftsBurnerContract {
    pub const fn new() -> Self {
        Self {
            ownership: Item::new("ownership"),
            authorized_collections: Map::new("authorized_collections"),
            burned_by_user: Map::new("burned_by_user"),
            burned_total: Item::new("burned_total"),
            burned_by_collection: Map::new("burned_by_collection"),
            burned_nfts: Map::new("burned_nfts"),
            burn_failed: Map::new("burn_failed"),
        }
    }

    #[msg(instantiate)]
    pub fn instantiate(
        &self,
        ctx: InstantiateCtx,
        admin_addr: Option<String>,
        authorized_collections: Vec<String>,
    ) -> StdResult<Response> {
        let admin_addr = match admin_addr {
            Some(admin_addr) => Some(ctx.deps.api.addr_validate(admin_addr.as_str())?),
            None => None,
        };
        self.ownership.save(ctx.deps.storage, &admin_addr)?;
        for collection in authorized_collections {
            let collection_addr = ctx.deps.api.addr_validate(collection.as_str())?;
            self.authorized_collections
                .save(ctx.deps.storage, collection_addr, &())?;
        }
        self.burned_total.save(ctx.deps.storage, &0)?;
        Ok(Response::default())
    }

    // Mutations

    #[msg(exec)]
    pub fn receive_nft(
        &self,
        ctx: ExecCtx,
        sender: String,
        token_id: String,
        msg: Binary,
    ) -> Result<Response, ContractError> {
        let collection_addr = ctx.info.sender;
        let user_addr = ctx.deps.api.addr_validate(sender.as_str())?;
        self.authorized_collections
            .may_load(ctx.deps.storage, collection_addr.to_owned())?
            .ok_or(ContractError::UnauthorizedCollection)?;
        self.burned_nfts.update(
            ctx.deps.storage,
            (collection_addr.to_owned(), token_id.to_owned()),
            |v| match v {
                Some(_) => Err(ContractError::AlreadyBurned),
                None => Ok(()),
            },
        )?;
        self.burn_failed.save(
            ctx.deps.storage,
            (collection_addr.to_owned(), token_id.to_owned()),
            &(),
        )?;
        self.burned_by_user
            .update(ctx.deps.storage, user_addr, |v| {
                Ok::<u32, ContractError>(v.map(|v| v + 1).unwrap_or(1))
            })?;
        self.burned_by_collection
            .update(ctx.deps.storage, collection_addr.to_owned(), |v| {
                Ok::<u32, ContractError>(v.map(|v| v + 1).unwrap_or(1))
            })?;
        self.burned_total
            .update(ctx.deps.storage, |v| Ok::<u32, ContractError>(v + 1))?;
        Ok(Response::default().add_submessage(SubMsg::reply_always(
            CosmosMsg::Wasm(cosmwasm_std::WasmMsg::Execute {
                contract_addr: collection_addr.to_string(),
                msg: to_json_binary(&Cw721ExecuteMsg::Burn { token_id })?,
                funds: vec![],
            }),
            BURN_REPLY_ID,
        )))
    }

    #[msg(exec)]
    pub fn authorize_collections(
        &self,
        ctx: ExecCtx,
        collection_addrs: Vec<String>,
    ) -> Result<Response, ContractError> {
        self.assert_owner(ctx.deps.storage, &ctx.info.sender)?;
        for collection_addr in collection_addrs {
            let collection_addr = ctx.deps.api.addr_validate(collection_addr.as_str())?;
            self.authorized_collections
                .save(ctx.deps.storage, collection_addr, &())?;
        }
        Ok(Response::default())
    }

    #[msg(exec)]
    pub fn update_ownership(
        &self,
        ctx: ExecCtx,
        new_owner: Option<String>,
    ) -> Result<Response, ContractError> {
        self.assert_owner(ctx.deps.storage, &ctx.info.sender)?;
        let new_owner = match new_owner {
            Some(new_owner) => Some(ctx.deps.api.addr_validate(new_owner.as_str())?),
            None => None,
        };
        self.ownership.save(ctx.deps.storage, &new_owner)?;
        Ok(Response::default())
    }

    // Replies

    #[msg(reply)]
    pub fn reply(&self, ctx: ReplyCtx, reply: Reply) -> Result<Response, ContractError> {
        match reply.id {
            BURN_REPLY_ID => {
                match reply.result {
                    SubMsgResult::Ok(result) => {
                        let nft_contract_addr = ctx.deps.api.addr_validate(
                            get_events_values(&result.events, "wasm", "_contract_address")
                                .first()
                                .ok_or(ContractError::EventValueNotFound(
                                    "wasm".to_string(),
                                    "_contract_address".to_string(),
                                ))?,
                        )?;
                        let nft_token_id = get_events_values(&result.events, "wasm", "token_id")
                            .first()
                            .ok_or(ContractError::EventValueNotFound(
                                "wasm".to_string(),
                                "token_id".to_string(),
                            ))?
                            .to_owned();
                        let has = self.burn_failed.has(
                            ctx.deps.storage,
                            (nft_contract_addr.to_owned(), nft_token_id.to_owned()),
                        );
                        if !has {
                            return Err(ContractError::EntryNotFound);
                        }
                        self.burn_failed
                            .remove(ctx.deps.storage, (nft_contract_addr, nft_token_id));
                    }
                    SubMsgResult::Err(_) => {}
                }
                Ok(Response::default())
            }
            _ => Err(ContractError::UnknownReplyType(reply.id)),
        }
    }

    // Queries

    #[msg(query)]
    pub fn ownership(&self, ctx: QueryCtx) -> Result<Ownership<Addr>, ContractError> {
        let self_ownership = self.ownership.load(ctx.deps.storage)?;
        Ok(Ownership {
            owner: self_ownership,
            pending_owner: None,
            pending_expiry: None,
        })
    }

    #[msg(query)]
    pub fn burned_by_user(&self, ctx: QueryCtx, user_addr: String) -> Result<u32, ContractError> {
        let user_addr = ctx.deps.api.addr_validate(user_addr.as_str())?;
        Ok(self
            .burned_by_user
            .may_load(ctx.deps.storage, user_addr)?
            .unwrap_or(0))
    }

    #[msg(query)]
    pub fn burned_total(&self, ctx: QueryCtx) -> Result<u32, ContractError> {
        Ok(self.burned_total.may_load(ctx.deps.storage)?.unwrap_or(0))
    }

    #[msg(query)]
    pub fn burned_by_collection(
        &self,
        ctx: QueryCtx,
        collection_addr: String,
    ) -> Result<u32, ContractError> {
        let collection_addr = ctx.deps.api.addr_validate(collection_addr.as_str())?;
        Ok(self
            .burned_by_collection
            .may_load(ctx.deps.storage, collection_addr)?
            .unwrap_or(0))
    }

    #[msg(query)]
    pub fn authorized_collections(
        &self,
        ctx: QueryCtx,
        limit: u32,
        offset: u32,
    ) -> Result<Vec<Addr>, ContractError> {
        self.authorized_collections
            .range(ctx.deps.storage, None, None, cosmwasm_std::Order::Ascending)
            .map(|result| {
                let (k, _) = result?;
                Ok(k)
            })
            .skip(offset as usize)
            .take(limit as usize)
            .collect()
    }

    #[msg(query)]
    pub fn burned_nfts(
        &self,
        ctx: QueryCtx,
        collection_addr: Option<String>,
        limit: u32,
        offset: u32,
    ) -> Result<Vec<(Addr, String)>, ContractError> {
        match collection_addr {
            Some(collection_addr) => {
                let collection_addr = ctx.deps.api.addr_validate(collection_addr.as_str())?;
                return self
                    .burned_nfts
                    .prefix(collection_addr.to_owned())
                    .range(ctx.deps.storage, None, None, cosmwasm_std::Order::Ascending)
                    .skip(offset as usize)
                    .take(limit as usize)
                    .map(|result| {
                        let (token_id, _) = result?;
                        Ok((collection_addr.to_owned(), token_id))
                    })
                    .collect();
            }
            None => {
                return self
                    .burned_nfts
                    .range(ctx.deps.storage, None, None, cosmwasm_std::Order::Ascending)
                    .skip(offset as usize)
                    .take(limit as usize)
                    .map(|result| {
                        let ((collection_addr, token_id), _) = result?;
                        Ok((collection_addr, token_id))
                    })
                    .collect();
            }
        };
    }

    // Helper

    fn assert_owner(&self, storage: &dyn Storage, sender: &Addr) -> Result<(), OwnershipError> {
        let ownership = self.ownership.load(storage)?;
        match ownership {
            Some(owner) => {
                if owner == *sender {
                    Ok(())
                } else {
                    Err(cw_ownable::OwnershipError::NotOwner)
                }
            }
            _ => Err(cw_ownable::OwnershipError::NoOwner),
        }
    }
}

fn get_events_values(ev: &Vec<Event>, ty: &str, key: &str) -> Vec<String> {
    ev.iter()
        .filter(|v| v.ty == ty)
        .map(|v| {
            v.attributes
                .iter()
                .find(|vv| vv.key == key)
                .map(|vv| vv.value.clone())
        })
        .filter_map(|v| v)
        .collect()
}
