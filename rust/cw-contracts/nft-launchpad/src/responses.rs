use cosmwasm_schema::cw_serde;

#[cw_serde]
pub struct TokensMintedToUserResp {
    pub count: u128,
}

#[cw_serde]
pub struct MintableTokensResp {
    pub count: u128,
}

#[cw_serde]
pub struct MintPriceResp {
    pub expected_public_mint_price: u128,
    pub unit_price: u128,
    pub whitelist_unit_price: u128,
}

#[cw_serde]
pub struct CollectionResp {
    pub name: String,
    pub cover_img_uri: String,
    pub desc: String,
    pub symbol: String,
}
