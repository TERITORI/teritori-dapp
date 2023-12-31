use std::collections::BTreeMap;

use cosmwasm_schema::cw_serde;
use cosmwasm_std::{Addr, BankMsg, Coin, Response, StdError, StdResult, Storage, Uint128, Uint512};
use cw_storage_plus::{Bound, Item, Map};
use sha3::{Digest, Sha3_224};
use sylvia::types::{ExecCtx, InstantiateCtx, QueryCtx};
use sylvia::{contract, entry_points};

use crate::error::ContractError;

// TODO: optimize

#[cw_serde]
pub struct Config {
    pub owner: Addr,
    pub max_tickets: u16,
    pub ticket_price: Coin,
    pub fee_per10k: u16, // 0-10_000
    pub stopped: bool,
}

#[cw_serde]
pub struct Info {
    pub config: Config,
    pub current_tickets_count: u16,
}

pub struct RakkiContract {
    pub(crate) current_tickets: Map<'static, u16, Addr>,
    pub(crate) current_entropy: Item<'static, Uint512>,
    pub(crate) fees: Item<'static, Uint128>,
    pub(crate) config: Item<'static, Config>,
    pub(crate) history: Map<'static, u64, Addr>,
}

#[entry_points]
#[contract]
#[error(ContractError)]
impl RakkiContract {
    pub const fn new() -> Self {
        Self {
            current_tickets: Map::new("current_tickets"),
            current_entropy: Item::new("current_entropy"),
            fees: Item::new("fees"),
            config: Item::new("config"),
            history: Map::new("history"),
        }
    }

    #[msg(instantiate)]
    pub fn instantiate(
        &self,
        ctx: InstantiateCtx,
        owner: String,
        max_tickets: u16,
        ticket_price: Coin,
        fee_per10k: u16,
    ) -> StdResult<Response> {
        if max_tickets == 0 {
            return Err(StdError::generic_err("max_tickets must be positive"));
        }
        if ticket_price.denom == "" {
            return Err(StdError::generic_err(
                "ticket_price denom must be non-empty",
            ));
        }
        if ticket_price.amount.is_zero() {
            return Err(StdError::generic_err(
                "ticket_price amount must be positive",
            ));
        }
        let owner = ctx.deps.api.addr_validate(&owner)?;
        self.config.save(
            ctx.deps.storage,
            &Config {
                owner,
                max_tickets,
                ticket_price: ticket_price.to_owned(),
                fee_per10k,
                stopped: false,
            },
        )?;
        self.current_entropy
            .save(ctx.deps.storage, &Uint512::zero())?;
        self.fees.save(ctx.deps.storage, &Uint128::zero())?;
        Ok(Response::default())
    }

    #[msg(exec)]
    pub fn buy_ticket(&self, ctx: ExecCtx, entropy: bool) -> StdResult<Response> {
        let config = self.config.load(ctx.deps.storage)?;

        if ctx.info.funds.len() != 1 {
            return Err(StdError::generic_err("must pay with exactly one coin"));
        }
        let funds = ctx.info.funds.get(0).unwrap();
        let total_price = config.ticket_price.amount;
        if funds != &Coin::new(total_price.into(), config.ticket_price.denom.to_owned()) {
            return Err(StdError::generic_err("must pay exactly ticket_price"));
        }

        let offset = self.tickets_count(ctx.deps.storage)?;

        self.current_tickets
            .save(ctx.deps.storage, offset, &ctx.info.sender)?;

        // FIXME: find a better/stronger way to accumulate entropy
        let final_entropy = self.current_entropy.update(
            ctx.deps.storage,
            |current_entropy| -> Result<Uint512, StdError> {
                Ok((current_entropy << 1)
                    + if entropy {
                        Uint512::one()
                    } else {
                        Uint512::zero()
                    })
            },
        )?;

        if offset + 1 != config.max_tickets {
            // not enough tickets, wait for more
            return Ok(Response::default());
        }

        // run draw

        // prevent to run two draws in same second to not break history
        let last_history = self.history.last(ctx.deps.storage)?;
        let now = ctx.env.block.time.seconds();
        if let Some(last_history) = last_history {
            if last_history.0 == now {
                return Err(StdError::generic_err(
                    "cannot run two draws in the same block",
                ));
            }
        }

        // pick winner
        // FIXME: calculate game theory of cheating
        let mut hasher = Sha3_224::new();
        hasher.update(final_entropy.to_be_bytes());
        let hash = hasher.finalize();
        let hash_index = u16::from_be_bytes(hash[0..2].try_into().unwrap());
        let winner_index = hash_index % config.max_tickets;
        let winner = self.current_tickets.load(ctx.deps.storage, winner_index)?;

        // split rewards
        let total_reward = config
            .ticket_price
            .amount
            .checked_mul(Uint128::from(config.max_tickets))?;
        let fee = total_reward
            .checked_mul(Uint128::from(config.fee_per10k))?
            .checked_div(Uint128::from(10_000u128))?;
        let winner_reward = total_reward.checked_sub(fee)?;

        // save fees
        self.fees
            .update(ctx.deps.storage, |fees| -> StdResult<Uint128> {
                Ok(fees.checked_add(fee)?)
            })?;

        // reset state
        self.current_entropy
            .save(ctx.deps.storage, &Uint512::zero())?;
        self.current_tickets.clear(ctx.deps.storage);

        // update history
        self.history.save(ctx.deps.storage, now, &winner)?;

        // send reward
        Ok(Response::default().add_message(BankMsg::Send {
            to_address: winner.into(),
            amount: vec![Coin::new(winner_reward.into(), config.ticket_price.denom)],
        }))
    }

    // TODO: switch to treasury address in config + send with callback message emitted on draw
    #[msg(exec)]
    pub fn withdraw_fees(&self, ctx: ExecCtx, destination: String) -> StdResult<Response> {
        let config = self.config.load(ctx.deps.storage)?;
        if ctx.info.sender != config.owner {
            return Err(StdError::generic_err("only owner can withdraw"));
        }
        let destination = ctx.deps.api.addr_validate(&destination)?;
        let fees = self.fees.load(ctx.deps.storage)?;
        if fees.is_zero() {
            return Err(StdError::generic_err("no fees collected"));
        }
        self.fees.save(ctx.deps.storage, &Uint128::zero())?;
        return Ok(Response::default().add_message(BankMsg::Send {
            to_address: destination.into(),
            amount: vec![Coin::new(fees.into(), config.ticket_price.denom)],
        }));
    }

    #[msg(exec)]
    pub fn stop(&self, ctx: ExecCtx) -> StdResult<Response> {
        let config = self.config.load(ctx.deps.storage)?;
        if ctx.info.sender != config.owner {
            return Err(StdError::generic_err("only owner can stop"));
        }
        if config.stopped {
            return Err(StdError::generic_err("already stopped"));
        }
        self.config
            .update(ctx.deps.storage, |mut config| -> StdResult<Config> {
                config.stopped = true;
                return Ok(config);
            })?;
        let mut funds_by_address = BTreeMap::<Addr, Uint128>::new();
        for r in
            self.current_tickets
                .range(ctx.deps.storage, None, None, cosmwasm_std::Order::Ascending)
        {
            let (_, addr) = r?;
            let rf = funds_by_address.get(&addr);
            funds_by_address.insert(
                addr,
                rf.unwrap_or(&Uint128::zero())
                    .checked_add(config.ticket_price.amount)?,
            );
        }
        let msgs = funds_by_address
            .into_iter()
            .map(|(addr, amount)| BankMsg::Send {
                to_address: addr.into(),
                amount: vec![Coin::new(amount.into(), config.ticket_price.denom.clone())],
            });
        Ok(Response::default().add_messages(msgs))
    }

    #[msg(exec)]
    pub fn change_owner(&self, ctx: ExecCtx, new_owner: String) -> StdResult<Response> {
        let config = self.config.load(ctx.deps.storage)?;
        if ctx.info.sender != config.owner {
            return Err(StdError::generic_err("only owner can change owner"));
        }
        let new_owner = ctx.deps.api.addr_validate(&new_owner)?;
        self.config
            .update(ctx.deps.storage, |mut config| -> StdResult<Config> {
                config.owner = new_owner;
                return Ok(config);
            })?;
        Ok(Response::default())
    }

    #[msg(query)]
    pub fn info(&self, ctx: QueryCtx) -> StdResult<Info> {
        let config = self.config.load(ctx.deps.storage)?;
        let tickets_count = self.tickets_count(ctx.deps.storage)?;
        return Ok(Info {
            config,
            current_tickets_count: tickets_count,
        });
    }

    #[msg(query)]
    pub fn history(
        &self,
        ctx: QueryCtx,
        limit: u16,
        cursor: Option<u64>,
    ) -> StdResult<Vec<(u64, Addr)>> {
        if limit == 0 {
            return Err(StdError::generic_err("limit must be positive"));
        }
        let entries = self
            .history
            .range(
                ctx.deps.storage,
                None,
                cursor.map(|val| Bound::exclusive(val)),
                cosmwasm_std::Order::Descending,
            )
            .take(limit as usize)
            .collect();
        return entries;
    }

    fn tickets_count(&self, storage: &dyn Storage) -> StdResult<u16> {
        return Ok(self
            .current_tickets
            .last(storage)?
            .map(|pair| pair.0 + 1)
            .unwrap_or(0u16));
    }
}
