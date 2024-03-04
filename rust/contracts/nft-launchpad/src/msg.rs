use cosmwasm_schema::{cw_serde, QueryResponses};

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
    #[returns(CollectionResponse)]
    Collection { idx: u32 },
}

#[cw_serde]
struct CollectionResponse {
    name: String,
    image_uri: String,
    merkle_root: String,
}