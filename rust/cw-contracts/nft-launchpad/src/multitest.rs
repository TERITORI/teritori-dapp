use cosmwasm_std::{to_json_binary, Addr, Attribute, Coin, Empty, Uint128};
use cw_utils::Duration;
use dao_interface::msg::InstantiateMsg as DaoDaoInstantiateMsg;
use dao_interface::state::{Admin, ModuleInstantiateInfo};
use dao_proposal_single::contract::{
    execute as dao_execute, instantiate as dao_instantiate, query as dao_query,
};
use dao_proposal_single::msg::InstantiateMsg as DaoInstantiateMsg;
use dao_testing::contracts::{dao_dao_contract, native_staked_balances_voting_contract};
use dao_voting::pre_propose::PreProposeInfo;
use dao_voting::threshold::Threshold;
use sylvia::cw_multi_test::{Contract, ContractWrapper, Executor};
use sylvia::multitest::App;

use crate::test_helpers::assert_wasm_attr;
use crate::{
    contract::{sv::multitest_utils::CodeId as LaunchpadCodeId, CollectionProject, Config},
    error::ContractError,
};

use crate::contract::ConfigChanges;
use nft_tr721::contract::{
    sv::multitest_utils::CodeId as NftTr721CodeId, MintPeriod, WhitelistInfo,
};

fn get_default_collection() -> CollectionProject {
    let mint_periods = vec![MintPeriod {
        price: Some(Coin {
            amount: Uint128::new(10),
            denom: "denom".to_string(),
        }),
        limit_per_address: Some(2),
        start_time: u64::default(),
        end_time: Some(u64::default()),
        max_tokens: None,

        whitelist_info: Some(WhitelistInfo {
            addresses_merkle_root: "addresses_merkle_root".to_string(),
            addresses_count: 3,
            addresses_ipfs: "addresses_ipfs".to_string(),
        }),
    }];

    CollectionProject {
        // Info ----------------------------
        name: "name".to_string(),
        desc: "desc".to_string(),
        symbol: COLLECTION_ID.to_string(),
        cover_img_uri: "img".to_string(),
        target_network: "network".to_string(),
        // Details ----------------------------
        website_link: "aaa".to_string(),
        contact_email: "contact_email".to_string(),
        is_project_derivative: true,
        project_type: "project_type".to_string(),
        is_applied_previously: false,
        // Team info --------------------------------------
        team_desc: "team_desc".to_string(),
        partners: "partners".to_string(),
        investment_desc: "investment_desc".to_string(),
        investment_link: "investment_link".to_string(),
        // Additional info ----------------------------
        artwork_desc: "artwork_desc".to_string(),
        is_ready_for_mint: true,
        escrow_mint_proceeds_period: u64::default(),
        is_dox: true,
        dao_whitelist_count: 10,
        // Minting details ----------------------------
        tokens_count: 1000,
        reveal_time: Some(u64::default()),
        // Whitelist minting --------------------------
        mint_periods,
        // Royalty --------------------------
        royalty_address: Some(Addr::unchecked("royalty_address")),
        royalty_percentage: Some(50),
        // Extend info --------------------------
        base_token_uri: None,
        metadatas_merkle_root: None,
        deployed_address: None,
        owner: Some("owner".to_string()),
    }
}

const PROPOSAL_SINGLE_CONTRACT: &str = "contract1";
const COLLECTION_ID: &str = "SYMBOL";
const SENDER: &str = "sender";
const ADMIN: &str = "admin";
const DENOM: &str = "utori";

#[test]
fn instantiate() {
    let app = App::default();
    let code_id = LaunchpadCodeId::store_code(&app);
    // Deploy NFT TR721 for sylvia contract
    let nft_contract = NftTr721CodeId::store_code(&app);
    let deployed_nft_code_id = nft_contract.code_id();
    // DAO Proposal Single module
    let proposal_single_contract: &str = PROPOSAL_SINGLE_CONTRACT;

    // Instantiate
    let config = Config {
        name: "teritori launchpad".to_string(),
        nft_code_id: deployed_nft_code_id,
        admin: Addr::unchecked(ADMIN),
        owner: Addr::unchecked(SENDER),
        proposal_single_contract: Addr::unchecked(proposal_single_contract),
    };

    let contract = code_id.instantiate(config).call(SENDER).unwrap();

    // Check create config
    let config = contract.get_config().unwrap();
    assert_eq!(config.name, "teritori launchpad".to_string());
}

fn single_proposal_contract() -> Box<dyn Contract<Empty>> {
    let contract = ContractWrapper::new(dao_execute, dao_instantiate, dao_query);
    Box::new(contract)
}

fn instantiate_dao_contract(app: &App<sylvia::cw_multi_test::App>, sender: &str) -> Addr {
    let voting_id = app
        .app_mut()
        .store_code(native_staked_balances_voting_contract());
    let dao_id = app.app_mut().store_code(dao_dao_contract());
    let gov_id = app.app_mut().store_code(single_proposal_contract());

    let gov_init_msg = DaoInstantiateMsg {
        threshold: Threshold::AbsoluteCount {
            threshold: Uint128::new(1),
        },
        max_voting_period: Duration::Height(1),
        min_voting_period: Some(Duration::Height(1)),
        only_members_execute: true,
        allow_revoting: true,
        close_proposal_on_execution_failure: true,
        pre_propose_info: PreProposeInfo::AnyoneMayPropose {},
        veto: None,
    };

    let voting_init_msg = dao_voting_token_staked::msg::InstantiateMsg {
        token_info: dao_voting_token_staked::msg::TokenInfo::Existing {
            denom: DENOM.to_string(),
        },
        unstaking_duration: Some(Duration::Height(5)),
        active_threshold: None,
    };

    let dao_init_msg = DaoDaoInstantiateMsg {
        dao_uri: None,
        admin: None,
        name: "DAO DAO".to_string(),
        description: "A DAO that builds DAOs.".to_string(),
        image_url: None,
        automatically_add_cw20s: true,
        automatically_add_cw721s: true,
        voting_module_instantiate_info: ModuleInstantiateInfo {
            code_id: voting_id,
            msg: to_json_binary(&voting_init_msg).unwrap(),
            admin: Some(Admin::Address {
                addr: sender.to_string(),
            }),
            funds: vec![],
            label: "voting module".to_string(),
        },
        proposal_modules_instantiate_info: vec![ModuleInstantiateInfo {
            code_id: gov_id,
            msg: to_json_binary(&gov_init_msg).unwrap(),
            admin: Some(Admin::Address {
                addr: sender.to_string(),
            }),
            funds: vec![],
            label: "single proposal module".to_string(),
        }],
        initial_items: None,
    };

    let dao_addr = app
        .app_mut()
        .instantiate_contract(
            dao_id,
            Addr::unchecked(sender),
            &dao_init_msg,
            &[],
            "Dao dao",
            None,
        )
        .unwrap();

    return dao_addr;
}

#[test]
fn full_flow() {
    // 1. Create
    let default_collection = get_default_collection();

    let app: App<sylvia::cw_multi_test::App> = App::default();

    // Deploy NFT TR721 for sylvia contract
    let nft_contract = NftTr721CodeId::store_code(&app);
    let deployed_nft_code_id = nft_contract.code_id();

    // Instantiate launchpad ---------------------------------------------------------
    let contract = LaunchpadCodeId::store_code(&app)
        .instantiate(Config {
            name: "teritori launchpad".to_string(),
            nft_code_id: deployed_nft_code_id,
            admin: Addr::unchecked(ADMIN),
            owner: Addr::unchecked(SENDER),
            proposal_single_contract: Addr::unchecked(PROPOSAL_SINGLE_CONTRACT),
        })
        .call(SENDER)
        .unwrap();

    // Check instantiated launchpad
    let config = contract.get_config().unwrap();
    assert_eq!(config.name, "teritori launchpad".to_string());

    // Instantiate DAO contract with Single Proposal module ---------------------------------------------------------
    let _ = instantiate_dao_contract(&app, SENDER);

    // FIXME: By order of execution, contract3 is the single proposal contract
    // We should find a way to get that address dynamically
    // For now, we just hardcode it
    const SINGLE_PROPOSAL_CONTRACT_ADDR: &str = "contract3";
    let contract_data = app
        .app_mut()
        .contract_data(&Addr::unchecked(SINGLE_PROPOSAL_CONTRACT_ADDR))
        .unwrap();
    assert_eq!(contract_data.label, "single proposal module".to_string());

    let single_proposal_contract_addr = SINGLE_PROPOSAL_CONTRACT_ADDR;

    // Create collection without period -----------------------------------------
    {
        let err = contract
            .submit_collection(CollectionProject {
                mint_periods: vec![],
                ..CollectionProject::default()
            })
            .call(SENDER)
            .unwrap_err();

        assert_eq!(err, ContractError::MintPeriodRequired);
    }

    // Create collection with invalid symbol ---------------------------------------------------------
    {
        let err = contract
            .submit_collection(CollectionProject {
                symbol: "a_123".to_string(),
                ..default_collection.clone()
            })
            .call(SENDER)
            .unwrap_err();

        assert_eq!(err, ContractError::CollectionSymbolInvalid)
    }

    // Create collection ---------------------------------------------------------
    {
        let submit_collection_resp = contract
            .submit_collection(default_collection.clone())
            .call(SENDER)
            .unwrap();

        // Check events
        let attrs = submit_collection_resp.custom_attrs(1);
        assert_eq!(
            attrs[0],
            Attribute {
                key: "action".to_string(),
                value: "submit_collection".to_string()
            }
        );
        assert_eq!(
            attrs[1],
            Attribute {
                key: "collection_id".to_string(),
                value: COLLECTION_ID.to_string()
            }
        );
        assert_eq!(
            attrs[2],
            Attribute {
                key: "owner".to_string(),
                value: SENDER.to_string()
            }
        );

        // Check created collection
        let commited_collection = contract
            .get_collection_by_id(COLLECTION_ID.to_string())
            .unwrap();
        assert_eq!(commited_collection.name, default_collection.name);
    }

    // Submit collection with same symbol
    {
        let err = contract
            .submit_collection(default_collection.clone())
            .call(SENDER)
            .unwrap_err();

        assert_eq!(err, ContractError::CollectionSymbolExists);
    }

    // Update config when sender is not contract owner
    {
        let err = contract
            .update_config(ConfigChanges {
                name: Some("test".to_string()),
                nft_code_id: Some(deployed_nft_code_id),
                admin: Some(SENDER.to_string()),
                owner: Some(SENDER.to_string()),
                proposal_single_contract: Some(single_proposal_contract_addr.to_string()),
            })
            .call("wrong_owner")
            .unwrap_err();
        assert_eq!(err, ContractError::Unauthorized)
    }

    // Deploy when sender is not deployer  ---------------------------------------------------------
    {
        contract
            .update_config(ConfigChanges {
                name: Some("test".to_string()),
                nft_code_id: Some(deployed_nft_code_id),
                admin: Some("deployer".to_string()),
                owner: Some(SENDER.to_string()),
                proposal_single_contract: Some(single_proposal_contract_addr.to_string()),
            })
            .call(SENDER)
            .unwrap();

        let err = contract
            .deploy_collection("SYMBOL_NOT_EXIST".to_string())
            .call(SENDER)
            .unwrap_err();
        assert_eq!(err, ContractError::WrongDeployer)
    }

    // Set sender as deployer and Deploy inexist collection  ---------------------------------------------------------
    {
        contract
            .update_config(ConfigChanges {
                name: Some("test".to_string()),
                nft_code_id: Some(deployed_nft_code_id),
                admin: Some(SENDER.to_string()),
                owner: Some(SENDER.to_string()),
                proposal_single_contract: Some(single_proposal_contract_addr.to_string()),
            })
            .call(SENDER)
            .unwrap();

        let err = contract
            .deploy_collection("SYMBOL_NOT_EXIST".to_string())
            .call(SENDER)
            .unwrap_err();
        assert_eq!(err, ContractError::CollectionNotFound)
    }

    // Deploy collection without merkle root  ---------------------------------------------------------
    {
        let err = contract
            .deploy_collection(COLLECTION_ID.to_string())
            .call(SENDER)
            .unwrap_err();
        assert_eq!(err, ContractError::MerkleRootMissing)
    }

    // Update merkle root from unauthorized collection owner
    {
        let new_merkle_root = "new merkle root";
        let err = contract
            .update_merkle_root(COLLECTION_ID.to_string(), new_merkle_root.to_string())
            .call("unauthorized")
            .unwrap_err();

        assert_eq!(err, ContractError::WrongCollectionOwner);
    }

    // Update merkle root
    {
        let new_merkle_root = "new merkle root";
        let resp = contract
            .update_merkle_root(COLLECTION_ID.to_string(), new_merkle_root.to_string())
            .call(SENDER)
            .unwrap();

        // Check events
        assert_wasm_attr(
            resp.clone(),
            Attribute {
                key: "action".to_string(),
                value: "update_merkle_root".to_string(),
            },
        );
        assert_wasm_attr(
            resp.clone(),
            Attribute {
                key: "merkle_root".to_string(),
                value: new_merkle_root.to_string(),
            },
        );
        assert_wasm_attr(
            resp.clone(),
            Attribute {
                key: "action".to_string(),
                value: "execute_propose".to_string(),
            },
        );
        assert_wasm_attr(
            resp.clone(),
            Attribute {
                key: "proposal_id".to_string(),
                value: "1".to_string(),
            },
        );

        let collection_after = contract
            .get_collection_by_id(COLLECTION_ID.to_string())
            .unwrap();

        assert_eq!(
            collection_after.metadatas_merkle_root,
            Some(new_merkle_root.to_string())
        );
    }

    // Update config to have deployed nft_code_id
    {
        contract
            .update_config(ConfigChanges {
                name: Some("test".to_string()),
                nft_code_id: Some(deployed_nft_code_id),
                admin: Some(SENDER.to_string()),
                owner: Some(SENDER.to_string()),
                proposal_single_contract: Some(single_proposal_contract_addr.to_string()),
            })
            .call(SENDER)
            .unwrap();

        let resp = contract.get_config().unwrap();
        assert_eq!(resp.nft_code_id, deployed_nft_code_id)
    }

    // Deploy completed collection after update merkle root + nft code id  ---------------------------------------------------------
    {
        let deployed_collection_addr = "contract4";
        let resp = contract
            .deploy_collection(COLLECTION_ID.to_owned())
            .call(SENDER)
            .unwrap();

        // Check events
        assert_wasm_attr(
            resp.clone(),
            Attribute {
                key: "action".to_string(),
                value: "deploy_collection".to_string(),
            },
        );
        assert_wasm_attr(
            resp.clone(),
            Attribute {
                key: "collection_id".to_string(),
                value: COLLECTION_ID.to_string(),
            },
        );
        assert_wasm_attr(
            resp.clone(),
            Attribute {
                key: "action".to_string(),
                value: "instantiate_collection".to_string(),
            },
        );
        assert_wasm_attr(
            resp.clone(),
            Attribute {
                key: "collection_addr".to_string(),
                value: deployed_collection_addr.to_string(),
            },
        );

        // Check deployed contract
        let collection = contract
            .get_collection_by_id(COLLECTION_ID.to_string())
            .unwrap();
        assert_eq!(
            collection.deployed_address,
            Some(deployed_collection_addr.to_string())
        );
    }
}
