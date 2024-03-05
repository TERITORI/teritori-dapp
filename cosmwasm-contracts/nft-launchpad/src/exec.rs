use crate::{
    error::ContractError,
    msg::InstantiateMsg,
    state::{Collection, COLLECTIONS},
};
use cosmwasm_std::{DepsMut, Env, MessageInfo, Response, StdResult};

// Instantiate ==========================================================================
pub fn instantiate(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: InstantiateMsg,
) -> StdResult<Response> {
    Ok(Response::new())
}

// Executes =============================================================================
pub fn exec_create_collection(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    name: String,
    image_uri: String,
) -> Result<Response, ContractError> {
    // Validate data
    // -------------

    // Load last key
    let last_idx = match COLLECTIONS.last(deps.storage)? {
        Some((idx, _)) => idx,
        None => 0,
    };

    let new_idx = last_idx + 1;

    // Save data
    let collection = Collection {
        creator: info.sender,
        name,
        image_uri,
        merkle_root: None
    };

    COLLECTIONS.save(deps.storage, new_idx, &collection)?;

    Ok(Response::new()
        .add_attribute("action", "create_collection")
        .add_attribute("collection_idx", &new_idx.to_string()))
}

pub fn exec_update_collection(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _merkle_root: String,
) -> Result<Response, ContractError> {
    Ok(Response::new())
}
