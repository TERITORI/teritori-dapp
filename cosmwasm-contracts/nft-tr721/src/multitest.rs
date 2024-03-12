use cosmwasm_std::{Attribute, Uint128};
use cw2981_royalties::Metadata;
use cw721::{Approval, ContractInfoResponse};
use cw721_base::InstantiateMsg;
use cw_multi_test::AppResponse;
use sylvia::multitest::App;

use crate::contract::{sv::multitest_utils::CodeId, ContractVersion};

const CREATOR: &str = "creator_user";
const MINTER: &str = "minter_user";
const OWNER: &str = "owner_user";
const OPERATOR: &str = "operator_user";
const UNAUTHOR: &str = "unauthor_user";

const ROYALTY_ADDR: &str = "royalty_addr";

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

    // Mint NFT with metadata onchain + royalty address and query NFT info
    {
        let token_id = FIRST_TOKEN_ID.to_string();
        let owner = OWNER.to_string();
        let token_uri = Some("token_uri".to_string());
        let extention = Some(Metadata {
            name: Some("this is NFT name".to_string()),
            royalty_payment_address: Some(ROYALTY_ADDR.to_string()),
            royalty_percentage: Some(5), // royalty 5%

            ..Metadata::default()
        });
        contract
            .mint(token_id, owner, token_uri, extention)
            .call(MINTER)
            .unwrap();

        let resp = contract.nft_info(FIRST_TOKEN_ID.to_string()).unwrap();
        let ext = resp.extension.unwrap();

        assert_eq!(ext.name, Some("this is NFT name".to_string()));
        assert_eq!(ext.royalty_payment_address, Some(ROYALTY_ADDR.to_string()));

        // Query balance
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

    // Check royalties
    {
        let resp = contract.check_royalties().unwrap();
        assert_eq!(resp.royalty_payments, true)
    }

    // Query royalties info
    {
        let resp = contract
            .royalty_info(FIRST_TOKEN_ID.to_string(), Uint128::new(1000))
            .unwrap();
        assert_eq!(resp.royalty_amount, Uint128::new(50))
    }

    // Query contract version
    {
        let resp = contract.contract_version().unwrap();
        assert_eq!(
            resp,
            ContractVersion {
                contract: "crate:nft-tr721".to_string(),
                version: "0.1.0".to_string()
            }
        )
    }
}
