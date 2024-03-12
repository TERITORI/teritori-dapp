use cosmwasm_schema::cw_serde;
use cosmwasm_std::{from_json, to_json_vec, Addr, Binary, HexBinary, Response, StdResult, Uint128};
use cw2981_royalties::{
    check_royalties,
    msg::{CheckRoyaltiesResponse, Cw2981QueryMsg, RoyaltiesInfoResponse},
    query_royalties_info, Cw2981Contract as Tr721Contract, ExecuteMsg as Tr721ExecuteMsg,
    Extension, Metadata,
};
use cw721::{
    AllNftInfoResponse, ApprovalResponse, ApprovalsResponse, ContractInfoResponse, Expiration,
    NftInfoResponse, NumTokensResponse, OperatorResponse, OperatorsResponse, OwnerOfResponse,
    TokensResponse,
};
use cw_storage_plus::{IndexedMap, Item, Map, MultiIndex};
use rs_merkle::{algorithms::Sha256, Hasher, MerkleProof};
use serde::de::DeserializeOwned;
use sylvia::{
    contract, entry_points,
    types::{ExecCtx, InstantiateCtx, QueryCtx},
};

use crate::error::ContractError;

use cw721_base::{
    msg::InstantiateMsg as BaseInstantiateMsg,
    state::{token_owner_idx, TokenIndexes, TokenInfo},
    MinterResponse, Ownership,
};

pub type Tr721QueryMsg = cw721_base::QueryMsg<Cw2981QueryMsg>;

// Version info for migration
const CONTRACT_NAME: &str = env!("CARGO_PKG_NAME");
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

// Contract states ------------------------------------------------------
pub struct Tr721 {
    pub(crate) contract_version: Item<'static, ContractVersion>,
    pub(crate) tokens:
        IndexedMap<'static, &'static str, TokenInfo<Metadata>, TokenIndexes<'static, Metadata>>,
    pub(crate) requested_mints: Map<'static, String, Addr>, //  token id => User address
    pub(crate) config: Item<'static, Config>,
}

// Contract implement -----------------------------------------------------
#[entry_points]
#[contract]
#[error(ContractError)]
impl Tr721 {
    // Init states
    pub const fn new() -> Self {
        // The storage keys must not be changed, they link with Cw721 states
        let indexes = TokenIndexes {
            owner: MultiIndex::new(token_owner_idx, "tokens", "tokens__owner"),
        };

        Self {
            // The storage keys must not be changed, they link with Cw721 states
            contract_version: Item::new("contract_info"),
            tokens: IndexedMap::new("tokens", indexes),

            // Custom states
            requested_mints: Map::new("tr721_requested_mints"),
            config: Item::new("tr721_config"),
        }
    }

    fn proxy_query<T: DeserializeOwned>(&self, ctx: QueryCtx, msg: Tr721QueryMsg) -> StdResult<T> {
        let bin = Tr721Contract::default().query(ctx.deps, ctx.env, msg)?;
        let resp = from_json::<T>(bin).unwrap();
        Ok(resp)
    }

    fn proxy_exec(&self, ctx: ExecCtx, msg: Tr721ExecuteMsg) -> Result<Response, ContractError> {
        let resp = Tr721Contract::default().execute(ctx.deps, ctx.env, ctx.info, msg)?;
        Ok(resp)
    }

    #[msg(instantiate)]
    pub fn instantiate(
        &self,
        ctx: InstantiateCtx,
        msg: Tr721InstantiateMsg,
    ) -> StdResult<Response> {
        // Set contract version
        let contract = format!("teritori:{CONTRACT_NAME}");
        self.contract_version.save(
            ctx.deps.storage,
            &ContractVersion {
                contract,
                version: CONTRACT_VERSION.to_string(),
            },
        )?;

        self.config.save(ctx.deps.storage, &msg.config)?;

        let base_msg = BaseInstantiateMsg {
            name: msg.name,
            minter: msg.minter,
            symbol: msg.symbol,
        };

        Ok(Tr721Contract::default().instantiate(ctx.deps, ctx.env, ctx.info, base_msg)?)
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

    // ATTENTION !!!: Should not call mint for now, we have to pass by: request_mint => claim
    // Deprecated: should remove this, leave it here for now just for testing
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

    #[msg(exec)]
    pub fn request_mint(&self, ctx: ExecCtx) -> Result<Response, ContractError> {
        let sender = ctx.deps.api.addr_validate(ctx.info.sender.as_str())?;
        let token_id = Tr721Contract::default()
            .increment_tokens(ctx.deps.storage)
            .unwrap();

        // If token already requested then throw error otherwise then assign to sender
        self.requested_mints.update(
            ctx.deps.storage,
            token_id.to_string(),
            |current| match current {
                Some(_) => Err(ContractError::NftAlreadyRequested),
                None => Ok(sender.clone()),
            },
        )?;

        Ok(Response::new()
            .add_attribute("action", "request_mint")
            .add_attribute("minter", sender.clone())
            .add_attribute("owner", sender)
            .add_attribute("token_id", token_id.to_string()))
    }

    #[msg(exec)]
    pub fn claim(
        &self,
        ctx: ExecCtx,
        token_id: String,
        metadata: Metadata,
        merkle_proof: String,
    ) -> Result<Response, ContractError> {
        let sender = ctx.deps.api.addr_validate(ctx.info.sender.as_str())?;
        let requested_owner = self
            .requested_mints
            .load(ctx.deps.storage, token_id.clone())
            .map_err(|_| ContractError::NftNotRequested)?;

        if sender != requested_owner {
            return Err(ContractError::Unauthorized);
        }

        let proof_hex = HexBinary::from_hex(&merkle_proof).unwrap().to_vec();
        let proof_from_hex = MerkleProof::<Sha256>::try_from(proof_hex.to_owned()).unwrap();

        let config = self.config.load(ctx.deps.storage)?;
        let root_hex = config.merkle_root;
        let root_from_hex: [u8; 32] = HexBinary::from_hex(root_hex.as_str())
            .unwrap()
            .to_vec()
            .try_into()
            .unwrap();

        let token_id_uint: usize = token_id.parse().unwrap();
        let leaf_indices = vec![token_id_uint];
        let leaf_hashes = vec![Sha256::hash(&to_json_vec(&metadata).unwrap())];
        let total_leaves_count: usize = config.total_supply.try_into().unwrap();

        let is_verified = proof_from_hex.verify(
            root_from_hex,
            &leaf_indices,
            &leaf_hashes,
            total_leaves_count,
        );

        if !is_verified {
            return Err(ContractError::InvalidMerkleProof);
        }

        // Merkle verification is ok then mint NFT to sender
        // In default mint, only contract owner can mint so we have to change to logic here instead of proxy call to default method
        // Create the token
        let token = TokenInfo {
            owner: sender.clone(),
            approvals: vec![],
            token_uri: None,
            extension: metadata,
        };
        self.tokens
            .update(ctx.deps.storage, &token_id, |old| match old {
                Some(_) => Err(ContractError::NftAlreadyClaimed),
                None => Ok(token),
            })?;

        Ok(Response::new()
            .add_attribute("action", "claim")
            .add_attribute("sender", sender.clone())
            .add_attribute("owner", sender)
            .add_attribute("token_id", token_id.to_string()))
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
    pub fn contract_version(&self, ctx: QueryCtx) -> StdResult<ContractVersion> {
        let contract_version = self.contract_version.load(ctx.deps.storage)?;
        Ok(contract_version)
    }

    #[msg(query)]
    pub fn merkle_root(&self, ctx: QueryCtx) -> StdResult<String> {
        let merkle_root = self.config.load(ctx.deps.storage)?.merkle_root;
        Ok(merkle_root)
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
pub struct ContractVersion {
    pub contract: String,
    pub version: String,
}

#[cw_serde]
pub struct Config {
    pub merkle_root: String,
    pub total_supply: u32,
}

#[cw_serde]
pub struct Tr721InstantiateMsg {
    pub name: String,
    pub symbol: String,
    pub minter: String,
    pub config: Config,
}
