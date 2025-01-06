use crate::error::ContractError;
use cosmwasm_schema::cw_serde;
use cosmwasm_std::{
    Addr, BankMsg, Coin, CosmosMsg, Order as CwOrder, Response, StdResult, Storage, Timestamp,
};
use cw_storage_plus::{Bound as CwBound, Item, Map};
use sha2::{Digest, Sha256};
use sylvia::types::{ExecCtx, InstantiateCtx, QueryCtx};
use sylvia::{contract, entry_points};

pub struct AtomicSwapContract {
    pub(crate) swaps: Map<'static, u64, AtomicSwap>,
    pub(crate) admin: Item<'static, Addr>,
}

#[cw_serde]
pub struct SwapStateRedeemed {
    redeemed_at: Timestamp,
    preimage: String,
}

#[cw_serde]
pub struct SwapStateRefunded {
    refunded_at: Timestamp,
}

#[cw_serde]
enum SwapState {
    Created,
    Redeemed(SwapStateRedeemed),
    Refunded(SwapStateRefunded),
}

#[cw_serde]
pub struct AtomicSwap {
    creator: Addr,
    created_at: Timestamp,
    hashlock: String,
    timelock: Timestamp,
    value: Vec<Coin>,
    state: SwapState,
    destination: Addr,
    hint: String,
}

#[cw_serde]
pub struct ListSwapsResult {
    total: u64,
    swaps: Vec<AtomicSwap>,
}

#[entry_points]
#[contract]
#[error(ContractError)]
impl AtomicSwapContract {
    pub const fn new() -> Self {
        Self {
            swaps: Map::new("swaps_v0"),
            admin: Item::new("admin_v0"),
        }
    }

    #[msg(instantiate)]
    pub fn instantiate(&self, ctx: InstantiateCtx, admin: String) -> StdResult<Response> {
        let admin = ctx.deps.api.addr_validate(&admin)?;
        self.admin.save(ctx.deps.storage, &admin)?;
        Ok(Response::default())
    }

    fn count_swaps(&self, storage: &dyn Storage) -> StdResult<u64> {
        Ok(self.swaps.last(storage)?.map(|elem| elem.0).unwrap_or(0u64))
    }

    // Mutations

    #[msg(exec)]
    pub fn create(
        &self,
        ctx: ExecCtx,
        hashlock: String,
        timelock: u64,
        destination: String,
        hint: String,
    ) -> Result<Response, ContractError> {
        let timelock = Timestamp::from_seconds(timelock.into());
        if !timelock.gt(&ctx.env.block.time) {
            return Err(ContractError::TimelockNotInFuture);
        }

        let destination = ctx.deps.api.addr_validate(&destination)?;

        let id = self.count_swaps(ctx.deps.storage)?;

        self.swaps.save(
            ctx.deps.storage,
            id,
            &AtomicSwap {
                hashlock,
                timelock,
                destination,
                hint,
                creator: ctx.info.sender,
                created_at: ctx.env.block.time,
                value: ctx.info.funds,
                state: SwapState::Created,
            },
        )?;

        Ok(Response::default())
    }

    #[msg(exec)]
    pub fn redeem(
        &self,
        ctx: ExecCtx,
        id: u64,
        preimage: String,
    ) -> Result<Response, ContractError> {
        let mut swap = self.swaps.load(ctx.deps.storage, id)?;

        match swap.state {
            SwapState::Created => {}
            SwapState::Redeemed(_) => return Err(ContractError::AlreadyRedeemed),
            SwapState::Refunded(_) => return Err(ContractError::AlreadyRefunded),
        }

        if swap.destination != ctx.info.sender {
            return Err(ContractError::Unauthorized);
        }

        let hashlock = hex::encode(Sha256::digest(&preimage));
        if hashlock != swap.hashlock {
            return Err(ContractError::InvalidPreimage);
        }

        swap.state = SwapState::Redeemed(SwapStateRedeemed {
            preimage,
            redeemed_at: ctx.env.block.time,
        });

        self.swaps.save(ctx.deps.storage, id, &swap)?;

        Ok(
            Response::default().add_message(CosmosMsg::Bank(BankMsg::Send {
                to_address: swap.destination.to_string(),
                amount: swap.value,
            })),
        )
    }

    #[msg(exec)]
    pub fn refund(&self, ctx: ExecCtx, id: u64) -> Result<Response, ContractError> {
        let mut swap = self.swaps.load(ctx.deps.storage, id)?;

        match swap.state {
            SwapState::Created => {}
            SwapState::Redeemed(_) => return Err(ContractError::AlreadyRedeemed),
            SwapState::Refunded(_) => return Err(ContractError::AlreadyRefunded),
        }

        if !ctx.env.block.time.gt(&swap.timelock) {
            return Err(ContractError::TimelockNotExpired);
        }

        if swap.creator != ctx.info.sender {
            return Err(ContractError::Unauthorized);
        }

        swap.state = SwapState::Refunded(SwapStateRefunded {
            refunded_at: ctx.env.block.time,
        });

        self.swaps.save(ctx.deps.storage, id, &swap)?;

        Ok(
            Response::default().add_message(CosmosMsg::Bank(BankMsg::Send {
                to_address: swap.creator.to_string(),
                amount: swap.value,
            })),
        )
    }

    #[msg(exec)]
    pub fn change_admin(&self, ctx: ExecCtx, addr: String) -> Result<Response, ContractError> {
        let admin = self.admin.load(ctx.deps.storage)?;
        if admin != ctx.info.sender {
            return Err(ContractError::Unauthorized);
        }

        let addr = ctx.deps.api.addr_validate(&addr)?;
        if admin == addr {
            return Err(ContractError::AlreadyAdmin);
        }

        self.admin.save(ctx.deps.storage, &addr)?;

        Ok(Response::default())
    }

    // Queries

    #[msg(query)]
    pub fn admin(&self, ctx: QueryCtx) -> Result<Addr, ContractError> {
        let admin = self.admin.load(ctx.deps.storage)?;
        Ok(admin)
    }

    #[msg(query)]
    pub fn swaps(
        &self,
        ctx: QueryCtx,
        min: Option<Bound>,
        max: Option<Bound>,
        order: Option<Order>,
        limit: Option<u32>,
    ) -> Result<ListSwapsResult, ContractError> {
        let limit = limit
            .map(|limit| {
                if limit > QUERY_BATCH_MAX_LIMIT {
                    QUERY_BATCH_MAX_LIMIT
                } else {
                    limit
                }
            })
            .unwrap_or(QUERY_BATCH_MAX_LIMIT);

        let order = order.unwrap_or(Order::Ascending);

        let total = self.count_swaps(ctx.deps.storage)?;

        let swaps: Result<Vec<_>, _> = self
            .swaps
            .range(
                ctx.deps.storage,
                min.map(|m| m.into()),
                max.map(|m| m.into()),
                order.into(),
            )
            .take(limit as usize)
            .map(|item| -> Result<AtomicSwap, ContractError> {
                let (_, swap) = item?;
                Ok(swap)
            })
            .collect();
        Ok(ListSwapsResult {
            swaps: swaps?,
            total,
        })
    }
}

pub const QUERY_BATCH_MAX_LIMIT: u32 = 1000;

#[cw_serde]
pub enum Order {
    Ascending,
    Descending,
}

impl Into<CwOrder> for Order {
    fn into(self) -> CwOrder {
        match self {
            Order::Ascending => CwOrder::Ascending,
            Order::Descending => CwOrder::Descending,
        }
    }
}

#[cw_serde]
pub enum Bound {
    Inclusive(u64),
    Exclusive(u64),
}

impl Into<CwBound<'_, u64>> for Bound {
    fn into(self) -> CwBound<'static, u64> {
        match self {
            Bound::Inclusive(id) => CwBound::inclusive(id),
            Bound::Exclusive(id) => CwBound::exclusive(id),
        }
    }
}
