use cosmwasm_std::{Addr, Coin, Timestamp, Uint128, Uint64};
use cw2981_royalties::msg::{CheckRoyaltiesResponse, RoyaltiesInfoResponse};
use cw721::{NftInfoResponse, TokensResponse};
use cw721_metadata_onchain::{Metadata, Trait};
use sylvia::{anyhow::Error, multitest::App};

use crate::contract::{
    multitest_utils::CodeId, MembershipConfig, Subscription, SubscriptionResponse,
};

#[test]
fn basic_full_flow() {
    // ------- deploy contract

    let app = App::default();
    let code_id = CodeId::store_code(&app);

    // ------- init app modules

    let sub_user = "sub_user";

    app.app_mut()
        .init_modules(|router, _, storage| {
            router.bank.init_balance(
                storage,
                &Addr::unchecked(sub_user.to_string()),
                vec![Coin::new(1000000, "utori")],
            )?;
            Ok::<(), Error>(())
        })
        .unwrap();

    // ------- instantiate contract

    let admin = "admin";
    let contract_creator = "creator";
    let mint_royalties = 5;
    let coll_name = "coll_name";
    let coll_desc = "coll_desc";
    let coll_image_uri = "coll_image_uri";
    let coll_symbol = "coll_symbol";

    let contract = code_id
        .instantiate(
            admin.to_string(),
            mint_royalties,
            coll_name.to_string(),
            coll_desc.to_string(),
            coll_image_uri.to_string(),
            coll_symbol.to_string(),
        )
        .call(contract_creator)
        .unwrap();

    let info = contract.contract_info().unwrap();
    assert_eq!(info.name, coll_name.to_string());
    assert_eq!(info.symbol, coll_symbol.to_string());

    let config = contract.config().unwrap();
    assert_eq!(config.admin_addr, admin.to_string());
    assert_eq!(config.mint_royalties, mint_royalties);
    assert_eq!(config.name, coll_name.to_string());
    assert_eq!(config.description, coll_desc.to_string());
    assert_eq!(config.image_uri, coll_image_uri.to_string());
    assert_eq!(config.symbol, coll_symbol.to_string());

    // ------- create channel

    let memberships_config = vec![MembershipConfig {
        display_name: "Channel".to_string(),
        description: "Channel description".to_string(),
        nft_image_uri: "https://example.com/image.png".to_string(),
        nft_name_prefix: "Sub".to_string(),
        duration_seconds: Uint64::from(60u32 * 60 * 24 * 7),
        price: Coin {
            denom: "utori".to_string(),
            amount: Uint128::from(1000000u32),
        },
    }];

    let trade_royalties = 500;
    let channel_owner = "channel_owner";

    contract
        .upsert_channel(memberships_config.clone(), trade_royalties)
        .call(channel_owner)
        .unwrap();

    let channel_response = contract.channel(channel_owner.to_string()).unwrap();
    assert_eq!(channel_response.memberships_config, memberships_config);
    assert_eq!(channel_response.mint_royalties, mint_royalties);
    assert_eq!(channel_response.trade_royalties, trade_royalties);

    // ------- mint a nft

    contract
        .subscribe(channel_owner.to_string(), sub_user.to_string(), 0)
        .with_funds(&[Coin {
            denom: "utori".to_string(),
            amount: Uint128::from(1000000u32),
        }])
        .call(sub_user)
        .unwrap();

    let token_id = "AAAAAAAAAAFjaGFubmVsX293bmVy";

    // ------- test nft queries

    let tokens_response = contract.tokens(sub_user.to_string(), None, None).unwrap();
    assert_eq!(
        tokens_response,
        TokensResponse {
            tokens: vec![token_id.to_string()]
        }
    );

    let all_tokens_response = contract.all_tokens(None, None).unwrap();
    assert_eq!(
        all_tokens_response,
        TokensResponse {
            tokens: vec![token_id.to_string()]
        }
    );

    let token_info_response = contract.nft_info(token_id.to_string()).unwrap();
    assert_eq!(
        token_info_response,
        NftInfoResponse {
            token_uri: None,
            extension: Metadata {
                image: Some("https://example.com/image.png".to_string()),
                name: Some("Sub #1".to_string()),
                description: Some("Channel description".to_string()),
                attributes: Some(vec![
                    Trait {
                        display_type: Some("DISPLAY_TYPE_PROPERTY".to_string()),
                        trait_type: "Channel address".to_string(),
                        value: "channel_owner".to_string()
                    },
                    Trait {
                        display_type: Some("DISPLAY_TYPE_DATE".to_string()),
                        trait_type: "Starts".to_string(),
                        value: "1571797419.879305533".to_string()
                    },
                    Trait {
                        display_type: Some("DISPLAY_TYPE_PROPERTY".to_string()),
                        trait_type: "Duration in seconds".to_string(),
                        value: "604800".to_string()
                    },
                ]),
                ..Default::default()
            }
        }
    );

    // ------- test royalty queries

    let royalties_check = contract.check_royalties().unwrap();
    assert_eq!(
        royalties_check,
        CheckRoyaltiesResponse {
            royalty_payments: true
        }
    );

    let royalty_info = contract
        .royalty_info(token_id.to_string(), Uint128::from(461558079u32))
        .unwrap();
    assert_eq!(
        royalty_info,
        RoyaltiesInfoResponse {
            address: channel_owner.to_string(),
            royalty_amount: Uint128::from(23077903u32) // 5%
        }
    );

    // ------- test transfer and back

    let other_user = "other_user";

    contract
        .transfer_nft(other_user.to_string(), token_id.to_string())
        .call(sub_user)
        .unwrap();
    let new_owner = contract
        .owner_of(token_id.to_string(), Some(false))
        .unwrap();
    assert_eq!(new_owner.owner, other_user.to_string());

    contract
        .transfer_nft(sub_user.to_string(), token_id.to_string())
        .call(other_user)
        .unwrap();
    let new_owner = contract
        .owner_of(token_id.to_string(), Some(false))
        .unwrap();
    assert_eq!(new_owner.owner, sub_user.to_string());

    // ------- test subscription query

    // go 6 days into the future
    app.update_block(|block| {
        block.time = Timestamp::from_seconds(block.time.seconds() + 60 * 60 * 24 * 6);
    });

    let subscription = contract
        .subscription(sub_user.to_string(), channel_owner.to_string())
        .unwrap();
    assert_eq!(
        subscription,
        SubscriptionResponse {
            subscription: Some(Subscription {
                expiration: Timestamp::from_nanos(1572402219879305533),
                level_expiration: Timestamp::from_nanos(1572402219879305533)
            }),
            level: 1
        }
    );

    // go 2 days into the future
    app.update_block(|block| {
        block.time = Timestamp::from_seconds(block.time.seconds() + 60 * 60 * 24 * 2);
    });

    let subscription = contract
        .subscription(sub_user.to_string(), channel_owner.to_string())
        .unwrap();
    assert_eq!(
        subscription,
        SubscriptionResponse {
            subscription: None,
            level: 0
        }
    );
}
