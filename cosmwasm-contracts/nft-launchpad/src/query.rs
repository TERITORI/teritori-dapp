use crate::{msg::CollectionResp, state::COLLECTIONS};
use cosmwasm_std::{Deps, StdResult};

// Queries =============================================================================
pub fn query_collection(deps: Deps, idx: u32) -> StdResult<CollectionResp> {
    let data = COLLECTIONS.may_load(deps.storage, idx)?.unwrap();
    Ok(CollectionResp {
        name: data.name,
        image_uri: data.image_uri,
        merkle_root: data.merkle_root,
        creator: data.creator
    })
}
