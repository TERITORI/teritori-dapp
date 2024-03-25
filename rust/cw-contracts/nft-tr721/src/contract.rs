use cosmwasm_schema::cw_serde;
use cosmwasm_std::{
    from_json, Addr, Binary, Coin, HexBinary, Order, Response, StdResult, Storage, Uint128,
};
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
use rs_merkle::{Hasher, MerkleProof};
use serde::de::DeserializeOwned;
use sylvia::{
    contract, entry_points,
    types::{ExecCtx, InstantiateCtx, QueryCtx},
};

use crate::{error::ContractError, hasher::TrKeccak256, utils::proto_encode};

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
    pub(crate) admin: Item<'static, String>,
    pub(crate) tokens:
        IndexedMap<'static, &'static str, TokenInfo<Metadata>, TokenIndexes<'static, Metadata>>,
    pub(crate) requested_mints: Map<'static, String, Addr>, //  token id => User address
    pub(crate) launchpad_contract: Item<'static, String>,
    pub(crate) mint_info: Item<'static, MintInfo>,
    pub(crate) whitelist_mint_infos: Map<'static, u32, WhitelistMintInfo>,
    pub(crate) whitelist_minted_count: Map<'static, (u32, String), u32>, // Map (whitelist period, user) => count
    pub(crate) minted_count: Map<'static, String, u32>,                  // Map user => count
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
            admin: Item::new("admin"),
            requested_mints: Map::new("tr721_requested_mints"),
            mint_info: Item::new("mint_info"),
            whitelist_mint_infos: Map::new("whitelist_mint_infos"),
            launchpad_contract: Item::new("launchpad_contract"),
            whitelist_minted_count: Map::new("whitelist_minted_count"),
            minted_count: Map::new("minted_count"),
        }
    }

    fn assert_admin(&self, store: &dyn Storage, user: String) -> Result<(), ContractError> {
        let admin = self.admin.load(store)?;
        if user != admin {
            return Err(ContractError::Unauthorized);
        }

        Ok(())
    }

    pub fn assert_funds(
        &self,
        funds: &Vec<Coin>,
        expected_denom: String,
        expected_amount: Uint128,
    ) -> Result<(), ContractError> {
        if funds.len() != 1 {
            return Err(ContractError::InvalidFund);
        } else if funds[0].denom != expected_denom {
            return Err(ContractError::InvalidDenom);
        } else if funds[0].amount != expected_amount {
            return Err(ContractError::InvalidAmount);
        }

        Ok(())
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
        admin: String,
        name: String,
        minter: String,
        symbol: String,
        launchpad_contract: String,
        mint_info: MintInfo,
        whitelist_mint_infos: Vec<WhitelistMintInfo>,
    ) -> StdResult<Response> {
        // Set contract version
        self.contract_version.save(
            ctx.deps.storage,
            &ContractVersion {
                contract: format!("teritori:{CONTRACT_NAME}"),
                version: CONTRACT_VERSION.to_string(),
            },
        )?;

        self.admin.save(ctx.deps.storage, &admin)?;

        self.launchpad_contract
            .save(ctx.deps.storage, &launchpad_contract)?;

        self.mint_info.save(ctx.deps.storage, &mint_info)?;

        for (idx, whitelist_mint_info) in whitelist_mint_infos.iter().enumerate() {
            self.whitelist_mint_infos.save(
                ctx.deps.storage,
                idx.try_into().unwrap(),
                whitelist_mint_info,
            )?;
        }

        let base_msg = BaseInstantiateMsg {
            name,
            minter,
            symbol,
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

    // NOTE: Normally we should not update info, this endpoint exists mostly for testing or used in very urgent/critical case
    #[msg(exec)]
    pub fn update_mint_info(
        &self,
        ctx: ExecCtx,
        mint_info: MintInfo,
    ) -> Result<Response, ContractError> {
        self.assert_admin(ctx.deps.storage, ctx.info.sender.to_string())?;

        self.mint_info.save(ctx.deps.storage, &mint_info)?;
        Ok(Response::new().add_attribute("action", "update_mint_info"))
    }

    // NOTE: Normally we should not update whitelist, this endpoint exists mostly for testing or used in very urgent/critical case
    #[msg(exec)]
    pub fn update_whitelist_mint_info(
        &self,
        ctx: ExecCtx,
        whitelist_id: u32,
        whitelist_mint_info: WhitelistMintInfo,
    ) -> Result<Response, ContractError> {
        self.assert_admin(ctx.deps.storage, ctx.info.sender.to_string())?;

        self.whitelist_mint_infos
            .save(ctx.deps.storage, whitelist_id, &whitelist_mint_info)?;
        Ok(Response::new().add_attribute("action", "update_whitelist_mint_info"))
    }

    #[msg(exec)]
    pub fn request_mint(
        &self,
        ctx: ExecCtx,
        whitelist_proof: Option<WhitelistProof>,
    ) -> Result<Response, ContractError> {
        // Check conditions:
        let mint_info = self.mint_info.load(ctx.deps.storage)?;
        let now = ctx.env.block.time.seconds();
        let sender = ctx.info.sender.to_string();

        // Check if we reach to total tokens
        let total_minted = Tr721Contract::default()
            .token_count(ctx.deps.storage)
            .unwrap();
        if total_minted >= mint_info.tokens_count {
            return Err(ContractError::MintExceedMaxTokens);
        }

        // Check if user is in whitelist
        // - is time matched
        // - is address in whitelist
        let mut current_whitelist: Option<WhitelistMintInfo> = None;
        let mut current_period: Option<u32> = None;

        // If merkle proof is sent then we check if sender is in whitelist and is there related whitelist period
        if whitelist_proof.is_some() {
            for item in
                self.whitelist_mint_infos
                    .range(ctx.deps.storage, None, None, Order::Ascending)
            {
                let (period, whitelist) = item?;

                if now >= whitelist.start_time && now < whitelist.end_time {
                    let wp = whitelist_proof.to_owned().unwrap();

                    // Verify if sender is in whitelist addresses
                    let proof_hex = HexBinary::from_hex(&wp.merkle_proof).unwrap().to_vec();
                    let proof_from_hex =
                        MerkleProof::<TrKeccak256>::try_from(proof_hex.to_owned()).unwrap();

                    let root_hex = whitelist.to_owned().merkle_root;
                    let root_from_hex: [u8; 32] = HexBinary::from_hex(root_hex.as_str())
                        .unwrap()
                        .to_vec()
                        .try_into()
                        .unwrap();

                    let leaf_indices = vec![wp.address_indice.try_into().unwrap()];
                    let leaf_hashes = vec![TrKeccak256::hash(sender.as_bytes())];
                    let total_leaves_count: usize = whitelist.addresses_count.try_into().unwrap();

                    let is_verified = proof_from_hex.verify(
                        root_from_hex,
                        &leaf_indices,
                        &leaf_hashes,
                        total_leaves_count,
                    );

                    if is_verified {
                        current_whitelist = Some(whitelist);
                        current_period = Some(period);
                        break;
                    }
                }
            }
        }

        // Whitelist mint:check if sender has not reach the max per user
        if current_whitelist.is_some() && current_period.is_some() {
            self.whitelist_minted_count.update(
                ctx.deps.storage,
                (current_period.unwrap(), sender),
                |count| -> Result<u32, ContractError> {
                    let current_count = count.unwrap_or(0);
                    if current_count >= current_whitelist.to_owned().unwrap().limit_per_address {
                        return Err(ContractError::WhitelistMintExceedMaxPerUser);
                    }

                    Ok(current_count + 1)
                },
            )?;

            self.assert_funds(
                &ctx.info.funds,
                current_whitelist.to_owned().unwrap().denom,
                current_whitelist.to_owned().unwrap().unit_price,
            )?;
        }
        // Normal mint: check if user has not reach max per user
        else if now >= mint_info.start_time {
            self.minted_count.update(
                ctx.deps.storage,
                sender,
                |count| -> Result<u32, ContractError> {
                    let current_count = count.unwrap_or(0);
                    if current_count >= mint_info.limit_per_address {
                        return Err(ContractError::MintExceedMaxPerUser);
                    }

                    Ok(current_count + 1)
                },
            )?;

            self.assert_funds(
                &ctx.info.funds,
                mint_info.to_owned().denom,
                mint_info.to_owned().unit_price,
            )?;
        }
        // If neither in Normal mint nor Whitelist mint then raise error
        else {
            return Err(ContractError::MintNotStarted);
        }

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

        let collection_info = self.mint_info.load(ctx.deps.storage)?;

        let proof_hex = HexBinary::from_hex(&merkle_proof).unwrap().to_vec();
        let proof_from_hex = MerkleProof::<TrKeccak256>::try_from(proof_hex.to_owned()).unwrap();

        let root_hex = collection_info.merkle_root;
        let root_from_hex: [u8; 32] = HexBinary::from_hex(root_hex.as_str())
            .unwrap()
            .to_vec()
            .try_into()
            .unwrap();

        let token_id_uint: usize = token_id.parse().unwrap();
        let leaf_indices = vec![token_id_uint];
        let leaf_hashes = vec![TrKeccak256::hash(&proto_encode(&metadata))];
        let total_leaves_count: usize = collection_info.tokens_count.try_into().unwrap();

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

    // Total minted = minted + whitelist minted
    #[msg(query)]
    pub fn total_minted(&self, ctx: QueryCtx) -> StdResult<u64> {
        let total_minted = Tr721Contract::default()
            .token_count(ctx.deps.storage)
            .unwrap();

        Ok(total_minted)
    }

    #[msg(query)]
    pub fn minted_count_by_user(&self, ctx: QueryCtx, user: String) -> StdResult<u32> {
        let validated_addr = ctx.deps.api.addr_validate(&user)?.to_string();
        let count = self
            .minted_count
            .load(ctx.deps.storage, validated_addr)
            .unwrap_or(0);
        Ok(count)
    }

    #[msg(query)]
    pub fn whitelist_minted_count_by_user(
        &self,
        ctx: QueryCtx,
        period: u32,
        user: String,
    ) -> StdResult<u32> {
        let validated_addr = ctx.deps.api.addr_validate(&user)?.to_string();
        let count = self
            .whitelist_minted_count
            .load(ctx.deps.storage, (period, validated_addr))
            .unwrap_or(0);
        Ok(count)
    }

    #[msg(query)]
    pub fn mint_info(&self, ctx: QueryCtx) -> StdResult<MintInfo> {
        let mint_info = self.mint_info.load(ctx.deps.storage)?;
        Ok(mint_info)
    }

    #[msg(query)]
    pub fn whitelist_mint_infos(&self, ctx: QueryCtx) -> StdResult<Vec<WhitelistMintInfo>> {
        let mut whitelist_mint_infos: Vec<WhitelistMintInfo> = vec![];

        for item in self
            .whitelist_mint_infos
            .range(ctx.deps.storage, None, None, Order::Ascending)
        {
            let (_key, info) = item?;
            whitelist_mint_infos.push(info);
        }

        Ok(whitelist_mint_infos)
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
        let merkle_root = self.mint_info.load(ctx.deps.storage)?.merkle_root;
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
pub struct WhitelistProof {
    pub merkle_proof: String,
    pub address_indice: u32,
}

#[cw_serde]
#[derive(Default)]
pub struct WhitelistMintInfo {
    pub merkle_root: String,
    pub unit_price: Uint128,
    pub denom: String,
    pub limit_per_address: u32,
    pub addresses_count: u32,
    pub start_time: u64,
    pub end_time: u64,
}

#[cw_serde]
#[derive(Default)]
pub struct MintInfo {
    // Minting details ----------------------------
    pub tokens_count: u64,
    pub unit_price: Uint128,
    pub denom: String,
    pub limit_per_address: u32,
    pub start_time: u64,

    // Royalty --------------------------
    pub royalty_address: Option<Addr>,
    pub royalty_percentage: Option<u8>,

    // Extend info --------------------------
    pub merkle_root: String,
}
