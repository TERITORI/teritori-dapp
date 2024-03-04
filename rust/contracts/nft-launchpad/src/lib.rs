use contract::{exec_create_collection, exec_update_collection, query_collection};
use cosmwasm_std::{
    entry_point, to_json_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult,
};
use error::ContractError;
use msg::{ExecMsg, InstantiateMsg, QueryMsg};

mod contract;
mod error;
pub mod msg;
mod state;
mod tests;

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
    contract::instantiate(deps, env, info, msg)
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::Collection { idx } => to_json_binary(&query_collection(deps, idx)?),
    }
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecMsg::CreateCollection { name, image_uri } => {
            exec_create_collection(deps, env, info, name, image_uri)
        }
        ExecMsg::UpdateCollection { merkle_root } => {
            exec_update_collection(deps, env, info, merkle_root)
        }
    }
}
