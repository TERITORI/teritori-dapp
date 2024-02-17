use crate::error::ContractError;
use cosmwasm_schema::cw_serde;
use cosmwasm_std::{
    Addr, BankMsg, Binary, Coin, CosmosMsg, Order, Response, StdResult, Storage, Timestamp,
    Uint128, Uint64,
};
use cw721::{
    AllNftInfoResponse, ContractInfoResponse, NftInfoResponse, NumTokensResponse, OwnerOfResponse,
    TokensResponse,
};
use cw721_metadata_onchain::{Metadata, Trait};
use cw_storage_plus::{Bound, Item, KeyDeserialize, Map};
use sylvia::types::{ExecCtx, InstantiateCtx, QueryCtx};
use sylvia::{contract, entry_points};

pub type NftExtension = Metadata;

// TODO: allow to transfer channel

// TODO: opti: avoid duplicate parsing of token_id

// TODO: shorter token_id (bech32 with t as prefix of hash of binary data??)

pub struct Cw721MembershipContract {
    pub(crate) config: Item<'static, Config>,
    pub(crate) num_tokens: Item<'static, Uint64>,
    pub(crate) channels: Map<'static, Addr, Channel>,
    pub(crate) nfts: Map<'static, (Addr, u64), Nft>,
    pub(crate) by_owner: Map<'static, (Addr, Addr, u64), ()>,
    pub(crate) mint_platform_fees: Map<'static, String, Uint128>,
    pub(crate) mint_funds: Map<'static, (Addr, String), Uint128>,
}

#[cw_serde]
pub struct MembershipConfig {
    pub display_name: String,
    pub description: String,
    pub nft_image_uri: String,
    pub nft_name_prefix: String,
    pub duration_seconds: Uint64,
    pub trade_royalties: u16, // 0-10000 = 0%-100%,
    pub price: Coin,
}

#[cw_serde]
pub struct ChannelResponse {
    pub memberships_config: Vec<MembershipConfig>,
    pub mint_royalties: u16, // 0-10000 = 0%-100%
                             // TODO: tokens_count
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
    mint_royalties: u16, // 0-10000 = 0%-100%
    next_index: Uint64,
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
    pub(crate) mint_royalties: u16, // 0-10000 = 0%-100%
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

// TODO: trade royalties

#[entry_points]
#[contract]
#[error(ContractError)]
impl Cw721MembershipContract {
    pub const fn new() -> Self {
        Self {
            config: Item::new("config"),
            channels: Map::new("channels"),
            nfts: Map::new("nfts"),
            num_tokens: Item::new("num_tokens"),
            by_owner: Map::new("by_owner"),
            mint_platform_fees: Map::new("mint_royalties"),
            mint_funds: Map::new("mint_funds"),
        }
    }

    #[msg(instantiate)]
    pub fn instantiate(
        &self,
        ctx: InstantiateCtx,
        admin_addr: String,
        mint_royalties: u16,
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
                mint_royalties,
                name,
                description,
                image_uri,
                symbol,
            },
        )?;
        self.num_tokens.save(ctx.deps.storage, &Uint64::zero())?;
        Ok(Response::default())
    }

    // Membership mutations

    #[msg(exec)]
    pub fn upsert_channel(
        &self,
        ctx: ExecCtx,
        memberships_config: Vec<MembershipConfig>,
    ) -> Result<Response, ContractError> {
        let channel_addr = ctx.info.sender;

        let config = self.config.load(ctx.deps.storage)?;

        self.channels
            .update::<_, ContractError>(
                ctx.deps.storage,
                channel_addr,
                |channel| match channel {
                    Some(channel) => Ok(Channel {
                        memberships_config,
                        next_index: channel.next_index,
                        mint_royalties: channel.mint_royalties,
                    }),
                    None => Ok(Channel {
                        memberships_config,
                        next_index: Uint64::one(),
                        mint_royalties: config.mint_royalties,
                    }),
                },
            )?;

        Ok(Response::default())
    }

    #[msg(exec)]
    pub fn subscribe(
        &self,
        ctx: ExecCtx,
        channel_addr: String,
        recipient_addr: String,
        membership_kind: u8,
    ) -> Result<Response, ContractError> {
        let recipient_addr = ctx.deps.api.addr_validate(recipient_addr.as_str())?;

        let unchecked_channel_addr = Addr::unchecked(channel_addr.as_str()); // we don't need to validate the address because we won't find a channel if the address is invalid

        let mut channel = self
            .channels
            .load(ctx.deps.storage, unchecked_channel_addr.to_owned())
            .map_err(|_| ContractError::ChannelNotFound)?;
        let channel_addr = unchecked_channel_addr;

        let membership = channel
            .memberships_config
            .get(membership_kind as usize)
            .ok_or(ContractError::MembershipKindNotFound)?;

        assert_exact_funds(&ctx, membership.price.to_owned())?;

        let royalties_amount = membership
            .price
            .amount
            .checked_mul(Uint128::from(
                self.config.load(ctx.deps.storage)?.mint_royalties,
            ))?
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
            (channel_addr.to_owned(), membership.price.denom.to_owned()),
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
            (channel_addr.to_owned(), nft_index.into()),
            &nft,
        )?;
        self.by_owner.save(
            ctx.deps.storage,
            (
                recipient_addr.to_owned(),
                channel_addr.to_owned(),
                nft_index.into(),
            ),
            &(),
        )?;

        channel.next_index = channel.next_index.checked_add(Uint64::one())?;
        self.channels
            .save(ctx.deps.storage, channel_addr.to_owned(), &channel)?;

        self.num_tokens
            .update::<_, ContractError>(ctx.deps.storage, |num_tokens| {
                Ok(num_tokens.checked_add(Uint64::one())?)
            })?;

        // we need these for efficient indexing
        let token_id = format_token_id(&channel_addr, nft_index);
        let nft_info = self.internal_nft_info(ctx.deps.storage, &token_id)?;
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
                config.mint_royalties = mint_royalties;
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

    // TODO: partial update
    pub fn update_channel(
        &self,
        ctx: ExecCtx,
        memberships_config: Option<Vec<MembershipConfig>>,
    ) -> Result<Response, ContractError> {
        let channel_addr = ctx.info.sender;
        let mut channel = self
            .channels
            .load(ctx.deps.storage, channel_addr.to_owned())
            .map_err(|_| ContractError::ChannelNotFound)?;

        // TODO: think: maybe we shouldn't allow to mutate existing membership configs?
        if let Some(memberships_config) = memberships_config {
            channel.memberships_config = memberships_config;
        }

        self.channels
            .save(ctx.deps.storage, channel_addr, &channel)?;

        Ok(Response::default())
    }

    #[msg(exec)]
    pub fn update_channel_mint_platform_fee(
        &self,
        ctx: ExecCtx,
        channel_addr: String,
        mint_royalties: u16,
    ) -> Result<Response, ContractError> {
        let config = self.config.load(ctx.deps.storage)?;
        if ctx.info.sender != config.admin_addr {
            return Err(ContractError::Unauthorized);
        }

        let unchecked_channel_addr = Addr::unchecked(channel_addr.as_str()); // we don't need to validate the address because we won't find a channel if the address is invalid
        let mut channel = self
            .channels
            .load(ctx.deps.storage, unchecked_channel_addr.to_owned())
            .map_err(|_| ContractError::ChannelNotFound)?;
        let channel_addr = unchecked_channel_addr;

        channel.mint_royalties = mint_royalties;
        self.channels
            .save(ctx.deps.storage, channel_addr, &channel)?;

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
        channel_addr: String,
        destination_addr: Option<String>,
    ) -> Result<Response, ContractError> {
        let unchecked_channel_addr = Addr::unchecked(channel_addr.as_str()); // we don't need to validate the address because we won't find a channel if the address is invalid
        if !self
            .channels
            .has(ctx.deps.storage, unchecked_channel_addr.to_owned())
        {
            return Err(ContractError::ChannelNotFound);
        }
        let channel_addr = unchecked_channel_addr;

        if ctx.info.sender != channel_addr {
            return Err(ContractError::Unauthorized);
        }

        let destination_addr = match destination_addr {
            Some(destination_addr) => ctx.deps.api.addr_validate(destination_addr.as_str()),
            None => Ok(ctx.info.sender),
        }?;

        let coins: Result<Vec<Coin>, ContractError> = self
            .mint_funds
            .prefix(channel_addr.to_owned())
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
            .prefix(channel_addr)
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
        channel_addr: String,
    ) -> Result<ChannelResponse, ContractError> {
        let unchecked_channel_addr = Addr::unchecked(channel_addr.as_str()); // we don't need to validate the address because we won't find a channel if the address is invalid
        let channel = self
            .channels
            .load(ctx.deps.storage, unchecked_channel_addr.to_owned())
            .map_err(|_| ContractError::ChannelNotFound)?;

        Ok(ChannelResponse {
            memberships_config: channel.memberships_config,
            mint_royalties: channel.mint_royalties,
        })
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
        channel_addr: String,
    ) -> Result<ChannelFundsResponse, ContractError> {
        let unchecked_channel_addr = Addr::unchecked(channel_addr.as_str()); // we don't need to validate the address because we won't find a channel if the address is invalid
        let channel_addr = unchecked_channel_addr;
        let funds: Result<Vec<Coin>, ContractError> = self
            .mint_funds
            .prefix(channel_addr.to_owned())
            .range(ctx.deps.storage, None, None, Order::Ascending)
            .map(|item| {
                let (denom, amount) = item?;
                Ok(Coin { denom, amount })
            })
            .collect();
        Ok(ChannelFundsResponse { funds: funds? })
    }

    // FIXME: this might fail if an user has too many tokens for a particular channel
    // maybe optimize by using expiration as key and start query range after now, this will only operate on unexpired tokens since you can't set the start date in the future
    #[msg(query)]
    pub fn subscription(
        &self,
        ctx: QueryCtx,
        sub_addr: String,
        channel_addr: String,
    ) -> Result<SubscriptionResponse, ContractError> {
        let sub_addr = Addr::unchecked(sub_addr.as_str());
        let channel_addr = Addr::unchecked(channel_addr.as_str());
        let mut subscription: Option<Subscription> = None;
        let mut level: u16 = 0;
        for entry in self
            .by_owner
            .prefix((sub_addr, channel_addr.to_owned()))
            .range(ctx.deps.storage, None, None, Order::Ascending)
        {
            let (nft_index, _) = entry?;
            let nft = self.nfts.load(
                ctx.deps.storage,
                (channel_addr.to_owned(), nft_index.into()),
            )?;

            // we don't need to check that we're past start time since it can't be in the future

            let expiration = nft.start_time.plus_seconds(nft.duration_seconds.into());
            if expiration <= ctx.env.block.time {
                continue;
            }

            level += 1;

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

    #[msg(exec)]
    pub fn transfer_nft(
        &self,
        ctx: ExecCtx,
        recipient: String,
        token_id: String,
    ) -> Result<Response, ContractError> {
        let recipient = ctx.deps.api.addr_validate(recipient.as_str())?;

        let (channel_addr, nft_index) = parse_token_id(&token_id)?;

        self.nfts.update(
            ctx.deps.storage,
            (channel_addr.to_owned(), nft_index),
            |nft| match nft {
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
            },
        )?;

        self.by_owner.remove(
            ctx.deps.storage,
            (ctx.info.sender, channel_addr.to_owned(), nft_index),
        );
        self.by_owner
            .save(ctx.deps.storage, (recipient, channel_addr, nft_index), &())?;

        Ok(Response::default())
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
        let (channel_addr, nft_index) = parse_token_id(&token_id)?;

        let nft = self
            .nfts
            .load(ctx.deps.storage, (channel_addr.to_owned(), nft_index))?;
        if nft.owner_addr != ctx.info.sender {
            return Err(ContractError::Unauthorized);
        }
        self.nfts
            .remove(ctx.deps.storage, (channel_addr.to_owned(), nft_index));
        self.by_owner
            .remove(ctx.deps.storage, (ctx.info.sender, channel_addr, nft_index));
        self.num_tokens
            .update::<_, ContractError>(ctx.deps.storage, |num_tokens| {
                Ok(num_tokens.checked_sub(Uint64::one())?)
            })?;
        Ok(Response::default())
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
        self.internal_owner_of(&ctx, &token_id)
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
        self.internal_nft_info(ctx.deps.storage, &token_id)
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
        let access = self.internal_owner_of(&ctx, &token_id)?;
        let info = self.internal_nft_info(ctx.deps.storage, &token_id)?;
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
        let limit = limit.map(|limit| limit as usize).unwrap_or(30);
        let min_bound = match start_after {
            Some(start_after) => {
                let (channel_addr, nft_index) = parse_token_id(&start_after)?;
                Some(Bound::exclusive((channel_addr, nft_index)))
            }
            None => None,
        };

        let tokens: Result<Vec<_>, _> = self
            .by_owner
            .sub_prefix(owner_addr)
            .range(ctx.deps.storage, min_bound, None, Order::Ascending)
            .take(limit)
            .map(|item| -> Result<String, ContractError> {
                let ((channel_addr, nft_index), _) = item?;
                Ok(format_token_id(&channel_addr, nft_index.into()))
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
        let limit = limit.map(|limit| limit as usize).unwrap_or(30);

        let start_after = match start_after {
            Some(start_after) => {
                let (channel_addr, nft_index) = parse_token_id(&start_after)?;
                Some((channel_addr, nft_index))
            }
            None => None,
        };

        let tokens: Result<Vec<_>, _> = self
            .nfts
            .range(
                ctx.deps.storage,
                start_after.map(|sa| Bound::exclusive(sa)),
                None,
                Order::Ascending,
            )
            .take(limit)
            .map(|item| -> Result<String, ContractError> {
                let ((channel_addr, nft_index), _) = item?;
                Ok(format_token_id(&channel_addr, Uint64::from(nft_index)))
            })
            .collect();
        Ok(TokensResponse { tokens: tokens? })
    }

    fn internal_owner_of(
        &self,
        ctx: &QueryCtx,
        token_id: &String,
    ) -> Result<OwnerOfResponse, ContractError> {
        let (channel_addr, nft_index) = parse_token_id(&token_id)?;
        let nft = self
            .nfts
            .load(ctx.deps.storage, (channel_addr, nft_index.into()))?;
        Ok(OwnerOfResponse {
            owner: nft.owner_addr.to_string(),
            approvals: vec![],
        })
    }

    fn internal_nft_info(
        &self,
        storage: &dyn Storage,
        token_id: &String,
    ) -> Result<NftInfoResponse<NftExtension>, ContractError> {
        let (channel_addr, nft_index) = parse_token_id(token_id)?;

        let nft = self
            .nfts
            .load(storage, (channel_addr.to_owned(), nft_index.into()))?;

        // TODO: improve info

        Ok(NftInfoResponse {
            token_uri: None,
            extension: NftExtension {
                name: Some(nft.name),
                description: Some(nft.description),
                image: Some(nft.image_uri),
                animation_url: None,
                external_url: None,
                background_color: None,
                youtube_url: None,
                attributes: Some(vec![
                    Trait {
                        display_type: Some("DISPLAY_TYPE_PROPERTY".to_string()),
                        trait_type: "Channel address".to_string(),
                        value: channel_addr.to_string(),
                    },
                    Trait {
                        display_type: Some("DISPLAY_TYPE_DATE".to_string()),
                        trait_type: "Starts".to_string(),
                        value: nft.start_time.to_string(),
                    },
                    Trait {
                        display_type: Some("DISPLAY_TYPE_PROPERTY".to_string()),
                        trait_type: "Duration in seconds".to_string(),
                        value: nft.duration_seconds.to_string(),
                    },
                ]),
                image_data: None,
            },
        })
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

pub fn parse_token_id(token_id: &String) -> Result<(Addr, u64), ContractError> {
    let bytes = Binary::from_base64(token_id)?;
    let nft_index = u64::from_be_bytes(
        bytes[0..8]
            .try_into()
            .map_err(|_| ContractError::InvalidTokenId)?,
    );
    let channel_addr = Addr::from_slice(&bytes[8..])?;
    Ok((channel_addr, nft_index))
}

pub fn format_token_id(channel_addr: &Addr, nft_index: Uint64) -> String {
    let nft_index_bytes = nft_index.to_be_bytes();
    let channel_addr_bytes = channel_addr.as_bytes();
    let all_bytes = [&nft_index_bytes, channel_addr_bytes].concat();
    Binary::from(all_bytes).to_base64()
}
