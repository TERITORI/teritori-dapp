use cosmwasm_std::{Addr, Attribute, Timestamp};
use sylvia::{cw_multi_test::ContractWrapper, multitest::App};

use crate::{
    contract::{sv::multitest_utils::CodeId, Collection, CollectionState, Config},
    error::ContractError,
};

use cw721_base::entry::{
    execute as tr721_execute, instantiate as tr721_instantiate, query as tr721_query,
};

fn get_default_collection() -> Collection {
    Collection {
        // Collection info ----------------------------
        name: "name".to_string(),
        desc: "desc".to_string(),
        symbol: "SYMBOL".to_string(),
        cover_img_uri: "img".to_string(),
        target_network: "network".to_string(),
        external_link: None,

        // Collection details ----------------------------
        website_link: None,

        twitter_profile: "twitter_profile".to_string(),
        twitter_followers_count: 1,

        contact_discord_name: "contact_discord_name".to_string(),
        contact_email: "contact_email".to_string(),

        is_project_derivative: true,

        project_type: "project_type".to_string(),
        project_desc: "project_desc".to_string(),

        is_applied_previously: false,

        // Team info --------------------------------------
        team_desc: "team_desc".to_string(),
        team_link: "team_link".to_string(),

        partners: "partners".to_string(),

        invested_amount: 1000,
        investment_link: "investment_link".to_string(),

        whitepaper_link: "whitepaper_link".to_string(),
        roadmap_link: "roadmap_link".to_string(),

        // Additional info ----------------------------
        artwork_desc: "artwork_desc".to_string(),

        is_ready_for_mint: true,

        expected_supply: 1000,
        expected_public_mint_price: 100,
        expected_mint_date: Timestamp::default(),

        escrow_mint_proceeds_period: Timestamp::default(),
        dox_state: "dox_state".to_string(),

        dao_whitelist_count: 10,

        // Minting details ----------------------------
        tokens_count: 1000,
        unit_price: 100,
        limit_per_address: 2,
        start_time: Timestamp::default(),

        // Whitelist minting --------------------------
        whitelist_addresses: vec![],

        whitelist_unit_price: 10,
        whitelist_limit_per_address: "SYMBOL".to_string(),
        whitelist_member_limit: 3,
        whitelist_start_time: Timestamp::default(),
        whitelist_end_time: Timestamp::default(),

        // Royalty --------------------------
        royalty_address: Some(Addr::unchecked("royalty_address")),
        royalty_percentage: Some(50),

        // Extend info --------------------------
        base_token_uri: None,
        merkle_root: None,
        deployed_address: None,
    }
}

#[test]
fn instantiate() {
    let app = App::default();
    let code_id = CodeId::store_code(&app);
    let sender = "sender";
    
    // Instantiate
    let config = Config {
        name: "teritori launchpad".to_string(),
        supported_networks: vec![],
        nft_code_id: None,
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

    // Deploy NFT contract
    let contract_wrapper = ContractWrapper::new(tr721_execute, tr721_instantiate, tr721_query);
    let launchpad_contract = Box::new(contract_wrapper);

    let deployed_nft_code_id = app.app_mut().store_code(launchpad_contract);

    // Instantiate launchpad ---------------------------------------------------------
    let contract = CodeId::store_code(&app)
        .instantiate(Config {
            name: "teritori launchpad".to_string(),
            supported_networks: vec![],
            nft_code_id: None,
        })
        .call(sender)
        .unwrap();

    // Check instantiated launchpad
    let config = contract.get_config().unwrap();
    assert_eq!(config.name, "teritori launchpad".to_string());

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
        let commited_collection = contract.get_collection_by_id(1).unwrap();
        assert_eq!(commited_collection.name, default_collection.name);
    }

    // Deploy inexist collection  ---------------------------------------------------------
    {
        let err = contract.deploy_collection(999).call(sender).unwrap_err();
        assert_eq!(err, ContractError::CollectionNotFound)
    }

    // Deploy collection without merkle root  ---------------------------------------------------------
    {
        let err = contract.deploy_collection(1).call(sender).unwrap_err();
        assert_eq!(err, ContractError::MerkleRootMissing)
    }

    // Update merkle root
    {
        let new_merkle_root = "new merkle root";
        contract
            .update_merkle_root(1, new_merkle_root.to_string())
            .call(sender)
            .unwrap();

        let collection_after = contract.get_collection_by_id(1).unwrap();

        assert_eq!(
            collection_after.merkle_root,
            Some(new_merkle_root.to_string())
        );
    }

    // Deploy collection with merkle root but dont have nft code id  ---------------------------------------------------------
    {
        let err = contract.deploy_collection(1).call(sender).unwrap_err();
        assert_eq!(err, ContractError::NftCodeIdMissing)
    }

    // Update config to have deployed nft_code_id
    {
        contract
            .update_config(Config {
                name: "test".to_string(),
                nft_code_id: Some(deployed_nft_code_id),
                supported_networks: vec![],
            })
            .call(sender)
            .unwrap();

        let resp = contract.get_config().unwrap();
        assert_eq!(resp.nft_code_id, Some(deployed_nft_code_id))
    }

    // Deploy completed collection after update merkle root + nft code id  ---------------------------------------------------------
    {
        let collection_id = 1;
        let resp = contract.deploy_collection(collection_id).call(sender).unwrap();
        let attrs = resp.custom_attrs(1);
        assert_eq!(
            attrs[1],
            Attribute {
                key: "collection_id".to_string(),
                value: "1".to_string()
            }
        );

        // Check deployed contract
        let collection = contract.get_collection_by_id(collection_id).unwrap();
        assert_eq!(collection.deployed_address, Some("contract1".to_string()));
    }

}
