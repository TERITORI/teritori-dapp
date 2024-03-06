use cosmwasm_std::{Addr, Attribute, Timestamp};
use sylvia::multitest::App;

use crate::{
    contract::{sv::multitest_utils::CodeId, Collection, Config},
    error::ContractError,
};

fn get_contract_instance() {}

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
    let default_collection = &Collection {
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
    };

    let app = App::default();
    let sender = "sender";

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

        // check pending collection
        let pending_collections = contract.get_pending_collections().unwrap();
        assert_eq!(pending_collections, vec![1]);
    }

    // Deploy inexist collection  ---------------------------------------------------------
    {
        let err = contract.deploy_collection(999).call(sender).unwrap_err();
        assert_eq!(err, ContractError::CollectionNotFound)
    }

    // Deploy collection without nft code id  ---------------------------------------------------------
    {
        let err = contract.deploy_collection(1).call(sender).unwrap_err();
        assert_eq!(err, ContractError::NftCodeIdMissing)
    }
}
