use cosmwasm_schema::cw_serde;
use cosmwasm_std::{from_json, Addr, Binary, Response, StdResult, Uint128};
use cw2981_royalties::{
    check_royalties, msg::{CheckRoyaltiesResponse, Cw2981QueryMsg, RoyaltiesInfoResponse}, query_royalties_info, Cw2981Contract as Tr721Contract, ExecuteMsg as Tr721ExecuteMsg, Extension
};
use cw721::{
    AllNftInfoResponse, ApprovalResponse, ApprovalsResponse, ContractInfoResponse, Expiration,
    NftInfoResponse, NumTokensResponse, OperatorResponse, OperatorsResponse, OwnerOfResponse,
    TokensResponse,
};
use serde::de::DeserializeOwned;
use sylvia::{
    contract, entry_points,
    types::{ExecCtx, InstantiateCtx, QueryCtx},
};

use crate::error::ContractError;

use cw721_base::{msg::InstantiateMsg as Tr721InstantiateMsg, MinterResponse, Ownership};

pub type Tr721QueryMsg = cw721_base::QueryMsg<Cw2981QueryMsg>;

// Version info for migration
const CONTRACT_NAME: &str = "crates.io:nft-tr721";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

// Contract states ------------------------------------------------------
pub struct Tr721 {}

// Contract implement -----------------------------------------------------
#[entry_points]
#[contract]
#[error(ContractError)]
impl Tr721 {
    // Init states
    pub const fn new() -> Self {
        Self {}
    }

    fn proxy_query<T: DeserializeOwned>(&self, ctx: QueryCtx, msg: Tr721QueryMsg) -> StdResult<T> {
        let bin = Tr721Contract::default()
            .query(ctx.deps, ctx.env, msg)
            .unwrap();
        let resp = from_json::<T>(bin).unwrap();
        Ok(resp)
    }

    fn proxy_exec(&self, ctx: ExecCtx, msg: Tr721ExecuteMsg) -> Result<Response, ContractError> {
        let resp = Tr721Contract::default()
            .execute(ctx.deps, ctx.env, ctx.info, msg)
            .unwrap();
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
    pub fn transfer_nft(
        &self,
        ctx: ExecCtx,
        recipient: String,
        token_id: String,
    ) -> Result<Response, ContractError> {
        let msg = Tr721ExecuteMsg::TransferNft {
            recipient,
            token_id,
        };
        self.proxy_exec(ctx, msg)
    }

    #[msg(exec)]
    pub fn send_nft(
        &self,
        ctx: ExecCtx,
        contract: String,
        token_id: String,
        msg: Binary,
    ) -> Result<Response, ContractError> {
        let msg = Tr721ExecuteMsg::SendNft {
            contract,
            token_id,
            msg,
        };
        self.proxy_exec(ctx, msg)
    }

    #[msg(exec)]
    pub fn approve(
        &self,
        ctx: ExecCtx,
        spender: String,
        token_id: String,
        expires: Option<Expiration>,
    ) -> Result<Response, ContractError> {
        let msg = Tr721ExecuteMsg::Approve {
            spender,
            token_id,
            expires,
        };
        self.proxy_exec(ctx, msg)
    }

    #[msg(exec)]
    pub fn approve_all(
        &self,
        ctx: ExecCtx,
        operator: String,
        expires: Option<Expiration>,
    ) -> Result<Response, ContractError> {
        let msg = Tr721ExecuteMsg::ApproveAll { operator, expires };
        self.proxy_exec(ctx, msg)
    }

    #[msg(exec)]
    pub fn revoke(
        &self,
        ctx: ExecCtx,
        spender: String,
        token_id: String,
    ) -> Result<Response, ContractError> {
        let msg = Tr721ExecuteMsg::Revoke { spender, token_id };
        self.proxy_exec(ctx, msg)
    }

    #[msg(exec)]
    pub fn revoke_all(&self, ctx: ExecCtx, operator: String) -> Result<Response, ContractError> {
        let msg = Tr721ExecuteMsg::RevokeAll { operator };
        self.proxy_exec(ctx, msg)
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
        // validate royalty_percentage to be between 0 and 100
        // no need to check < 0 because royalty_percentage is u64
        if extension.to_owned().is_some() {
            let metadata = extension.to_owned().unwrap();
            if metadata.royalty_percentage.is_some() {
                if metadata.royalty_percentage.unwrap() > 100 {
                    return Err(ContractError::InvalidRoyaltyPercentage);
                }
            }
        }

        let msg = Tr721ExecuteMsg::Mint {
            token_id,
            owner,
            token_uri,
            extension,
        };
        self.proxy_exec(ctx, msg)
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

    #[msg(query)]
    pub fn royalty_info(
        &self,
        ctx: QueryCtx,
        token_id: String,
        sale_price: Uint128,
    ) -> StdResult<RoyaltiesInfoResponse> {
        let resp = query_royalties_info(ctx.deps, token_id, sale_price).unwrap();
        Ok(resp)
    }

    #[msg(query)]
    pub fn check_royalties(&self, ctx: QueryCtx) -> StdResult<CheckRoyaltiesResponse> {
        let resp = check_royalties(ctx.deps).unwrap();
        Ok(resp)
    }
}

// Types definitions ------------------------------------------------------
#[cw_serde]
pub struct Config {
    pub name: String,
    pub nft_code_id: Option<u64>,
    pub supported_networks: Vec<String>,
}
