use cosmwasm_std::{Addr, Binary};
use sylvia::multitest::App;

use crate::{contract::multitest_utils::CodeId, error::ContractError};

#[test]
fn basic_full_flow() {
    let app = App::default();
    let code_id = CodeId::store_code(&app);

    let user = "user";
    let admin = "admin";
    let contract_creator = "creator";
    let authorized_collection = "collection";
    let authorized_collection_2 = "collection_2";
    let unauthorized_collection = "unauthorized_collection";
    let token_id = "token_id";
    let init_authorized_collections = vec![authorized_collection.to_string()];

    let contract = code_id
        .instantiate(
            Some(admin.to_string()),
            init_authorized_collections.to_owned(),
        )
        .call(contract_creator)
        .unwrap();

    let ownership = contract.ownership().unwrap();
    assert_eq!(ownership.owner, Some(Addr::unchecked(admin)));

    let authorized_collections = contract.authorized_collections(10, 0).unwrap();
    assert_eq!(authorized_collections, init_authorized_collections);

    let res = contract
        .authorize_collections(vec![authorized_collection_2.to_string()])
        .call(user);
    assert_eq!(
        res.err(),
        Some(ContractError::OwnershipError(
            cw_ownable::OwnershipError::NotOwner
        ))
    );

    contract
        .authorize_collections(vec![authorized_collection_2.to_string()])
        .call(admin)
        .unwrap();

    let authorized_collections = contract.authorized_collections(10, 0).unwrap();
    assert_eq!(
        authorized_collections,
        vec![authorized_collection, authorized_collection_2]
    );

    let authorized_collections = contract.authorized_collections(1, 0).unwrap();
    assert_eq!(authorized_collections, vec![authorized_collection]);

    let authorized_collections = contract.authorized_collections(1, 1).unwrap();
    assert_eq!(authorized_collections, vec![authorized_collection_2]);

    contract
        .receive_nft(user.to_string(), token_id.to_string(), Binary::default())
        .call(authorized_collection)
        .unwrap();

    contract
        .receive_nft(user.to_string(), token_id.to_string(), Binary::default())
        .call(unauthorized_collection)
        .expect_err(ContractError::UnauthorizedCollection.to_string().as_str());

    contract
        .receive_nft(user.to_string(), token_id.to_string(), Binary::default())
        .call(authorized_collection_2)
        .unwrap();

    let burned_total = contract.burned_total().unwrap();
    assert_eq!(burned_total, 2);

    let burned_by_user = contract.burned_by_user(user.to_string()).unwrap();
    assert_eq!(burned_by_user, 2);

    let burned_by_collection = contract
        .burned_by_collection(authorized_collection.to_string())
        .unwrap();
    assert_eq!(burned_by_collection, 1);

    let burned_by_collection = contract
        .burned_by_collection(authorized_collection_2.to_string())
        .unwrap();
    assert_eq!(burned_by_collection, 1);

    let burned_nfts = contract.burned_nfts(None, 10, 0).unwrap();
    assert_eq!(burned_nfts.len(), 2);
    assert_eq!(burned_nfts[0].0, authorized_collection);
    assert_eq!(burned_nfts[0].1, token_id);
    assert_eq!(burned_nfts[1].0, authorized_collection_2);
    assert_eq!(burned_nfts[1].1, token_id);

    let burned_nfts = contract
        .burned_nfts(Some(authorized_collection.to_string()), 10, 0)
        .unwrap();
    assert_eq!(burned_nfts.len(), 1);
    assert_eq!(burned_nfts[0].0, authorized_collection);
    assert_eq!(burned_nfts[0].1, token_id);
}
