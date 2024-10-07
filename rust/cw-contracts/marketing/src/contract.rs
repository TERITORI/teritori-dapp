use cosmwasm_std::{attr,Addr,
  Response, StdResult
};
use cosmwasm_schema::cw_serde;
use crate::error::ContractError;
use cw_storage_plus::{Item, Map};
use sylvia::{types::{ExecCtx, InstantiateCtx, QueryCtx},contract, entry_points};


#[cw_serde]
pub struct Banner {
  pub image: String,
  pub url: String,
}

#[cw_serde]
pub struct NewsAction {
  pub label: String,
  pub url: String,
}

#[cw_serde]
pub struct News {
  pub title: String,
  pub subtitle: String,
  pub text: String,
  pub image: String,
  pub actions: Option<Vec<NewsAction>>,
}

#[cw_serde]
pub struct Config {
  pub admin_addr: Addr,
}

pub struct MarketingContract {
    pub(crate) config: Item<'static, Config>,
    pub(crate) banners: Map<'static, u64, Banner>,
    pub(crate) news: Map<'static, u64, News>,
}

#[entry_points]
#[contract]
#[error(ContractError)]
impl MarketingContract {
  pub const fn new() -> Self {
    Self {
      config: Item::new("config"),
      banners: Map::new("banners"),
      news: Map::new("news"),
    }
  }

  #[msg(instantiate)]
  pub fn instantiate(&self, ctx: InstantiateCtx
    , admin_addr: String
  ) -> StdResult<Response> {
    let admin_addr = ctx.deps.api.addr_validate(admin_addr.as_str())?;
    self.config.save(ctx.deps.storage, &Config {admin_addr})?;
    Ok(Response::default())
  }

  #[msg(exec)]
  // Only the admin can execute it
  pub fn update_config(
    &self,
    ctx: ExecCtx,
    admin_addr: String,
  ) -> Result<Response, ContractError> {
    let attributes = vec![attr("action", "update_config")];
    self.config.update(ctx.deps.storage, |mut config| {
      // Permission check
      if ctx.info.sender != config.admin_addr {
        return Err(ContractError::Unauthorized);
      }
      // Validate and save the new admin_addr in config
        config.admin_addr = ctx.deps.api.addr_validate(admin_addr.as_str())?;

      Ok(config)
        })?;

        Ok(Response::new().add_attributes(attributes))
      }

      #[msg(exec)]
  // Only the admin can execute it
  pub fn update_banners(
    &self,
    ctx: ExecCtx,
    banners: Vec<Banner>,
  ) -> Result<Response, ContractError> {
    let attributes = vec![attr("action", "update_banners")];
    let config = self.config.load(ctx.deps.storage)?;
    // Permission check
    if ctx.info.sender != config.admin_addr {
        return Err(ContractError::Unauthorized);
    }
    // Replace all banners with the new ones
    self.banners.clear(ctx.deps.storage);
    for (index, banner) in banners.into_iter().enumerate() {
        self.banners.save(ctx.deps.storage, index as u64, &banner)?;
    }

    Ok(Response::new().add_attributes(attributes))
  }

  #[msg(exec)]
  // Only the admin can execute it
  pub fn update_news(
    &self,
    ctx: ExecCtx,
    news: Vec<News>,
  ) -> Result<Response, ContractError> {
    let attributes = vec![attr("action", "update_news")];
    let config = self.config.load(ctx.deps.storage)?;
    // Permission check
    if ctx.info.sender != config.admin_addr {
      return Err(ContractError::Unauthorized);
    }
    // Replace all news with the new ones
    self.news.clear(ctx.deps.storage);
    for (index, news_item) in news.into_iter().enumerate() {
        self.news.save(ctx.deps.storage, index as u64, &news_item)?;
    }

    Ok(Response::new().add_attributes(attributes))
  }

  #[msg(query)]
  pub fn get_config(&self, ctx: QueryCtx) -> StdResult<Config> {
    let config = self.config.load(ctx.deps.storage)?;
    Ok(config)
  }

  #[msg(query)]
  pub fn get_banners(&self, ctx: QueryCtx) -> StdResult<Vec<Banner>> {
    let banners: Vec<Banner> = self
    .banners
    .range(ctx.deps.storage, None, None, cosmwasm_std::Order::Ascending)
    .map(|item| item.map(|(_, banner)| banner))
    .collect::<StdResult<Vec<Banner>>>()?; 

    Ok(banners)
  }

  #[msg(query)]
  pub fn get_news(&self, ctx: QueryCtx) -> StdResult<Vec<News>> {
    let news: Vec<News> = self
    .news
    .range(ctx.deps.storage, None, None, cosmwasm_std::Order::Ascending)
    .map(|item| item.map(|(_, news_item)| news_item))
    .collect::<StdResult<Vec<News>>>()?; 

    Ok(news)
  }
}


