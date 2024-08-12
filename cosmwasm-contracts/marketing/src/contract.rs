use cosmwasm_schema::cw_serde;
use cw_storage_plus::{Map, Item};
use sylvia::{
  contract, entry_points,
  types::{ExecCtx, InstantiateCtx, QueryCtx},
};

pub struct MarketingContract {
    pub(crate) config: Item<Config>,
    pub(crate) banners: Map<u64, Banner>,
    pub(crate) news: Map<u64, News>,
    pub(crate) upcoming_collections: Map<u64, MarketingCollectionPreview>,
    pub(crate) live_collections: Map<u64, MarketingCollectionPreview>,
}

#[entry_points]
#[contract]
impl MarketingContract {
  pub const fn new() -> Self {
    Self {
      config: Item::new("config"),
      banners: Map::new("banners"),
      news: Map::new("news"),
      upcoming_collections: Map::new("upcoming_collections"),
      live_collections: Map::new("live_collections"),
    }
  }

  #[msg(instantiate)]
  pub fn instantiate(&self, ctx: InstantiateCtx
                     , config: Config
                     , banners: Option<Vec<Banner>>
                     , news: Option<Vec<News>>
                     , upcoming_collections: Option<Vec<MarketingCollectionPreview>>
                     , live_collections: Option<Vec<MarketingCollectionPreview>>
  ) -> StdResult<Response> {
    self.config.save(deps.storage, &config)?;
    self.banners.save(deps.storage, &banners)?;
    self.news.save(deps.storage, &news)?;
    self.upcoming_collections.save(deps.storage, &upcoming_collections)?;
    self.live_collections.save(deps.storage, &live_collections)?;

    Ok(Response::default())
  }

  #[msg(exec)]
  // Only the admin can execute it
  pub fn update_config(
    &self,
    ctx: ExecCtx,
    config: Config,
  ) -> Result<Response, ContractError> {
    let mut current_config = self.config.load(ctx.deps.storage)?;
    let mut attributes = vec![attr("action", "update_config")];
    // Permission check
    if ctx.info.sender != current_config.admin_addr {
      return Err(ContractError::Unauthorized);
    }
    // Validate new admin address and save it
    if let Some(admin_addr) = config.admin_addr {
      current_config.admin_addr = ctx.deps.api.addr_validate(&admin_addr)?;
      attributes.push(attr("new_admin_addr", admin_addr))
    }
    self.config.save(ctx.deps.storage, &current_config)?;

    Ok(Response::new().add_attributes(attributes))
  }

  #[msg(exec)]
  // Only the admin can execute it
  pub fn update_banners(
    &self,
    ctx: ExecCtx,
    banners: Vec<Banners>,
  ) -> Result<Response, ContractError> {
    let mut attributes = vec![attr("action", "update_banners")];
    // Permission check
    if ctx.info.sender != config.admin_addr {
      return Err(ContractError::Unauthorized);
    }
    self.banners.save(ctx.deps.storage, &banners)?;

    Ok(Response::new().add_attributes(attributes))
  }

  #[msg(exec)]
  // Only the admin can execute it
  pub fn update_news(
    &self,
    ctx: ExecCtx,
    news: Vec<News>,
  ) -> Result<Response, ContractError> {
    let mut attributes = vec![attr("action", "update_news")];
    // Permission check
    if ctx.info.sender != config.admin_addr {
      return Err(ContractError::Unauthorized);
    }
    self.news.save(ctx.deps.storage, &news)?;

    Ok(Response::new().add_attributes(attributes))
  }

  #[msg(exec)]
  // Only the admin can execute it
  pub fn update_live_collections(
    &self,
    ctx: ExecCtx,
    collections: Vec<News>,
  ) -> Result<Response, ContractError> {
    let mut attributes = vec![attr("action", "update_live_collections")];
    // Permission check
    if ctx.info.sender != config.admin_addr {
      return Err(ContractError::Unauthorized);
    }
    self.live_collections.save(ctx.deps.storage, &collections)?;

    Ok(Response::new().add_attributes(attributes))
  }

  #[msg(exec)]
  // Only the admin can execute it
  pub fn update_upcoming_collections(
    &self,
    ctx: ExecCtx,
    collections: Vec<News>,
  ) -> Result<Response, ContractError> {
    let mut attributes = vec![attr("action", "update_upcoming_collections")];
    // Permission check
    if ctx.info.sender != config.admin_addr {
      return Err(ContractError::Unauthorized);
    }
    self.upcoming_collections.save(ctx.deps.storage, &collections)?;

    Ok(Response::new().add_attributes(attributes))
  }

  #[msg(query)]
  pub fn get_config(&self, ctx: QueryCtx) -> StdResult<Config> {
    let config = self.config.load(ctx.deps.storage)?;
    Ok(config)
  }

  #[msg(query)]
  pub fn get_banners(&self, ctx: QueryCtx) -> StdResult<Vec<Banner>> {
    let banners = self.banners.load(ctx.deps.storage)?;
    Ok(banners)
  }

  #[msg(query)]
  pub fn get_news(&self, ctx: QueryCtx) -> StdResult<Vec<News>> {
    let news = self.news.load(ctx.deps.storage)?;
    Ok(news)
  }

  #[msg(query)]
  pub fn get_live_collections(&self, ctx: QueryCtx) -> StdResult<Vec<MarketingCollectionPreview>> {
    let live_collections = self.live_collections.load(ctx.deps.storage)?;
    Ok(live_collections)
  }

  #[msg(query)]
  pub fn get_upcoming_collections(&self, ctx: QueryCtx) -> StdResult<Vec<MarketingCollectionPreview>> {
    let upcoming_collections = self.upcoming_collections.load(ctx.deps.storage)?;
    Ok(upcoming_collections)
  }
}

#[cw_serde]
pub struct Banner {
    image: String,
    url: String,
}

#[cw_serde]
pub struct Action {
    label: String,
    url: String,
}

#[cw_serde]
pub struct News {
    title: String,
    subtitle: String,
    text: String,
    image: String,
    actions: Option<Action>,
}

#[cw_serde]
pub struct MarketingCollectionPreview {
    address: String,
    image_uri: String,
    collection_name: String,
    creator_name: String,
    twitter_url: String,
    secondary_during_mint: bool,
}

#[cw_serde]
pub struct Config {
  pub admin_addr: String,
}


