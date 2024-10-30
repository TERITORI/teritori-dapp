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

    let admin = contract.admin().unwrap();
    assert_eq!(admin, Some(owner_addr));

    let addrs = contract.addresses(None, None, None, None).unwrap();
    assert_eq!(addrs, Vec::<Addr>::new());

    let col1 = "col1";
    let col1_addr = Addr::unchecked(col1);
    contract.add(col1.to_string()).call(owner).unwrap();
    let addrs = contract.addresses(None, None, None, None).unwrap();
    assert_eq!(addrs, vec![col1_addr.clone()]);

    let col2 = "col2";
    let col2_addr = Addr::unchecked(col2);
    contract.add(col2.to_string()).call(owner).unwrap();
    let addrs = contract.addresses(None, None, None, None).unwrap();
    assert_eq!(addrs, vec![col1_addr.clone(), col2_addr.clone()]);
    let addrs = contract
        .addresses(None, None, Some(crate::contract::Order::Descending), None)
        .unwrap();
    assert_eq!(addrs, vec![col2_addr.clone(), col1_addr.clone()]);

    let addrs = contract.addresses(None, None, None, Some(1)).unwrap();
    assert_eq!(addrs, vec![col1_addr.clone()]);

    let addrs = contract
        .addresses(
            Some(crate::contract::Bound::Exclusive(col1.to_string())),
            None,
            None,
            None,
        )
        .unwrap();
    assert_eq!(addrs, vec![col2_addr.clone()]);

    contract.remove(col1.to_string()).call(owner).unwrap();
    let addrs = contract.addresses(None, None, None, None).unwrap();
    assert_eq!(addrs, vec![col2_addr]);

    contract.remove(col2.to_string()).call(owner).unwrap();
    let addrs = contract.addresses(None, None, None, None).unwrap();
    assert_eq!(addrs, Vec::<Addr>::new());
}
