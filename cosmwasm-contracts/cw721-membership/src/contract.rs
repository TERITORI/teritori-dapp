use crate::error::ContractError;
use base64::engine::general_purpose::URL_SAFE_NO_PAD;
use base64::Engine;
use cosmwasm_schema::cw_serde;
use cosmwasm_std::{
    Addr, BankMsg, Binary, Coin, CosmosMsg, Order, OverflowError, Response, StdResult, Storage,
    Timestamp, Uint128, Uint64,
};
use cw2981_royalties::msg::{CheckRoyaltiesResponse, Cw2981QueryMsg, RoyaltiesInfoResponse};
use cw721::{
    AllNftInfoResponse, ContractInfoResponse, Cw721ReceiveMsg, NftInfoResponse, NumTokensResponse,
    OwnerOfResponse, TokensResponse,
};
use cw721_metadata_onchain::{Metadata, Trait};
use cw_storage_plus::{Bound, Item, Map};
use integer_encoding::*;
use sylvia::types::{ExecCtx, InstantiateCtx, QueryCtx};
use sylvia::{contract, entry_points};

pub type NftExtension = Metadata;

pub const DEFAULT_LIMIT: usize = 10;
pub const MAX_DURATION_SECONDS: u64 = 2 * 365 * 24 * 60 * 60; // 2 "years"

// MAX_LIMIT is infinity, query gas restrictions should handle this, this allows protected nodes to return big batches if needed

pub struct Cw721MembershipContract {
    pub(crate) config: Item<'static, Config>,
    pub(crate) num_tokens: Item<'static, Uint64>,
    pub(crate) num_channels: Item<'static, Uint64>,
    pub(crate) channels: Map<'static, u64, Channel>,
    pub(crate) channels_by_owner: Map<'static, (Addr, u64), ()>,
    pub(crate) nfts: Map<'static, (u64, u64), Nft>,
    pub(crate) nfts_by_owner: Map<'static, (Addr, u64, u64), ()>,
    pub(crate) nfts_by_expiration: Map<'static, (String, u64, u64), ()>,
    pub(crate) mint_platform_fees: Map<'static, String, Uint128>,
    pub(crate) mint_funds: Map<'static, (u64, String), Uint128>,
}

#[cw_serde]
pub struct MembershipConfig {
    pub display_name: String,
    pub description: String,
    pub nft_image_uri: String,
    pub nft_name_prefix: String,
    pub duration_seconds: Uint64,
    pub price: Coin,
}

#[cw_serde]
pub struct ChannelResponse {
    pub id: Uint64,
    pub owner_addr: Addr,
    pub memberships_config: Vec<MembershipConfig>,
    pub trade_royalties_per10k: u16, // 0-10000 = 0%-100%
    pub mint_royalties_per10k: u16,  // 0-10000 = 0%-100%
    pub trade_royalties_addr: Addr,
}

#[cw_serde]
pub struct AdminFundsResponse {
    funds: Vec<Coin>,
}

#[cw_serde]
pub struct ChannelFundsResponse {
    funds: Vec<Coin>,
}

#[cw_serde]
pub struct Channel {
    memberships_config: Vec<MembershipConfig>,
    mint_royalties_per10k: Option<u16>, // 0-10000 = 0%-100%
    trade_royalties_per10k: u16,        // 0-10000 = 0%-100%
    trade_royalties_addr: Addr,
    next_index: Uint64,
    owner_addr: Addr,
}

#[cw_serde]
pub struct Nft {
    name: String,
    description: String,
    image_uri: String,
    start_time: Timestamp,
    duration_seconds: Uint64,
    owner_addr: Addr,
}

#[cw_serde]
pub struct Config {
    pub(crate) admin_addr: Addr,
    pub(crate) mint_royalties_per10k_default: u16, // 0-10000 = 0%-100%
    pub(crate) name: String,
    pub(crate) description: String,
    pub(crate) image_uri: String,
    pub(crate) symbol: String,
}

#[cw_serde]
pub struct Subscription {
    pub expiration: Timestamp,
    pub level_expiration: Timestamp,
}

#[cw_serde]
pub struct SubscriptionResponse {
    pub subscription: Option<Subscription>,
    pub level: u16,
}

#[cw_serde]
#[serde(untagged)]
pub enum Cw2981Response {
    CheckRoyaltiesResponse(cw2981_royalties::msg::CheckRoyaltiesResponse),
    RoyaltiesInfoResponse(cw2981_royalties::msg::RoyaltiesInfoResponse),
}

#[entry_points]
#[contract]
#[error(ContractError)]
impl Cw721MembershipContract {
    pub const fn new() -> Self {
        Self {
            config: Item::new("config"),
            channels: Map::new("channels"),
            channels_by_owner: Map::new("channels_by_owner"),
            nfts: Map::new("nfts"),
            num_tokens: Item::new("num_tokens"),
            num_channels: Item::new("num_channels"),
            nfts_by_owner: Map::new("nfts_by_owner"),
            nfts_by_expiration: Map::new("nfts_by_expiration"),
            mint_platform_fees: Map::new("mint_platform_fees"),
            mint_funds: Map::new("mint_funds"),
        }
    }

    #[msg(instantiate)]
    pub fn instantiate(
        &self,
        ctx: InstantiateCtx,
        admin_addr: String,
        mint_royalties_per10k_default: u16,
        name: String,
        description: String,
        image_uri: String,
        symbol: String,
    ) -> StdResult<Response> {
        let admin_addr = ctx.deps.api.addr_validate(admin_addr.as_str())?;
        self.config.save(
            ctx.deps.storage,
            &Config {
                admin_addr,
                mint_royalties_per10k_default,
                name,
                description,
                image_uri,
                symbol,
            },
        )?;
        self.num_tokens.save(ctx.deps.storage, &Uint64::zero())?;
        self.num_channels.save(ctx.deps.storage, &Uint64::zero())?;
        Ok(Response::default())
    }

    // Membership mutations

    #[msg(exec)]
    pub fn create_channel(
        &self,
        ctx: ExecCtx,
        memberships_config: Vec<MembershipConfig>,
        trade_royalties_per10k: u16, // 0-10000 = 0%-100%
        trade_royalties_addr: Option<String>,
    ) -> Result<Response, ContractError> {
        let owner_addr = ctx.info.sender;

        let channel_id = self
            .num_channels
            .update::<_, ContractError>(ctx.deps.storage, |num_channels| {
                Ok(num_channels.checked_add(Uint64::one())?)
            })?;
        self.channels_by_owner.save(
            ctx.deps.storage,
            (owner_addr.to_owned(), channel_id.u64()),
            &(),
        )?;

        let royalties_addr = match trade_royalties_addr {
            Some(royalties_addr) => ctx.deps.api.addr_validate(royalties_addr.as_str())?,
            None => owner_addr.to_owned(),
        };

        self.channels.update::<_, ContractError>(
            ctx.deps.storage,
            channel_id.into(),
            |channel| match channel {
                Some(_) => Err(ContractError::InternalError),
                None => Ok(Channel {
                    memberships_config,
                    next_index: Uint64::one(),
                    mint_royalties_per10k: None,
                    trade_royalties_per10k,
                    owner_addr,
                    trade_royalties_addr: royalties_addr,
                }),
            },
        )?;

        Ok(Response::default()
            .add_attribute("action", "create_channel")
            .add_attribute("channel_id", channel_id.to_string()))
    }

    #[msg(exec)]
    pub fn update_channel(
        &self,
        ctx: ExecCtx,
        id: Uint64,
        memberships_config: Option<Vec<MembershipConfig>>,
        trade_royalties_per10k: Option<u16>,
        trade_royalties_addr: Option<String>,
        // owner: Option<String>, TODO: allow transfer
    ) -> Result<Response, ContractError> {
        self.channels
            .update(ctx.deps.storage, id.into(), |channel| match channel {
                Some(mut channel) => {
                    if ctx.info.sender != channel.owner_addr {
                        return Err(ContractError::Unauthorized);
                    }

                    let mut changed = false;

                    if let Some(memberships_config) = memberships_config {
                        channel.memberships_config = memberships_config;
                        changed = true;
                    }

                    if let Some(trade_royalties_per10k) = trade_royalties_per10k {
                        channel.trade_royalties_per10k = trade_royalties_per10k;
                        changed = true;
                    }

                    if let Some(trade_royalties_addr) = trade_royalties_addr {
                        channel.trade_royalties_addr =
                            ctx.deps.api.addr_validate(trade_royalties_addr.as_str())?;
                        changed = true;
                    }

                    if !changed {
                        return Err(ContractError::NoChanges);
                    }

                    Ok(channel)
                }
                None => Err(ContractError::ChannelNotFound),
            })?;
        Ok(Response::default())
    }

    #[msg(exec)]
    pub fn subscribe(
        &self,
        ctx: ExecCtx,
        channel_id: Uint64,
        recipient_addr: String,
        membership_kind: u8,
    ) -> Result<Response, ContractError> {
        let recipient_addr = ctx.deps.api.addr_validate(recipient_addr.as_str())?;

        let mut channel = self
            .channels
            .load(ctx.deps.storage, channel_id.into())
            .map_err(|_| ContractError::ChannelNotFound)?;

        let membership = channel
            .memberships_config
            .get(membership_kind as usize)
            .ok_or(ContractError::MembershipKindNotFound)?;

        assert_exact_funds(&ctx, membership.price.to_owned())?;

        let config = self.config.load(ctx.deps.storage)?;

        let mint_royalties = channel
            .mint_royalties_per10k
            .unwrap_or(config.mint_royalties_per10k_default);

        let royalties_amount = membership
            .price
            .amount
            .checked_mul(Uint128::from(mint_royalties))?
            .checked_div(Uint128::from(10000u16))?;
        self.mint_platform_fees.update::<_, ContractError>(
            ctx.deps.storage,
            membership.price.denom.to_owned(),
            |royalties| {
                Ok(royalties
                    .unwrap_or(Uint128::zero())
                    .checked_add(royalties_amount)?)
            },
        )?;

        let creator_amount = membership.price.amount.checked_sub(royalties_amount)?;
        self.mint_funds.update::<_, ContractError>(
            ctx.deps.storage,
            (channel_id.u64(), membership.price.denom.to_owned()),
            |funds| {
                Ok(funds
                    .unwrap_or(Uint128::zero())
                    .checked_add(creator_amount)?)
            },
        )?;

        let nft_index = channel.next_index;
        let nft_name = format!("{} #{}", membership.nft_name_prefix, nft_index);
        let nft = Nft {
            name: nft_name,
            description: membership.description.to_owned(),
            image_uri: membership.nft_image_uri.to_owned(),
            start_time: ctx.env.block.time.to_owned(),
            duration_seconds: membership.duration_seconds,
            owner_addr: recipient_addr.to_owned(),
        };
        self.nfts.save(
            ctx.deps.storage,
            (channel_id.into(), nft_index.into()),
            &nft,
        )?;

        // save in index
        self.nfts_by_owner.save(
            ctx.deps.storage,
            (
                recipient_addr.to_owned(),
                channel_id.into(),
                nft_index.into(),
            ),
            &(),
        )?;
        let expiry = checked_expiry(nft.start_time, nft.duration_seconds)?;
        self.nfts_by_expiration.save(
            ctx.deps.storage,
            (
                recipient_addr.to_string() + &channel_id.to_string(),
                expiry.seconds(),
                nft_index.into(),
            ),
            &(),
        )?;

        channel.next_index = channel.next_index.checked_add(Uint64::one())?;
        self.channels
            .save(ctx.deps.storage, channel_id.into(), &channel)?;

        self.num_tokens
            .update::<_, ContractError>(ctx.deps.storage, |num_tokens| {
                Ok(num_tokens.checked_add(Uint64::one())?)
            })?;

        // we need this for efficient indexing
        let token_id = format_token_id(channel_id.into(), nft_index.into());
        let nft_info =
            self.internal_nft_info(ctx.deps.storage, channel_id.u64(), nft_index.u64())?;
        let json_nft_info =
            serde_json::to_string(&nft_info).map_err(|_| ContractError::SerializationError)?;

        Ok(Response::default()
            .add_attribute("token_id", token_id)
            .add_attribute("nft_info", json_nft_info))
    }

    #[msg(exec)]
    pub fn update_config(
        &self,
        ctx: ExecCtx,
        admin_addr: Option<String>,
        mint_royalties: Option<u16>,
        name: Option<String>,
        description: Option<String>,
        image_uri: Option<String>,
        symbol: Option<String>,
    ) -> Result<Response, ContractError> {
        self.config.update(ctx.deps.storage, |mut config| {
            if ctx.info.sender != config.admin_addr {
                return Err(ContractError::Unauthorized);
            }

            if let Some(admin_addr) = admin_addr {
                config.admin_addr = ctx.deps.api.addr_validate(admin_addr.as_str())?;
            }

            if let Some(mint_royalties) = mint_royalties {
                config.mint_royalties_per10k_default = mint_royalties;
            }

            if let Some(name) = name {
                config.name = name;
            }

            if let Some(description) = description {
                config.description = description;
            }

            if let Some(image_uri) = image_uri {
                config.image_uri = image_uri;
            }

            if let Some(symbol) = symbol {
                config.symbol = symbol;
            }

            Ok(config)
        })?;

        Ok(Response::default())
    }

    #[msg(exec)]
    pub fn update_channel_mint_platform_fee(
        &self,
        ctx: ExecCtx,
        channel_id: Uint64,
        mint_royalties: Option<u16>,
    ) -> Result<Response, ContractError> {
        let config = self.config.load(ctx.deps.storage)?;
        if ctx.info.sender != config.admin_addr {
            return Err(ContractError::Unauthorized);
        }

        let mut channel = self
            .channels
            .load(ctx.deps.storage, channel_id.into())
            .map_err(|_| ContractError::ChannelNotFound)?;

        channel.mint_royalties_per10k = mint_royalties;
        self.channels
            .save(ctx.deps.storage, channel_id.into(), &channel)?;

        Ok(Response::default())
    }

    #[msg(exec)]
    pub fn withdraw_mint_platform_fee(
        &self,
        ctx: ExecCtx,
        destination_addr: Option<String>,
    ) -> Result<Response, ContractError> {
        let config = self.config.load(ctx.deps.storage)?;
        if ctx.info.sender != config.admin_addr {
            return Err(ContractError::Unauthorized);
        }

        let destination_addr = match destination_addr {
            Some(destination_addr) => ctx.deps.api.addr_validate(destination_addr.as_str()),
            None => Ok(ctx.info.sender),
        }?;

        let coins: Result<Vec<Coin>, ContractError> = self
            .mint_platform_fees
            .range(ctx.deps.storage, None, None, Order::Ascending)
            .map(|item| {
                let (denom, amount) = item?;
                Ok(Coin { denom, amount })
            })
            .collect();

        let response = Response::default().add_message(CosmosMsg::Bank(BankMsg::Send {
            to_address: destination_addr.to_string(),
            amount: coins?,
        }));

        self.mint_platform_fees.clear(ctx.deps.storage);

        Ok(response)
    }

    #[msg(exec)]
    pub fn withdraw_mint_funds(
        &self,
        ctx: ExecCtx,
        channel_id: Uint64,
        destination_addr: Option<String>,
    ) -> Result<Response, ContractError> {
        let channel = self.channels.load(ctx.deps.storage, channel_id.into())?;

        if ctx.info.sender != channel.owner_addr {
            return Err(ContractError::Unauthorized);
        }

        let destination_addr = match destination_addr {
            Some(destination_addr) => ctx.deps.api.addr_validate(destination_addr.as_str()),
            None => Ok(ctx.info.sender),
        }?;

        let coins: Result<Vec<Coin>, ContractError> = self
            .mint_funds
            .prefix(channel_id.u64())
            .range(ctx.deps.storage, None, None, Order::Ascending)
            .map(|item| {
                let (denom, amount) = item?;
                Ok(Coin { denom, amount })
            })
            .collect();

        let response = Response::default().add_message(CosmosMsg::Bank(BankMsg::Send {
            to_address: destination_addr.to_string(),
            amount: coins?,
        }));

        self.mint_funds
            .prefix(channel_id.u64())
            .clear(ctx.deps.storage, None);

        Ok(response)
    }

    // Membership queries

    #[msg(query)]
    pub fn config(&self, ctx: QueryCtx) -> Result<Config, ContractError> {
        let conf = self.config.load(ctx.deps.storage)?;
        Ok(conf)
    }

    #[msg(query)]
    pub fn channel(
        &self,
        ctx: QueryCtx,
        channel_id: Uint64,
    ) -> Result<ChannelResponse, ContractError> {
        let config = self.config.load(ctx.deps.storage)?;

        let channel = self
            .channels
            .load(ctx.deps.storage, channel_id.into())
            .map_err(|_| ContractError::ChannelNotFound)?;

        Ok(ChannelResponse {
            id: channel_id.into(),
            owner_addr: channel.owner_addr,
            memberships_config: channel.memberships_config,
            mint_royalties_per10k: channel
                .mint_royalties_per10k
                .unwrap_or(config.mint_royalties_per10k_default),
            trade_royalties_per10k: channel.trade_royalties_per10k,
            trade_royalties_addr: channel.trade_royalties_addr,
        })
    }

    #[msg(query)]
    pub fn channels_by_owner(
        &self,
        ctx: QueryCtx,
        owner_address: String,
        start_after: Option<Uint64>,
        limit: Option<u32>,
    ) -> Result<Vec<Uint64>, ContractError> {
        let limit = limit.map(|limit| limit as usize).unwrap_or(DEFAULT_LIMIT);
        let channel_ids: Result<Vec<_>, ContractError> = self
            .channels_by_owner
            .prefix(Addr::unchecked(owner_address))
            .range(
                ctx.deps.storage,
                start_after.map(|sa| Bound::exclusive(sa)),
                None,
                Order::Ascending,
            )
            .map(|r| {
                let (id, _) = r?;
                Ok(Uint64::from(id))
            })
            .take(limit)
            .collect();
        Ok(channel_ids?)
    }

    #[msg(query)]
    pub fn admin_funds(&self, ctx: QueryCtx) -> Result<AdminFundsResponse, ContractError> {
        let funds: Result<Vec<Coin>, ContractError> = self
            .mint_platform_fees
            .range(ctx.deps.storage, None, None, Order::Ascending)
            .map(|item| {
                let (denom, amount) = item?;
                Ok(Coin { denom, amount })
            })
            .collect();
        Ok(AdminFundsResponse { funds: funds? })
    }

    #[msg(query)]
    pub fn channel_funds(
        &self,
        ctx: QueryCtx,
        channel_id: Uint64,
    ) -> Result<ChannelFundsResponse, ContractError> {
        let funds: Result<Vec<Coin>, ContractError> = self
            .mint_funds
            .prefix(channel_id.u64())
            .range(ctx.deps.storage, None, None, Order::Ascending)
            .map(|item| {
                let (denom, amount) = item?;
                Ok(Coin { denom, amount })
            })
            .collect();
        Ok(ChannelFundsResponse { funds: funds? })
    }

    #[msg(query)]
    pub fn subscription(
        &self,
        ctx: QueryCtx,
        sub_addr: String,
        channel_id: Uint64,
    ) -> Result<SubscriptionResponse, ContractError> {
        let sub_addr = Addr::unchecked(sub_addr.as_str());
        let mut subscription: Option<Subscription> = None;
        let mut level: u16 = 0;
        // only iterate over unexpired tokens
        for entry in self
            .nfts_by_expiration
            .sub_prefix(sub_addr.to_string() + &channel_id.to_string())
            .range(
                ctx.deps.storage,
                Some(Bound::exclusive((ctx.env.block.time.seconds(), 0))),
                None,
                Order::Ascending,
            )
        {
            let ((_, nft_index), _) = entry?;
            let nft = self
                .nfts
                .load(ctx.deps.storage, (channel_id.into(), nft_index.into()))?;

            // we don't need to check that we're past start time since it can't be in the future

            let expiration = checked_expiry(nft.start_time, nft.duration_seconds)?;
            if expiration <= ctx.env.block.time {
                continue;
            }

            level = level.checked_add(1).ok_or(ContractError::InternalError)?;

            match &subscription {
                Some(value) => {
                    subscription = Some(Subscription {
                        expiration: expiration.max(value.expiration),
                        level_expiration: expiration.min(value.level_expiration),
                    });
                }
                None => {
                    subscription = Some(Subscription {
                        expiration,
                        level_expiration: expiration,
                    });
                }
            }
        }
        Ok(SubscriptionResponse {
            subscription,
            level,
        })
    }

    // CW721 Mutations

    /// Transfer is a base message to move a token to another account without triggering actions
    #[msg(exec)]
    pub fn transfer_nft(
        &self,
        ctx: ExecCtx,
        recipient: String,
        token_id: String,
    ) -> Result<Response, ContractError> {
        let sender = ctx.info.sender.to_owned();

        self.internal_transfer_nft(ctx, recipient.to_owned(), token_id.to_owned())?;

        Ok(Response::new()
            .add_attribute("action", "transfer_nft")
            .add_attribute("sender", sender)
            .add_attribute("recipient", recipient)
            .add_attribute("token_id", token_id))
    }

    /// Send is a base message to transfer a token to a contract and trigger an action
    /// on the receiving contract.
    #[msg(exec)]
    pub fn send_nft(
        &self,
        ctx: ExecCtx,
        contract: String,
        token_id: String,
        msg: Binary,
    ) -> Result<Response, ContractError> {
        let sender = ctx.info.sender.to_owned();

        self.internal_transfer_nft(ctx, contract.to_owned(), token_id.to_owned())?;

        let send = Cw721ReceiveMsg {
            sender: sender.to_string(),
            token_id: token_id.to_owned(),
            msg,
        };

        // Send message
        Ok(Response::new()
            .add_message(send.into_cosmos_msg(contract.to_owned())?)
            .add_attribute("action", "send_nft")
            .add_attribute("sender", sender)
            .add_attribute("recipient", contract)
            .add_attribute("token_id", token_id))
    }

    // TODO

    /// Allows operator to transfer / send the token from the owner's account.
    /// If expiration is set, then this allowance has a time/height limit
    /*
    Approve {
        spender: String,
        token_id: String,
        expires: Option<Expiration>,
    },
    */

    /// Remove previously granted Approval
    /*
    Revoke { spender: String, token_id: String },
    */

    /// Allows operator to transfer / send any token from the owner's account.
    /// If expiration is set, then this allowance has a time/height limit
    /*
    ApproveAll {
        operator: String,
        expires: Option<Expiration>,
    },
    */

    /// Remove previously granted ApproveAll permission
    /*
    RevokeAll { operator: String },
    */

    /// Burn an NFT the sender has access to
    #[msg(exec)]
    pub fn burn(&self, ctx: ExecCtx, token_id: String) -> Result<Response, ContractError> {
        let (channel_id, nft_index) = parse_token_id(&token_id)?;

        let nft = self.nfts.load(ctx.deps.storage, (channel_id, nft_index))?;
        if nft.owner_addr != ctx.info.sender {
            return Err(ContractError::Unauthorized);
        }
        self.nfts.remove(ctx.deps.storage, (channel_id, nft_index));
        self.nfts_by_owner
            .remove(ctx.deps.storage, (ctx.info.sender, channel_id, nft_index));
        self.num_tokens
            .update::<_, ContractError>(ctx.deps.storage, |num_tokens| {
                Ok(num_tokens.checked_sub(Uint64::one())?)
            })?;
        Ok(Response::default())
    }

    // CW2981 Royalty Queries

    #[msg(query)]
    pub fn extension(
        &self,
        ctx: QueryCtx,
        msg: Cw2981QueryMsg,
    ) -> Result<Cw2981Response, ContractError> {
        match msg {
            Cw2981QueryMsg::CheckRoyalties {} => {
                let res = self.check_royalties()?;
                Ok(Cw2981Response::CheckRoyaltiesResponse(res))
            }
            Cw2981QueryMsg::RoyaltyInfo {
                token_id,
                sale_price,
            } => {
                let res = self.royalty_info(ctx, token_id, sale_price)?;
                Ok(Cw2981Response::RoyaltiesInfoResponse(res))
            }
        }
    }

    /// Should be called on sale to see if royalties are owed
    /// by the marketplace selling the NFT, if CheckRoyalties
    /// returns true
    /// See https://eips.ethereum.org/EIPS/eip-2981
    fn royalty_info(
        &self,
        ctx: QueryCtx,
        token_id: String,
        // the denom of this sale must also be the denom returned by RoyaltiesInfoResponse
        // this was originally implemented as a Coin
        // however that would mean you couldn't buy using CW20s
        // as CW20 is just mapping of addr -> balance
        sale_price: Uint128,
    ) -> Result<RoyaltiesInfoResponse, ContractError> {
        let (channel_id, _nft_index) = parse_token_id(&token_id)?;

        let channel = self
            .channels
            .load(ctx.deps.storage, channel_id)
            .map_err(|_| ContractError::ChannelNotFound)?;

        let royalty_amount = sale_price
            .checked_mul(Uint128::from(channel.trade_royalties_per10k))?
            .checked_div(Uint128::from(10000u128))?;

        Ok(RoyaltiesInfoResponse {
            address: channel.owner_addr.to_string(),
            royalty_amount,
        })
    }

    /// Called against contract to determine if this NFT
    /// implements royalties. Should return a boolean as part of
    /// CheckRoyaltiesResponse - default can simply be true
    /// if royalties are implemented at token level
    /// (i.e. always check on sale)
    fn check_royalties(&self) -> Result<CheckRoyaltiesResponse, ContractError> {
        Ok(CheckRoyaltiesResponse {
            royalty_payments: true,
        })
    }

    // CW721 Queries

    /// Return the owner of the given token, error if token does not exist
    /// Return type: OwnerOfResponse
    #[msg(query)]
    pub fn owner_of(
        &self,
        ctx: QueryCtx,
        token_id: String,
        /// unset or false will filter out expired approvals, you must set to true to see them
        include_expired: Option<bool>, // not implemented
    ) -> Result<OwnerOfResponse, ContractError> {
        let (channel_id, nft_index) = parse_token_id(&token_id)?;
        self.internal_owner_of(&ctx, channel_id, nft_index)
    }

    // TODO:

    // approval: not implemented
    // approvals: not implemented
    // operator: not implemented
    // all_operators: not implemented

    /// Total number of tokens issued
    #[msg(query)]
    pub fn num_tokens(&self, ctx: QueryCtx) -> Result<NumTokensResponse, ContractError> {
        Ok(NumTokensResponse {
            count: self.num_tokens.load(ctx.deps.storage)?.into(),
        })
    }

    /// With MetaData Extension.
    /// Returns top-level metadata about the contract: `ContractInfoResponse`
    #[msg(query)]
    pub fn contract_info(&self, _ctx: QueryCtx) -> Result<ContractInfoResponse, ContractError> {
        let conf = self.config.load(_ctx.deps.storage)?;
        Ok(ContractInfoResponse {
            name: conf.name,
            symbol: conf.symbol,
        })
    }

    /// With MetaData Extension.
    /// Returns metadata about one particular token, based on *ERC721 Metadata JSON Schema*
    /// but directly from the contract: `NftInfoResponse`
    #[msg(query)]
    pub fn nft_info(
        &self,
        ctx: QueryCtx,
        token_id: String,
    ) -> Result<NftInfoResponse<NftExtension>, ContractError> {
        let (channel_id, nft_index) = parse_token_id(&token_id)?;
        self.internal_nft_info(ctx.deps.storage, channel_id, nft_index)
    }

    /// With MetaData Extension.
    /// Returns the result of both `NftInfo` and `OwnerOf` as one query as an optimization
    /// for clients: `AllNftInfo`
    #[msg(query)]
    pub fn all_nft_info(
        &self,
        ctx: QueryCtx,
        token_id: String,
        /// unset or false will filter out expired approvals, you must set to true to see them
        include_expired: Option<bool>,
    ) -> Result<AllNftInfoResponse<NftExtension>, ContractError> {
        let (channel_id, nft_index) = parse_token_id(&token_id)?;
        let access = self.internal_owner_of(&ctx, channel_id, nft_index)?;
        let info = self.internal_nft_info(ctx.deps.storage, channel_id, nft_index)?;
        Ok(AllNftInfoResponse { access, info })
    }

    /// With Enumerable extension.
    /// Returns all tokens owned by the given address, [] if unset.
    /// Return type: TokensResponse.
    #[msg(query)]
    pub fn tokens(
        &self,
        ctx: QueryCtx,
        owner: String,
        start_after: Option<String>,
        limit: Option<u32>,
    ) -> Result<TokensResponse, ContractError> {
        let owner_addr = ctx.deps.api.addr_validate(owner.as_str())?;
        let limit = limit.map(|limit| limit as usize).unwrap_or(DEFAULT_LIMIT);
        let min_bound = match start_after {
            Some(start_after) => {
                let (channel_id, nft_index) = parse_token_id(&start_after)?;
                Some(Bound::exclusive((channel_id, nft_index)))
            }
            None => None,
        };

        let tokens: Result<Vec<_>, _> = self
            .nfts_by_owner
            .sub_prefix(owner_addr)
            .range(ctx.deps.storage, min_bound, None, Order::Ascending)
            .take(limit)
            .map(|item| -> Result<String, ContractError> {
                let ((channel_id, nft_index), _) = item?;
                Ok(format_token_id(channel_id, nft_index.into()))
            })
            .collect();
        Ok(TokensResponse { tokens: tokens? })
    }

    /// With Enumerable extension.
    /// Returns all tokens
    /// Return type: TokensResponse.
    #[msg(query)]
    pub fn all_tokens(
        &self,
        ctx: QueryCtx,
        start_after: Option<String>,
        limit: Option<u32>,
    ) -> Result<TokensResponse, ContractError> {
        let limit = limit.map(|limit| limit as usize).unwrap_or(DEFAULT_LIMIT);

        let min_bound = match start_after {
            Some(start_after) => {
                let (channel_id, nft_index) = parse_token_id(&start_after)?;
                Some(Bound::exclusive((channel_id, nft_index)))
            }
            None => None,
        };

        let tokens: Result<Vec<_>, _> = self
            .nfts
            .range(ctx.deps.storage, min_bound, None, Order::Ascending)
            .take(limit)
            .map(|item| -> Result<String, ContractError> {
                let ((channel_id, nft_index), _) = item?;
                Ok(format_token_id(channel_id, nft_index))
            })
            .collect();
        Ok(TokensResponse { tokens: tokens? })
    }

    fn internal_owner_of(
        &self,
        ctx: &QueryCtx,
        channel_id: u64,
        nft_index: u64,
    ) -> Result<OwnerOfResponse, ContractError> {
        let nft = self.nfts.load(ctx.deps.storage, (channel_id, nft_index))?;
        Ok(OwnerOfResponse {
            owner: nft.owner_addr.to_string(),
            approvals: vec![],
        })
    }

    fn internal_nft_info(
        &self,
        storage: &dyn Storage,
        channel_id: u64,
        nft_index: u64,
    ) -> Result<NftInfoResponse<NftExtension>, ContractError> {
        let nft = self.nfts.load(storage, (channel_id, nft_index))?;

        Ok(NftInfoResponse {
            token_uri: None,
            extension: NftExtension {
                name: Some(nft.name),
                description: Some(nft.description),
                image: Some(nft.image_uri),
                attributes: Some(vec![
                    Trait {
                        display_type: None,
                        trait_type: "Channel".to_string(),
                        value: channel_id.to_string(),
                    },
                    Trait {
                        display_type: Some("date".to_string()),
                        trait_type: "Starts".to_string(),
                        value: nft.start_time.seconds().to_string(),
                    },
                    Trait {
                        display_type: Some("duration".to_string()),
                        trait_type: "Duration".to_string(),
                        value: nft.duration_seconds.to_string(),
                    },
                ]),
                ..Default::default()
            },
        })
    }

    fn internal_transfer_nft(
        &self,
        ctx: ExecCtx,
        recipient: String,
        token_id: String,
    ) -> Result<Response, ContractError> {
        let recipient = ctx.deps.api.addr_validate(recipient.as_str())?;
        let sender = ctx.info.sender.to_owned();

        let (channel_id, nft_index) = parse_token_id(&token_id)?;

        let nft = self
            .nfts
            .update(ctx.deps.storage, (channel_id, nft_index), |nft| match nft {
                Some(nft) => {
                    if nft.owner_addr != ctx.info.sender {
                        return Err(ContractError::Unauthorized);
                    }
                    if nft.owner_addr == recipient {
                        return Err(ContractError::CannotTransferToSelf);
                    }
                    Ok(Nft {
                        owner_addr: recipient.to_owned(),
                        ..nft
                    })
                }
                None => Err(ContractError::NftNotFound),
            })?;

        self.nfts_by_owner
            .remove(ctx.deps.storage, (ctx.info.sender, channel_id, nft_index));
        self.nfts_by_owner.save(
            ctx.deps.storage,
            (recipient.to_owned(), channel_id, nft_index),
            &(),
        )?;
        let expiry_seconds = checked_expiry(nft.start_time, nft.duration_seconds)?.seconds();
        self.nfts_by_expiration.remove(
            ctx.deps.storage,
            (
                sender.to_string() + &channel_id.to_string(),
                expiry_seconds,
                nft_index,
            ),
        );
        self.nfts_by_expiration.save(
            ctx.deps.storage,
            (
                recipient.to_string() + &channel_id.to_string(),
                expiry_seconds,
                nft_index,
            ),
            &(),
        )?;

        Ok(Response::default())
    }
}

pub fn assert_exact_funds(ctx: &ExecCtx, amount: Coin) -> Result<Response, ContractError> {
    let mut total_funds_amount = Uint128::zero();
    for coin in ctx.info.funds.iter() {
        if coin.denom == amount.denom {
            total_funds_amount = total_funds_amount.checked_add(coin.amount)?;
            continue;
        }
        return Err(ContractError::InvalidFunds);
    }
    if total_funds_amount != amount.amount {
        return Err(ContractError::InvalidFunds);
    }
    Ok(Response::default())
}

pub fn parse_token_id(token_id: &String) -> Result<(u64, u64), ContractError> {
    let bytes = URL_SAFE_NO_PAD.decode(token_id)?;
    let (channel_id, channel_id_len) =
        u64::decode_var(bytes.as_slice()).ok_or(ContractError::InvalidTokenId)?;
    let (nft_index, _) =
        u64::decode_var(&bytes[channel_id_len..]).ok_or(ContractError::InvalidTokenId)?;
    Ok((channel_id, nft_index))
}

pub fn format_token_id(channel_id: u64, nft_index: u64) -> String {
    URL_SAFE_NO_PAD.encode([channel_id.encode_var_vec(), nft_index.encode_var_vec()].concat())
}

pub fn checked_expiry(
    start: Timestamp,
    duration_seconds: Uint64,
) -> Result<Timestamp, OverflowError> {
    let start_nanos = Uint64::from(start.nanos());
    let durations_nanos = duration_seconds.checked_mul(Uint64::from(1_000_000_000u64))?;
    let end_nanos = start_nanos.checked_add(durations_nanos)?;
    Ok(Timestamp::from_nanos(end_nanos.u64()))
}

pub fn validate_tiers(tiers: Vec<MembershipConfig>) -> bool {
    for tier in tiers.iter() {
        if tier.price.amount.is_zero() {
            return false;
        }
        if tier.price.denom.is_empty() {
            return false;
        }
        if tier.duration_seconds.is_zero()
            || tier.duration_seconds > Uint64::from(MAX_DURATION_SECONDS)
        {
            return false;
        }
        if tier.display_name.is_empty() {
            return false;
        }
        if tier.description.is_empty() {
            return false;
        }
        if tier.nft_name_prefix.is_empty() {
            return false;
        }
        if tier.nft_image_uri.is_empty() {
            return false;
        }
    }
    true
}
