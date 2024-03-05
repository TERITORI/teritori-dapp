use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::Addr;

#[cw_serde]
pub struct InstantiateMsg {
    pub name: String
}

#[cw_serde]
pub enum ExecMsg {
    CreateCollection { 
        name: String,
        image_uri: String,
     },
    UpdateCollection { 
        merkle_root: String,
     },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(CollectionResp)]
    Collection { idx: u32 },
}

#[cw_serde]
pub struct CollectionResp {
    pub name: String,
    pub image_uri: String,
    pub merkle_root: Option<String>,
    pub creator: Addr,
}