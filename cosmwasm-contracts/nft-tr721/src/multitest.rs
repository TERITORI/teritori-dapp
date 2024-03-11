use cosmwasm_std::Attribute;
use cw2981_royalties::Metadata;
use cw721::{Approval, ContractInfoResponse};
use cw721_base::InstantiateMsg;
use cw_multi_test::AppResponse;
use sylvia::multitest::App;

use crate::contract::sv::multitest_utils::CodeId;

const CREATOR: &str = "creator_user";
const MINTER: &str = "minter_user";
const OWNER: &str = "owner_user";
const OPERATOR: &str = "operator_user";
const UNAUTHOR: &str = "unauthor_user";

const FIRST_TOKEN_ID: &str = "1";

fn has_attr(given_attrs: &Vec<Attribute>, expected_attr: &Attribute) -> bool {
    let resp = given_attrs
        .iter()
        .find(|item| item.key == expected_attr.key && item.value == expected_attr.value);
    resp.is_some()
}

fn assert_wasm_attr(app: AppResponse, expected_attr: Attribute) {
    // app.events[0]: exec events
    // app.events[1]: wasm events
    let wasm_attrs = &app.events[1].attributes;

    if !has_attr(wasm_attrs, &expected_attr) {
        panic!(
            "Attribute not found. Wasm attrs: {:?} - Expected attr: {:?}",
            wasm_attrs, expected_attr
        )
    }
}

#[test]
fn full_flow() {
    // 1. Create
    let app: App<sylvia::cw_multi_test::App> = App::default();

    // Instantiate NFT contract ---------------------------------------------------------
    let contract = CodeId::store_code(&app)
        .instantiate(InstantiateMsg {
            name: "NFT name".to_string(),
            symbol: "SYMBOL".to_string(),
            minter: MINTER.to_string(),
        })
        .call(CREATOR)
        .unwrap();

    // Query minter
    {
        let resp = contract.minter().unwrap();
        assert_eq!(resp.minter, Some(MINTER.to_string()));
    }

    // Query contract info
    {
        let resp = contract.contract_info().unwrap();
        assert_eq!(
            resp,
            ContractInfoResponse {
                name: "NFT name".to_string(),
                symbol: "SYMBOL".to_string()
            }
        );
    }

    // Mint NFT
    {
        let token_id = FIRST_TOKEN_ID.to_string();
        let owner = OWNER.to_string();
        let token_uri = Some("token_uri".to_string());
        let extention = Some(Metadata::default());
        contract
            .mint(token_id, owner, token_uri, extention)
            .call(MINTER)
            .unwrap();
    }

    // Query NFT info
    {
        let resp = contract.nft_info(FIRST_TOKEN_ID.to_string()).unwrap();
        assert_eq!(resp.token_uri, Some("token_uri".to_string()));
    }

    // Query All NFT info
    {
        let resp = contract
            .all_nft_info(FIRST_TOKEN_ID.to_string(), Some(true))
            .unwrap();
        assert_eq!(resp.info.token_uri, Some("token_uri".to_string()));
    }

    // Query owner of
    {
        let resp = contract
            .owner_of(FIRST_TOKEN_ID.to_string(), Some(true))
            .unwrap();
        assert_eq!(resp.owner, OWNER.to_string());
    }

    // Approve
    {
        let resp = contract
            .approve(OPERATOR.to_string(), FIRST_TOKEN_ID.to_string(), None)
            .call(OWNER)
            .unwrap();

        assert_wasm_attr(
            resp,
            Attribute {
                key: "spender".to_string(),
                value: OPERATOR.to_string(),
            },
        );
    }

    // Approve all
    {
        let resp = contract
            .approve_all(OPERATOR.to_string(), None)
            .call(OWNER)
            .unwrap();

        assert_wasm_attr(
            resp,
            Attribute {
                key: "operator".to_string(),
                value: OPERATOR.to_string(),
            },
        );
    }

    // Query operator
    {
        let resp = contract
            .operator(OWNER.to_string(), OPERATOR.to_string(), Some(false))
            .unwrap();
        assert_eq!(
            resp.approval,
            Approval {
                spender: OPERATOR.to_string(),
                expires: cw721::Expiration::Never {}
            }
        )
    }
}
