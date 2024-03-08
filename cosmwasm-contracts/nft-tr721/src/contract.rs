use cosmwasm_std::Empty;
use cw2981_royalties::{error::ContractError, msg::Cw2981QueryMsg, Cw2981Contract, Extension};
use cw721_base::Cw721Contract;

pub type Tr721Contract<'a> = Cw721Contract<'a, Extension, Empty, Empty, Cw2981QueryMsg>;
pub type ExecuteMsg = cw721_base::ExecuteMsg<Extension, Empty>;
pub type QueryMsg = cw721_base::QueryMsg<Cw2981QueryMsg>;

// pub mod msg {
//     #[cw_serde]
//     #[derive(QueryResponses)]
// }

#[cfg(not(feature = "library"))]
pub mod entry {
    use super::*;

    use cosmwasm_std::entry_point;
    use cosmwasm_std::{Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult};
    use cw2981_royalties::error::ContractError;
    use cw2981_royalties::InstantiateMsg;

    #[entry_point]
    pub fn instantiate(
        mut deps: DepsMut,
        env: Env,
        info: MessageInfo,
        msg: InstantiateMsg,
    ) -> Result<Response, ContractError> {
        // cw2::set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

        Ok(Cw2981Contract::default().instantiate(deps.branch(), env, info, msg)?)
    }

    #[entry_point]
    pub fn execute(
        deps: DepsMut,
        env: Env,
        info: MessageInfo,
        msg: ExecuteMsg,
    ) -> Result<Response, ContractError> {
        match msg {
            _ => Cw2981Contract::default()
                .execute(deps, env, info, msg)
                .map_err(Into::into),
        }
    }

    #[entry_point]
    pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> StdResult<Binary> {
        match msg {
            _ => Cw2981Contract::default().query(deps, env, msg),
        }
    }
}
