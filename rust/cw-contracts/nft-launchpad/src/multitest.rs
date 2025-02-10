use cosmwasm_std::{Addr, Attribute, Coin, Uint128};
use cw_utils::Duration;
use dao_proposal_single::contract::{
    execute as dao_execute, instantiate as dao_instantiate, query as dao_query,
};
use dao_proposal_single::msg::InstantiateMsg as DaoInstantiateMsg;
use dao_voting::pre_propose::PreProposeInfo;
use dao_voting::threshold::Threshold;
use sylvia::cw_multi_test::{ContractWrapper, Executor};
use sylvia::multitest::App;

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
        symbol: "SYMBOL".to_string(),
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

#[test]
fn instantiate() {
    let app = App::default();
    let code_id = LaunchpadCodeId::store_code(&app);
    let sender = "sender";
    // Deploy NFT TR721 for sylvia contract
    let nft_contract = NftTr721CodeId::store_code(&app);
    let deployed_nft_code_id = nft_contract.code_id();
    // DAO Proposal Single module
    let proposal_single_contract: &str = PROPOSAL_SINGLE_CONTRACT;

    // Instantiate
    let config = Config {
        name: "teritori launchpad".to_string(),
        nft_code_id: deployed_nft_code_id,
        admin: Addr::unchecked("admin"),
        owner: Addr::unchecked(sender),
        proposal_single_contract: Addr::unchecked(proposal_single_contract),
    };

    let contract = code_id.instantiate(config).call(sender).unwrap();

    // Check create config
    let config = contract.get_config().unwrap();
    assert_eq!(config.name, "teritori launchpad".to_string());
}

#[test]
fn full_flow() {
    // 1. Create
    let default_collection = get_default_collection();

    let app: App<sylvia::cw_multi_test::App> = App::default();
    let sender = "sender";

    // Deploy NFT TR721 for sylvia contract
    let nft_contract = NftTr721CodeId::store_code(&app);
    let deployed_nft_code_id = nft_contract.code_id();

    // Instantiate launchpad ---------------------------------------------------------
    let contract = LaunchpadCodeId::store_code(&app)
        .instantiate(Config {
            name: "teritori launchpad".to_string(),
            nft_code_id: deployed_nft_code_id,
            admin: Addr::unchecked("admin"),
            owner: Addr::unchecked(sender),
            proposal_single_contract: Addr::unchecked(PROPOSAL_SINGLE_CONTRACT),
        })
        .call(sender)
        .unwrap();

    // Check instantiated launchpad
    let config = contract.get_config().unwrap();
    assert_eq!(config.name, "teritori launchpad".to_string());

    // Instantiate DAO contract ---------------------------------------------------------
    // Store DAO contract
    let dao_contract = Box::new(ContractWrapper::new(
        dao_execute,
        dao_instantiate,
        dao_query,
    ));
    let dao_code_id = app.app_mut().store_code(dao_contract);

    // Instantiate the contract
    let proposal_single_contract = app
        .app_mut()
        .instantiate_contract(
            dao_code_id,
            Addr::unchecked("admin"),
            &DaoInstantiateMsg {
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
            },
            &[],
            "DaoContract",
            None, // No admin
        )
        .unwrap();

    // Create collection without period -----------------------------------------
    {
        let err = contract
            .submit_collection(CollectionProject {
                mint_periods: vec![],
                ..CollectionProject::default()
            })
            .call(sender)
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
            .call(sender)
            .unwrap_err();

        assert_eq!(err, ContractError::CollectionSymbolInvalid)
    }

    // Create collection ---------------------------------------------------------
    {
        let submit_collection_resp = contract
            .submit_collection(default_collection.clone())
            .call(sender)
            .unwrap();

        // Check event
        let attrs = submit_collection_resp.custom_attrs(1);
        assert_eq!(
            attrs[0],
            Attribute {
                key: "action".to_string(),
                value: "submit_collection".to_string()
            }
        );

        // Check created collection
        let commited_collection = contract.get_collection_by_id("SYMBOL".to_string()).unwrap();
        assert_eq!(commited_collection.name, default_collection.name);
    }

    // Submit collection with same symbol
    {
        let err = contract
            .submit_collection(default_collection.clone())
            .call(sender)
            .unwrap_err();

        assert_eq!(err, ContractError::CollectionSymbolExists);
    }

    // Update config when sender is not contract owner
    {
        let err = contract
            .update_config(ConfigChanges {
                name: Some("test".to_string()),
                nft_code_id: Some(deployed_nft_code_id),
                admin: Some(sender.to_string()),
                owner: Some(sender.to_string()),
                proposal_single_contract: Some(proposal_single_contract.to_string()),
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
                owner: Some(sender.to_string()),
                proposal_single_contract: Some(proposal_single_contract.to_string()),
            })
            .call(sender)
            .unwrap();

        let err = contract
            .deploy_collection("SYMBOL_NOT_EXIST".to_string())
            .call(sender)
            .unwrap_err();
        assert_eq!(err, ContractError::WrongDeployer)
    }

    // Set sender as deployer and Deploy inexist collection  ---------------------------------------------------------
    {
        contract
            .update_config(ConfigChanges {
                name: Some("test".to_string()),
                nft_code_id: Some(deployed_nft_code_id),
                admin: Some(sender.to_string()),
                owner: Some(sender.to_string()),
                proposal_single_contract: Some(proposal_single_contract.to_string()),
            })
            .call(sender)
            .unwrap();

        let err = contract
            .deploy_collection("SYMBOL_NOT_EXIST".to_string())
            .call(sender)
            .unwrap_err();
        assert_eq!(err, ContractError::CollectionNotFound)
    }

    // Deploy collection without merkle root  ---------------------------------------------------------
    {
        let err = contract
            .deploy_collection("SYMBOL".to_string())
            .call(sender)
            .unwrap_err();
        assert_eq!(err, ContractError::MerkleRootMissing)
    }

    // Update merkle root from unauthorized collection owner
    {
        let new_merkle_root = "new merkle root";
        let err = contract
            .update_merkle_root("SYMBOL".to_string(), new_merkle_root.to_string())
            .call("unauthorized")
            .unwrap_err();

        assert_eq!(err, ContractError::WrongCollectionOwner);
    }

    // Update merkle root
    {
        let new_merkle_root = "new merkle root";
        contract
            .update_merkle_root("SYMBOL".to_string(), new_merkle_root.to_string())
            .call(sender)
            .unwrap();

        let collection_after = contract.get_collection_by_id("SYMBOL".to_string()).unwrap();

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
                admin: Some(sender.to_string()),
                owner: Some(sender.to_string()),
                proposal_single_contract: Some(proposal_single_contract.to_string()),
            })
            .call(sender)
            .unwrap();

        let resp = contract.get_config().unwrap();
        assert_eq!(resp.nft_code_id, deployed_nft_code_id)
    }

    // Deploy completed collection after update merkle root + nft code id  ---------------------------------------------------------
    {
        let collection_id = "SYMBOL".to_string();
        let resp = contract
            .deploy_collection(collection_id.to_owned())
            .call(sender)
            .unwrap();
        let attrs = resp.custom_attrs(1);
        assert_eq!(
            attrs[1],
            Attribute {
                key: "collection_id".to_string(),
                value: "SYMBOL".to_string()
            }
        );

        // Check deployed contract
        let collection = contract.get_collection_by_id(collection_id).unwrap();
        assert_eq!(collection.deployed_address, Some("contract2".to_string()));
    }
}
