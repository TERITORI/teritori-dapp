use cosmwasm_schema::write_api;

use nft_launchpad::msg::{ExecMsg, InstantiateMsg, QueryMsg};

fn main() {
    write_api! {
        instantiate: InstantiateMsg,
        execute: ExecMsg,
        query: QueryMsg,
    }
}