use cosmwasm_std::{Addr, Attribute, Coin, Uint128};
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
        website_link: Some("aaa".to_string()),
        contact_email: Some("contact_email".to_string()),
        project_type: Some("project_type".to_string()),
        artwork_desc: Some("artwork_desc".to_string()),
        // Team info --------------------------------------
        team_desc: Some("team_desc".to_string()),
        partners: Some("partners".to_string()),
        investment_desc: Some("investment_desc".to_string()),
        investment_link: Some("investment_link".to_string()),
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

#[test]
fn instantiate() {
    let app = App::default();
    let code_id = LaunchpadCodeId::store_code(&app);
    let sender = "sender";
    // Deploy NFT TR721 for sylvia contract
    let nft_contract = NftTr721CodeId::store_code(&app);
    let deployed_nft_code_id = nft_contract.code_id();

    // Instantiate
    let config = Config {
        name: "teritori launchpad".to_string(),
        nft_code_id: deployed_nft_code_id,
        admin: Addr::unchecked("admin"),
        owner: Addr::unchecked(sender),
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
        })
        .call(sender)
        .unwrap();

    // Check instantiated launchpad
    let config = contract.get_config().unwrap();
    assert_eq!(config.name, "teritori launchpad".to_string());

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
        assert_eq!(collection.deployed_address, Some("contract1".to_string()));
    }
}
