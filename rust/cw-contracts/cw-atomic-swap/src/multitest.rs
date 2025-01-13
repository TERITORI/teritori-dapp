use cosmwasm_std::Addr;
use sylvia::multitest::App;

use crate::contract::sv::multitest_utils::CodeId;

#[test]
fn instantiate() {
    let app = App::default();
    let code_id = CodeId::store_code(&app);

    let owner = "owner";
    let owner_addr = Addr::unchecked(owner);

    let contract = code_id.instantiate(owner.to_string()).call(owner).unwrap();

    // TODO: test more
}
