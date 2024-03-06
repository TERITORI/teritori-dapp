use crate::{
    msg::{
        CollectionResp, MintPriceResp, MintableTokensResp, SupportedNetworksResp, TokenInfoResp, TokensMintedToUserResp,
    },
    state::COLLECTIONS,
};
use cosmwasm_std::{Addr, Deps, StdResult};

// Queries =============================================================================
pub fn query_collection(deps: Deps, addr: Addr) -> StdResult<CollectionResp> {
    let data = COLLECTIONS
        .may_load(deps.storage, addr.to_string())?
        .unwrap();
    Ok(CollectionResp {
        name: data.name,
        cover_img_uri: data.cover_img_uri,
        desc: data.desc,
        symbol: data.symbol,
    })
}

pub fn query_mint_price(deps: Deps, addr: Addr) -> StdResult<MintPriceResp> {
    let data = COLLECTIONS
        .may_load(deps.storage, addr.to_string())?
        .unwrap();

    Ok(MintPriceResp {
        expected_public_mint_price: data.expected_public_mint_price,
        unit_price: data.unit_price,
        whitelist_unit_price: data.whitelist_unit_price,
    })
}

pub fn query_mintable_tokens(deps: Deps, addr: Addr) -> StdResult<MintableTokensResp> {
    Ok(MintableTokensResp { count: 1 })
}

pub fn query_supported_networks(deps: Deps) -> StdResult<SupportedNetworksResp> {
    Ok(SupportedNetworksResp { networks: vec![] })
}

pub fn query_token_info(deps: Deps, addr: Addr, token_id: u128) -> StdResult<TokenInfoResp> {
    Ok(TokenInfoResp {
        id: String::from("1"),
        name: String::from("test"),
    })
}

pub fn query_tokens_minted_to_user(deps: Deps, addr: Addr, user_addr: Addr) -> StdResult<TokensMintedToUserResp> {
    Ok(TokensMintedToUserResp {
        count: 1
    })
}
