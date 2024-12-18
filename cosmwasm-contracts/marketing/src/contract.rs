
use cosmwasm_std::{attr,Addr,
  Response, StdResult
};
use cosmwasm_schema::cw_serde;
use crate::error::ContractError;
use cw_storage_plus::{Item, Map};
use sylvia::{types::{ExecCtx, InstantiateCtx, QueryCtx},contract, entry_points};


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
  pub admin_addr: Addr,
}

pub struct MarketingContract {
    pub(crate) config: Item<'static, Config>,
    pub(crate) banners: Map<'static, u64, Banner>,
    pub(crate) news: Map<'static, u64, News>,
    pub(crate) upcoming_collections: Map<'static, u64, MarketingCollectionPreview>,
    pub(crate) live_collections: Map<'static, u64, MarketingCollectionPreview>,
    pub(crate) highlighted_collections: Map<'static, u64, MarketingCollectionPreview>,
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
      upcoming_collections: Map::new("upcoming_collections"),
      live_collections: Map::new("live_collections"),
      highlighted_collections: Map::new("highlighted_collections"),
    }
  }

  #[msg(instantiate)]
  pub fn instantiate(&self, ctx: InstantiateCtx
                     , config: Config
                     , banners: Vec<Banner>
                     , news: Vec<News>
                     , upcoming_collections: Vec<MarketingCollectionPreview>
                     , live_collections: Vec<MarketingCollectionPreview>
                     , highlighted_collections: Vec<MarketingCollectionPreview>
  ) -> StdResult<Response> {
    self.config.save(ctx.deps.storage, &config)?;
    for (index, banner) in banners.into_iter().enumerate() {
      self.banners.save(ctx.deps.storage, index as u64, &banner)?;
    }
    for (index, news_item) in news.into_iter().enumerate() {
      self.news.save(ctx.deps.storage, index as u64, &news_item)?;
    }
    for (index, upcoming_collection) in upcoming_collections.into_iter().enumerate() {
      self.upcoming_collections.save(ctx.deps.storage, index as u64, &upcoming_collection)?;
    }
    for (index, live_collection) in live_collections.into_iter().enumerate() {
      self.live_collections.save(ctx.deps.storage, index as u64, &live_collection)?;
    }
    for (index, highlighted_collection) in highlighted_collections.into_iter().enumerate() {
      self.highlighted_collections.save(ctx.deps.storage, index as u64, &highlighted_collection)?;
    }
    Ok(Response::default())
  }

  #[msg(exec)]
  // Only the admin can execute it
  pub fn update_config(
    &self,
    ctx: ExecCtx,
    admin_addr: Option<Addr>,
  ) -> Result<Response, ContractError> {
    let attributes = vec![attr("action", "update_config")];
    self.config.update(ctx.deps.storage, |mut config| {
      // Permission check
      if ctx.info.sender != config.admin_addr {
        return Err(ContractError::Unauthorized);
      }
      // Validate and save the new admin_addr in config
      if let Some(admin_addr) = admin_addr {
        config.admin_addr = ctx.deps.api.addr_validate(admin_addr.as_str())?;
      }

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

  #[msg(exec)]
  // Only the admin can execute it
  pub fn update_live_collections(
    &self,
    ctx: ExecCtx,
    live_collections: Vec<MarketingCollectionPreview>,
  ) -> Result<Response, ContractError> {
    let attributes = vec![attr("action", "update_live_collections")];
    let config = self.config.load(ctx.deps.storage)?;
    // Permission check
    if ctx.info.sender != config.admin_addr {
      return Err(ContractError::Unauthorized);
    }
    // Replace all live_collections with the new ones
    self.live_collections.clear(ctx.deps.storage);
    for (index, live_collection) in live_collections.into_iter().enumerate() {
        self.live_collections.save(ctx.deps.storage, index as u64, &live_collection)?;
    }

    Ok(Response::new().add_attributes(attributes))
  }

  #[msg(exec)]
  // Only the admin can execute it
  pub fn update_upcoming_collections(
    &self,
    ctx: ExecCtx,
    upcoming_collections: Vec<MarketingCollectionPreview>,
  ) -> Result<Response, ContractError> {
    let attributes = vec![attr("action", "update_upcoming_collections")];
    let config = self.config.load(ctx.deps.storage)?;
    // Permission check
    if ctx.info.sender != config.admin_addr {
      return Err(ContractError::Unauthorized);
    }
    // Replace all upcoming_collections with the new ones
    self.upcoming_collections.clear(ctx.deps.storage);
    for (index, upcoming_collection) in upcoming_collections.into_iter().enumerate() {
        self.upcoming_collections.save(ctx.deps.storage, index as u64, &upcoming_collection)?;
    }

    Ok(Response::new().add_attributes(attributes))
  }

  #[msg(exec)]
  // Only the admin can execute it
  pub fn update_highlighted_collections(
    &self,
    ctx: ExecCtx,
    highlighted_collections: Vec<MarketingCollectionPreview>,
  ) -> Result<Response, ContractError> {
    let attributes = vec![attr("action", "update_highlighted_collections")];
    let config = self.config.load(ctx.deps.storage)?;
    // Permission check
    if ctx.info.sender != config.admin_addr {
      return Err(ContractError::Unauthorized);
    }
    // Replace all highlighted_collections with the new ones
    self.highlighted_collections.clear(ctx.deps.storage);
    for (index, highlighted_collection) in highlighted_collections.into_iter().enumerate() {
        self.highlighted_collections.save(ctx.deps.storage, index as u64, &highlighted_collection)?;
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

  #[msg(query)]
  pub fn get_live_collections(&self, ctx: QueryCtx) -> StdResult<Vec<MarketingCollectionPreview>> {
    let live_collections: Vec<MarketingCollectionPreview> = self
    .live_collections
    .range(ctx.deps.storage, None, None, cosmwasm_std::Order::Ascending)
    .map(|item| item.map(|(_, live_collection)| live_collection))
    .collect::<StdResult<Vec<MarketingCollectionPreview>>>()?; 
      
    Ok(live_collections)
  }

  #[msg(query)]
  pub fn get_upcoming_collections(&self, ctx: QueryCtx) -> StdResult<Vec<MarketingCollectionPreview>> {
    let upcoming_collections: Vec<MarketingCollectionPreview> = self
    .upcoming_collections
    .range(ctx.deps.storage, None, None, cosmwasm_std::Order::Ascending)
    .map(|item| item.map(|(_, upcoming_collection)| upcoming_collection))
    .collect::<StdResult<Vec<MarketingCollectionPreview>>>()?;     
  
    Ok(upcoming_collections)
  }

  #[msg(query)]
  pub fn get_highlighted_collections(&self, ctx: QueryCtx) -> StdResult<Vec<MarketingCollectionPreview>> {
    let highlighted_collections: Vec<MarketingCollectionPreview> = self
    .highlighted_collections
    .range(ctx.deps.storage, None, None, cosmwasm_std::Order::Ascending)
    .map(|item| item.map(|(_, highlighted_collection)| highlighted_collection))
    .collect::<StdResult<Vec<MarketingCollectionPreview>>>()?; 
    
    Ok(highlighted_collections)
  }
}


