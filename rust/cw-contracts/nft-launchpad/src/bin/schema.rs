use cosmwasm_schema::write_api;
use nft_launchpad::contract::sv::{ExecMsg, InstantiateMsg, QueryMsg};

fn main() {
    write_api! {
        instantiate: InstantiateMsg,
        execute: ExecMsg,
        query: QueryMsg,
    }
}
