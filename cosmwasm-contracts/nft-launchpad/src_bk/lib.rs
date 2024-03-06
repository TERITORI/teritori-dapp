use cosmwasm_std::{
    entry_point, to_json_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult,
};
use error::ContractError;
use exec::{exec_create_collection, exec_update_collection};
use msg::{ExecMsg, InstantiateMsg, QueryMsg};
use query::{
    query_collection, query_mint_price, query_mintable_tokens, query_supported_networks,
    query_token_info, query_tokens_minted_to_user,
};

pub mod msg;

mod error;
mod exec;
mod query;
mod state;
mod tests;

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
    exec::instantiate(deps, env, info, msg)
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::Collection { addr } => to_json_binary(&query_collection(deps, addr)?),
        QueryMsg::MintPrice { collection_addr } => {
            to_json_binary(&query_mint_price(deps, collection_addr)?)
        }
        QueryMsg::MintableTokens { collection_addr } => {
            to_json_binary(&query_mintable_tokens(deps, collection_addr)?)
        }
        QueryMsg::SupportedNetworks {} => to_json_binary(&query_supported_networks(deps)?),
        QueryMsg::TokenInfo {
            collection_addr,
            token_id,
        } => to_json_binary(&query_token_info(deps, collection_addr, token_id)?),
        QueryMsg::TokensMintedToUser {
            collection_addr,
            user_addr,
        } => to_json_binary(&query_tokens_minted_to_user(
            deps,
            collection_addr,
            user_addr,
        )?),
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
        ExecMsg::CreateCollection {
            name,
            desc,
            symbol,
            cover_img_uri,
            target_network,
            external_link,

            // Collection details ----------------------------
            website_link,

            twitter_profile,
            twitter_followers_count,

            contact_discord_name,
            contact_email,

            is_project_derivative,

            project_type,
            project_desc,

            is_applied_previously,

            // Team info --------------------------------------
            team_desc,
            team_link,

            partners,

            invested_amount,
            investment_link,

            whitepaper_link,
            roadmap_link,

            // Additional info ----------------------------
            artwork_desc,

            is_ready_for_mint,

            expected_supply,
            expected_public_mint_price,
            expected_mint_date,

            escrow_mint_proceeds_period,
            dox_state,

            dao_whitelist_count,

            // Minting details ----------------------------
            tokens_count,
            unit_price,
            limit_per_address,
            start_time,

            // Whitelist minting --------------------------
            whitelist_addresses,

            whitelist_unit_price,
            whitelist_limit_per_address,
            whitelist_member_limit,
            whitelist_start_time,
            whitelist_end_time,

            // Royalty --------------------------
            royalty_address,
            royalty_percentage,

            // Extend info --------------------------
            base_token_uri,
        } => exec_create_collection(deps, env, info, msg),
        ExecMsg::UpdateCollection { merkle_root } => {
            exec_update_collection(deps, env, info, merkle_root)
        }
    }
}
