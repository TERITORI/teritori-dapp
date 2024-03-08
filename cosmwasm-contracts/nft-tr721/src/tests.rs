use cosmwasm_std::{
    from_json,
    testing::{mock_dependencies, mock_env, mock_info},
    Attribute,
};
use cw2981_royalties::{Extension, Metadata, Trait};
use cw721::NftInfoResponse;
use cw721_base::{ContractError, InstantiateMsg, OwnershipError, QueryMsg};

use crate::contract::Tr721Contract;

const CREATOR: &str = "creator";
const MINTER: &str = "minter";
const OWNER: &str = "owner";
const USER: &str = "user";

// #[test]
// fn full_flow() {
//     let mut app = App::default();

//     let contract_wrapper = ContractWrapper::new(entry::execute, entry::instantiate, entry::query);
//     let launchpad_contract = Box::new(contract_wrapper);

//     let contract_id = app.store_code(launchpad_contract);

//     let contract_addr = app
//         .instantiate_contract(
//             // deployed contract id
//             contract_id,
//             // sender address
//             Addr::unchecked(CREATOR),
//             // message sent to contract
//             &InstantiateMsg {
//                 name: "The Riot".to_string(),
//                 symbol: "RIOT".to_string(),
//                 minter: MINTER.to_string(),
//             },
//             // native funds send to contract
//             &[],
//             // label of contract
//             "Teritori NFT TR721 Contract",
//             // admin of contract (who can do migration later)
//             None,
//         )
//         .unwrap();

//         // Mint nft with metadata
//         {
//             let extension = Some(Metadata {
//                 description: Some("This is description".into()),
//                 name: Some("Starship USS Enterprise".to_string()),
//                 attributes: Some(vec![Trait {
//                     display_type: Some("trait_display".to_string()),
//                     trait_type: "trait_type".to_string(),
//                     value: "trait_value".to_string(),
//                 }]),
//                 ..Metadata::default()
//             });

//             let mint_msg = ExecuteMsg::Mint {
//                 token_id: "1".to_string(),
//                 owner: OWNER.to_string(),
//                 token_uri: Some("token_uri".to_string()),
//                 extension
//             };

//             let resp = app.execute_contract(
//                 Addr::unchecked(CREATOR),
//                 contract_addr.clone(),
//                 &mint_msg,
//                 &[],
//             ).unwrap();

//             panic!("{:?}", resp)
//         }

// }

// #[test]
// fn test_instantiate() {
//     let mut deps = mock_dependencies();
//     let contract = Tr721Contract::default();

//     let info = mock_info(CREATOR, &[]);
//     let init_msg = InstantiateMsg {
//         name: "Riot".to_string(),
//         symbol: "RIOT".to_string(),
//         minter: MINTER.to_string(),
//     };

//     let init_resp = contract
//         .instantiate(deps.as_mut(), mock_env(), info.clone(), init_msg)
//         .unwrap();

//     assert_eq!(init_resp.messages, [])
// }

fn has_attribute(given_attrs: Vec<Attribute>, expected_attr: Attribute) -> bool {
    let resp = given_attrs
        .iter()
        .find(|item| item.key == expected_attr.key && item.value == expected_attr.value);
    resp.is_some()
}

#[test]
fn test_mint_with_metadata() {
    let mut deps = mock_dependencies();
    let contract = Tr721Contract::default();

    let info = mock_info(CREATOR, &[]);
    let init_msg = InstantiateMsg {
        name: "Riot".to_string(),
        symbol: "RIOT".to_string(),
        minter: MINTER.to_string(),
    };

    contract
        .instantiate(deps.as_mut(), mock_env(), info.clone(), init_msg)
        .unwrap();

    // Mint with unauthorized user
    {
        let mint_fail_info = mock_info(USER, &[]);
        let mint_fail_err = contract
            .mint(
                deps.as_mut(),
                mint_fail_info,
                "1".to_string(),
                OWNER.to_string(),
                Some("token_uri".to_string()),
                Some(Metadata::default()),
            )
            .unwrap_err();

        assert_eq!(
            mint_fail_err,
            ContractError::Ownership(OwnershipError::NotOwner)
        );
    }

    // Mint ok
    {
        let extension = Some(Metadata {
            description: Some("This is Riot NFT desc".into()),
            name: Some("This is Riot Name".to_string()),
            attributes: Some(vec![Trait {
                display_type: Some("trait_display".to_string()),
                trait_type: "trait_type".to_string(),
                value: "trait_value".to_string(),
            }]),
            ..Metadata::default()
        });

        let mint_ok_info = mock_info(MINTER, &[]);
        let mint_resp = contract
            .mint(
                deps.as_mut(),
                mint_ok_info,
                "1".to_string(),
                OWNER.to_string(),
                Some("token_uri".to_string()),
                extension,
            )
            .unwrap();

        assert!(has_attribute(
            mint_resp.attributes,
            Attribute {
                key: "token_id".to_string(),
                value: "1".to_string()
            }
        ));
    }

    // Query nft info
    {
        let nft_info_msg = QueryMsg::NftInfo {
            token_id: "1".to_string(),
        };
        let resp_bin = contract
            .query(deps.as_ref(), mock_env(), nft_info_msg)
            .unwrap();

        let resp: NftInfoResponse<Extension> = from_json(resp_bin).unwrap();

        assert_eq!(resp.token_uri, Some("token_uri".to_string()));
    }
}
