use crate::error::ContractError;
use cosmwasm_schema::cw_serde;
use cosmwasm_std::{Addr, Order as CwOrder, Response, StdResult};
use cw_storage_plus::{Bound as CwBound, Item, Map};
use sylvia::types::{ExecCtx, InstantiateCtx, QueryCtx};
use sylvia::{contract, entry_points};

pub struct AddressListContract {
    pub(crate) admin: Item<'static, Option<Addr>>,
    pub(crate) addresses: Map<'static, Addr, ()>,
}

pub const QUERY_BATCH_MAX_LIMIT: u32 = 50;

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
    Inclusive(String),
    Exclusive(String),
}

impl Into<CwBound<'_, Addr>> for Bound {
    fn into(self) -> CwBound<'static, Addr> {
        match self {
            Bound::Inclusive(addr) => CwBound::inclusive(Addr::unchecked(addr)),
            Bound::Exclusive(addr) => CwBound::exclusive(Addr::unchecked(addr)),
        }
    }
}

#[entry_points]
#[contract]
#[error(ContractError)]
impl AddressListContract {
    pub const fn new() -> Self {
        Self {
            admin: Item::new("admin_v0"),
            addresses: Map::new("addresses_v0"),
        }
    }

    #[msg(instantiate)]
    pub fn instantiate(&self, ctx: InstantiateCtx, admin: String) -> StdResult<Response> {
        let admin = ctx.deps.api.addr_validate(admin.as_str())?;
        self.admin.save(ctx.deps.storage, &Some(admin))?;
        Ok(Response::default())
    }

    // Mutations

    #[msg(exec)]
    pub fn add(&self, ctx: ExecCtx, addr: String) -> Result<Response, ContractError> {
        self.assert_admin(&ctx)?;

        let addr = ctx.deps.api.addr_validate(addr.as_str())?;

        self.addresses
            .update(ctx.deps.storage, addr.clone(), |value| match value {
                Some(_) => return Err(ContractError::AddressAlreadyRegistered),
                None => Ok(()),
            })?;

        return Ok(Response::new()
            .add_attribute("action", "add")
            .add_attribute("added_addr", addr));
    }

    #[msg(exec)]
    pub fn remove(&self, ctx: ExecCtx, addr: String) -> Result<Response, ContractError> {
        self.assert_admin(&ctx)?;

        let addr = ctx.deps.api.addr_validate(addr.as_str())?;

        if !self.addresses.has(ctx.deps.storage, addr.clone()) {
            return Err(ContractError::AddressNotRegistered);
        }

        self.addresses.remove(ctx.deps.storage, addr.clone());

        return Ok(Response::new()
            .add_attribute("action", "remove")
            .add_attribute("added_addr", addr));
    }

    #[msg(exec)]
    pub fn change_admin(
        &self,
        ctx: ExecCtx,
        addr: Option<String>,
    ) -> Result<Response, ContractError> {
        self.assert_admin(&ctx)?;

        let admin = self.admin.load(ctx.deps.storage)?;

        let opt = match addr {
            Some(addr) => {
                let addr = ctx.deps.api.addr_validate(addr.as_str())?;
                if admin == Some(addr.clone()) {
                    return Err(ContractError::AlreadyAdmin);
                }
                Some(addr)
            }
            None => None,
        };

        self.admin.save(ctx.deps.storage, &opt)?;

        Ok(Response::default())
    }

    fn assert_admin(&self, ctx: &ExecCtx) -> Result<(), ContractError> {
        let admin = self.admin.load(ctx.deps.storage)?;
        match admin {
            Some(admin) => {
                if admin != ctx.info.sender {
                    Err(ContractError::Unauthorized)
                } else {
                    Ok(())
                }
            }
            None => Err(ContractError::Unauthorized),
        }
    }

    // Queries

    #[msg(query)]
    pub fn admin(&self, ctx: QueryCtx) -> Result<Option<Addr>, ContractError> {
        let admin = self.admin.load(ctx.deps.storage)?;
        Ok(admin)
    }

    #[msg(query)]
    pub fn addresses(
        &self,
        ctx: QueryCtx,
        min: Option<Bound>,
        max: Option<Bound>,
        order: Option<Order>,
        limit: Option<u32>,
    ) -> Result<Vec<Addr>, ContractError> {
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

        let addrs: Result<Vec<_>, _> = self
            .addresses
            .range(
                ctx.deps.storage,
                min.map(|m| m.into()),
                max.map(|m| m.into()),
                order.into(),
            )
            .take(limit as usize)
            .map(|item| -> Result<Addr, ContractError> {
                let (addr, _) = item?;
                Ok(addr)
            })
            .collect();
        Ok(addrs?)
    }
}
