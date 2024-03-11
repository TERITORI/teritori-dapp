use cosmwasm_schema::cw_serde;
use cosmwasm_std::{from_json, Addr, Deps, Empty, Env, Response, StdResult};
use cw2981_royalties::{msg::Cw2981QueryMsg, query, Extension};
use cw721::{
    AllNftInfoResponse, ApprovalResponse, ApprovalsResponse, ContractInfoResponse, NftInfoResponse,
    NumTokensResponse, OperatorResponse, OperatorsResponse, OwnerOfResponse, TokensResponse,
};
use cw_storage_plus::{IndexedMap, Item, MultiIndex};
use serde::de::DeserializeOwned;
use sylvia::{
    contract, entry_points,
    types::{ExecCtx, InstantiateCtx, QueryCtx},
};

use crate::error::ContractError;

use cw721_base::{
    msg::InstantiateMsg as Tr721InstantiateMsg,
    state::{token_owner_idx, TokenIndexes, TokenInfo},
    Cw721Contract, MinterResponse, Ownership,
};

pub type Tr721Contract<'a> = Cw721Contract<'a, Extension, Empty, Empty, Cw2981QueryMsg>;
pub type Tr721ExecuteMsg = cw721_base::ExecuteMsg<Extension, Empty>;
pub type Tr721QueryMsg = cw721_base::QueryMsg<Cw2981QueryMsg>;

const INSTANTIATE_REPLY_ID: u64 = 1u64;

// Version info for migration
const CONTRACT_NAME: &str = "crates.io:tr721";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

// Contract states ------------------------------------------------------
pub struct Tr721 {
    pub(crate) ownership: Item<'static, Ownership<Addr>>, // nft launchpad owner/minter

    pub(crate) contract_info: Item<'static, ContractInfoResponse>,
    // pub(crate) token_count: Item<'static, u64>,
    // /// Stored as (granter, operator) giving operator full control over granter's account
    // pub(crate) operators: Map<'static, (&'static Addr, &'static Addr), Expiration>,
    pub(crate) tokens:
        IndexedMap<'static, &'static str, TokenInfo<Extension>, TokenIndexes<'static, Extension>>,
}

// Contract implement -----------------------------------------------------
#[entry_points]
#[contract]
#[error(ContractError)]
impl Tr721 {
    // Init states
    pub const fn new() -> Self {
        let indexes = TokenIndexes {
            owner: MultiIndex::new(token_owner_idx, "tokens", "tokens__owner"),
        };

        Self {
            ownership: Item::new("ownership"),
            contract_info: Item::new("nft_info"),
            tokens: IndexedMap::new("tokens", indexes),
        }
    }

    fn proxy_query<T: DeserializeOwned>(&self, ctx: QueryCtx, msg: Tr721QueryMsg) -> StdResult<T> {
        let bin = Tr721Contract::default()
            .query(ctx.deps, ctx.env, msg)
            .unwrap();
        let resp = from_json::<T>(bin).unwrap();
        Ok(resp)
    }

    #[msg(instantiate)]
    pub fn instantiate(
        &self,
        ctx: InstantiateCtx,
        msg: Tr721InstantiateMsg,
    ) -> StdResult<Response> {
        cw2::set_contract_version(ctx.deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
        Ok(Tr721Contract::default().instantiate(ctx.deps, ctx.env, ctx.info, msg)?)
    }

    #[msg(exec)]
    pub fn mint(
        &self,
        ctx: ExecCtx,
        token_id: String,
        owner: String,
        token_uri: Option<String>,
        extension: Extension,
    ) -> Result<Response, ContractError> {
        let resp = Tr721Contract::default()
            .mint(ctx.deps, ctx.info, token_id, owner, token_uri, extension)
            .unwrap();
        Ok(resp)
    }

    #[msg(query)]
    pub fn minter(&self, ctx: QueryCtx) -> StdResult<MinterResponse> {
        let msg = Tr721QueryMsg::Minter {};
        self.proxy_query::<MinterResponse>(ctx, msg)
    }

    #[msg(query)]
    pub fn contract_info(&self, ctx: QueryCtx) -> StdResult<ContractInfoResponse> {
        let msg = Tr721QueryMsg::ContractInfo {};
        self.proxy_query::<ContractInfoResponse>(ctx, msg)
    }

    #[msg(query)]
    pub fn nft_info(
        &self,
        ctx: QueryCtx,
        token_id: String,
    ) -> StdResult<NftInfoResponse<Extension>> {
        let msg = Tr721QueryMsg::NftInfo { token_id };
        self.proxy_query::<NftInfoResponse<Extension>>(ctx, msg)
    }

    #[msg(query)]
    pub fn owner_of(
        &self,
        ctx: QueryCtx,
        token_id: String,
        include_expired: Option<bool>,
    ) -> StdResult<OwnerOfResponse> {
        let msg = Tr721QueryMsg::OwnerOf {
            token_id,
            include_expired,
        };
        self.proxy_query::<OwnerOfResponse>(ctx, msg)
    }

    #[msg(query)]
    pub fn all_nft_info(
        &self,
        ctx: QueryCtx,
        token_id: String,
        include_expired: Option<bool>,
    ) -> StdResult<AllNftInfoResponse<Extension>> {
        let msg = Tr721QueryMsg::AllNftInfo {
            token_id,
            include_expired,
        };
        self.proxy_query::<AllNftInfoResponse<Extension>>(ctx, msg)
    }

    #[msg(query)]
    pub fn operator(
        &self,
        ctx: QueryCtx,
        owner: String,
        operator: String,
        include_expired: Option<bool>,
    ) -> StdResult<OperatorResponse> {
        let msg = Tr721QueryMsg::Operator {
            owner,
            operator,
            include_expired,
        };
        self.proxy_query::<OperatorResponse>(ctx, msg)
    }

    #[msg(query)]
    pub fn all_operators(
        &self,
        ctx: QueryCtx,
        owner: String,
        include_expired: Option<bool>,
        start_after: Option<String>,
        limit: Option<u32>,
    ) -> StdResult<OperatorsResponse> {
        let msg = Tr721QueryMsg::AllOperators {
            owner,
            include_expired,
            start_after,
            limit,
        };
        self.proxy_query::<OperatorsResponse>(ctx, msg)
    }

    #[msg(query)]
    pub fn num_tokens(&self, ctx: QueryCtx) -> StdResult<NumTokensResponse> {
        let msg = Tr721QueryMsg::NumTokens {};
        self.proxy_query::<NumTokensResponse>(ctx, msg)
    }

    #[msg(query)]
    pub fn tokens(
        &self,
        ctx: QueryCtx,
        owner: String,
        start_after: Option<String>,
        limit: Option<u32>,
    ) -> StdResult<TokensResponse> {
        let msg = Tr721QueryMsg::Tokens {
            owner,
            start_after,
            limit,
        };
        self.proxy_query::<TokensResponse>(ctx, msg)
    }

    #[msg(query)]
    pub fn all_tokens(
        &self,
        ctx: QueryCtx,
        start_after: Option<String>,
        limit: Option<u32>,
    ) -> StdResult<TokensResponse> {
        let msg = Tr721QueryMsg::AllTokens { start_after, limit };
        self.proxy_query::<TokensResponse>(ctx, msg)
    }

    #[msg(query)]
    pub fn approval(
        &self,
        ctx: QueryCtx,
        token_id: String,
        spender: String,
        include_expired: Option<bool>,
    ) -> StdResult<ApprovalResponse> {
        let msg = Tr721QueryMsg::Approval {
            token_id,
            spender,
            include_expired,
        };
        self.proxy_query::<ApprovalResponse>(ctx, msg)
    }

    #[msg(query)]
    pub fn approvals(
        &self,
        ctx: QueryCtx,
        token_id: String,
        include_expired: Option<bool>,
    ) -> StdResult<ApprovalsResponse> {
        let msg = Tr721QueryMsg::Approvals {
            token_id,
            include_expired,
        };
        self.proxy_query::<ApprovalsResponse>(ctx, msg)
    }

    #[msg(query)]
    pub fn ownership(&self, ctx: QueryCtx) -> StdResult<Ownership<Addr>> {
        let msg = Tr721QueryMsg::Ownership {};
        self.proxy_query::<Ownership<Addr>>(ctx, msg)
    }

    #[msg(query)]
    pub fn extension(&self, _ctx: QueryCtx) -> StdResult<Response> {
        Ok(Response::new())
    }
}

// Types definitions ------------------------------------------------------
#[cw_serde]
pub struct Config {
    pub name: String,
    pub nft_code_id: Option<u64>,
    pub supported_networks: Vec<String>,
}
