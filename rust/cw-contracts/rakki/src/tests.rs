use cosmwasm_std::{Addr, Coin, StdError, Uint128};
use sylvia::{anyhow::Error, multitest::App};

use crate::{contract::sv::multitest_utils::CodeId, error::ContractError};

#[test]
fn optimistic() {
    let app = App::default();
    let code_id = CodeId::store_code(&app);

    let creator = "creator";
    let admin = "admin";
    let player_1 = "player_1";
    let player_2 = "player_2";
    let treasury = "treasury";

    let max_tickets = Uint128::from(2_000u16);
    let half_tickets = max_tickets.checked_div(Uint128::from(2u16)).unwrap();
    let fee_per10k = Uint128::from(500u16);
    let ticket_price = Uint128::from(10u16);
    let total_reward = max_tickets.checked_mul(ticket_price).unwrap();
    let half_reward = total_reward.checked_div(Uint128::from(2u16)).unwrap();
    let fee = total_reward
        .checked_mul(fee_per10k)
        .unwrap()
        .checked_div(Uint128::from(10_000u16))
        .unwrap();

    app.app_mut()
        .init_modules(|router, _, storage| {
            router.bank.init_balance(
                storage,
                &Addr::unchecked(player_1),
                vec![Coin::new(half_reward.into(), "uusdc")],
            )?;
            router.bank.init_balance(
                storage,
                &Addr::unchecked(player_2),
                vec![Coin::new(half_reward.into(), "uusdc")],
            )?;
            Ok::<(), Error>(())
        })
        .unwrap();

    let max_tickets_primitive: u128 = max_tickets.into();
    let fee_per10k_primitive: u128 = fee_per10k.into();
    let contract = code_id
        .instantiate(
            admin.into(),
            max_tickets_primitive.try_into().unwrap(),
            Coin::new(ticket_price.into(), "uusdc"),
            fee_per10k_primitive.try_into().unwrap(),
        )
        .call(creator)
        .unwrap();

    let history = contract.history(42, None).unwrap();
    assert_eq!(history.len(), 0);

    for i in 0..half_tickets.into() {
        contract
            .buy_ticket(i % 2 == 1)
            .with_funds(&[Coin::new(ticket_price.into(), "uusdc")])
            .call(player_1)
            .unwrap();
    }

    let contract_balance = app
        .app()
        .wrap()
        .query_balance(contract.contract_addr.to_owned(), "uusdc")
        .unwrap();
    assert_eq!(contract_balance, Coin::new(half_reward.into(), "uusdc"));

    for i in 0..half_tickets.into() {
        contract
            .buy_ticket(i % 2 == 1)
            .with_funds(&[Coin::new(ticket_price.into(), "uusdc")])
            .call(player_2)
            .unwrap();
    }

    let contract_balance = app
        .app()
        .wrap()
        .query_balance(contract.contract_addr.to_owned(), "uusdc")
        .unwrap();
    assert_eq!(contract_balance, Coin::new(fee.into(), "uusdc"));

    let player_1_balance = app.app().wrap().query_balance(player_1, "uusdc").unwrap();
    assert_eq!(
        player_1_balance,
        Coin::new(total_reward.checked_sub(fee).unwrap().into(), "uusdc")
    );

    let player_2_balance = app.app().wrap().query_balance(player_2, "uusdc").unwrap();
    assert_eq!(player_2_balance, Coin::new(0, "uusdc"));

    let history = contract.history(42, None).unwrap();
    assert_eq!(history.len(), 1);
    let history_entry = &history[0];
    assert_eq!(history_entry, &(1571797419u64, Addr::unchecked(player_1)));

    contract
        .withdraw_fees(treasury.to_string())
        .call(admin)
        .unwrap();

    let contract_balance = app
        .app()
        .wrap()
        .query_balance(contract.contract_addr.to_owned(), "uusdc")
        .unwrap();
    assert_eq!(contract_balance, Coin::new(0, "uusdc"));

    let treasury_balance = app.app().wrap().query_balance(treasury, "uusdc").unwrap();
    assert_eq!(treasury_balance, Coin::new(fee.into(), "uusdc"));
}

#[test]
fn stop() {
    let app = App::default();
    let code_id = CodeId::store_code(&app);

    let creator = "owner";
    let admin = "admin";
    let player_1 = "player_1";
    let player_2 = "player_2";
    let treasury = "treasury";

    app.app_mut()
        .init_modules(|router, _, storage| {
            router.bank.init_balance(
                storage,
                &Addr::unchecked(player_1),
                vec![Coin::new(50_000, "uusdc")],
            )?;
            router.bank.init_balance(
                storage,
                &Addr::unchecked(player_2),
                vec![Coin::new(50_000, "uusdc")],
            )?;
            Ok::<(), Error>(())
        })
        .unwrap();

    let contract = code_id
        .instantiate(admin.into(), 10_000, Coin::new(10, "uusdc"), 500)
        .call(creator)
        .unwrap();

    for i in 0..5000 {
        contract
            .buy_ticket(i % 2 == 1)
            .with_funds(&[Coin::new(10, "uusdc")])
            .call(player_1)
            .unwrap();
    }

    let contract_balance = app
        .app()
        .wrap()
        .query_balance(contract.contract_addr.to_owned(), "uusdc")
        .unwrap();
    assert_eq!(contract_balance, Coin::new(50000, "uusdc"));

    for i in 0..4999 {
        contract
            .buy_ticket(i % 2 == 1)
            .with_funds(&[Coin::new(10, "uusdc")])
            .call(player_2)
            .unwrap();
    }

    let contract_balance = app
        .app()
        .wrap()
        .query_balance(contract.contract_addr.to_owned(), "uusdc")
        .unwrap();
    assert_eq!(contract_balance, Coin::new(99_990, "uusdc"));

    let player_1_balance = app.app().wrap().query_balance(player_1, "uusdc").unwrap();
    assert_eq!(player_1_balance, Coin::new(0, "uusdc"));

    let player_2_balance = app.app().wrap().query_balance(player_2, "uusdc").unwrap();
    assert_eq!(player_2_balance, Coin::new(10, "uusdc"));

    contract.stop().call(admin).unwrap();
    let contract_balance = app
        .app()
        .wrap()
        .query_balance(contract.contract_addr.to_owned(), "uusdc")
        .unwrap();
    assert_eq!(contract_balance, Coin::new(0, "uusdc"));

    let player_1_balance = app.app().wrap().query_balance(player_1, "uusdc").unwrap();
    assert_eq!(player_1_balance, Coin::new(50000, "uusdc"));

    let player_2_balance = app.app().wrap().query_balance(player_2, "uusdc").unwrap();
    assert_eq!(player_2_balance, Coin::new(50000, "uusdc"));

    let withdraw_err = contract
        .withdraw_fees(treasury.to_string())
        .call(admin)
        .unwrap_err();
    assert_eq!(
        withdraw_err,
        ContractError::Std(StdError::generic_err("no fees collected"))
    );
}
