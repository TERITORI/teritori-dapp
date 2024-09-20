use crate::state::{Config, NFTInfo, CONFIG, NFT_LIST};

use crate::vault::{
    ConfigResponse, Cw2981BorkedQueryMsg, Cw721HookMsg, ExecuteMsg, InstantiateMsg, NftQueryMsg,
    QueryMsg, RoyaltiesInfoResponse,
};
#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    attr, from_binary, to_binary, to_json_binary, Addr, BankMsg, Binary, Coin, CosmosMsg, Deps,
    DepsMut, Empty, Env, MessageInfo, QueryRequest, Response, StdError, StdResult, Uint128,
    WasmMsg, WasmQuery,
};
use cw2981_royalties::msg::Cw2981QueryMsg;
use cw721::{Cw721ExecuteMsg, Cw721ReceiveMsg};

//Initialize the contract.
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
    let config = Config {
        owner: info.sender,
        fee_bp: msg.fee_bp,
    };

    CONFIG.save(deps.storage, &config)?;

    Ok(Response::new())
}

//Migration
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn migrate(_deps: DepsMut, _env: Env, _msg: Empty) -> StdResult<Response> {
    Ok(Response::new())
}

//Execute the handle messages.
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(deps: DepsMut, env: Env, info: MessageInfo, msg: ExecuteMsg) -> StdResult<Response> {
    match msg {
        ExecuteMsg::UpdateConfig { owner, fee_bp } => {
            execute_update_config(deps, env, info, owner, fee_bp)
        }
        ExecuteMsg::ReceiveNft(msg) => receive_cw721(deps, env, info, msg),
        ExecuteMsg::Withdraw {
            nft_contract_addr,
            nft_token_id,
        } => execute_withdraw(deps, env, info, nft_contract_addr, nft_token_id),
        ExecuteMsg::UpdatePrice {
            nft_contract_addr,
            nft_token_id,
            denom,
            amount,
        } => execute_update_price(
            deps,
            env,
            info,
            nft_contract_addr,
            nft_token_id,
            denom,
            amount,
        ),
        ExecuteMsg::Buy {
            nft_contract_addr,
            nft_token_id,
        } => execute_buy(deps, env, info, nft_contract_addr, nft_token_id),
        ExecuteMsg::WithdrawFee {} => execute_withdraw_fee(deps, env, info),
    }
}

pub fn receive_cw721(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    cw721_msg: Cw721ReceiveMsg,
) -> StdResult<Response> {
    let nft_contract_addr = info.sender;

    match from_binary(&cw721_msg.msg)? {
        Cw721HookMsg::Deposit { denom, amount } => execute_deposit(
            deps,
            env,
            Addr::unchecked(cw721_msg.sender),
            nft_contract_addr,
            cw721_msg.token_id,
            denom,
            amount,
        ),
    }
}

// Only owner can execute it.
pub fn execute_update_config(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    owner: Option<String>,
    fee_bp: Option<Uint128>,
) -> StdResult<Response> {
    let mut config: Config = CONFIG.load(deps.storage)?;
    let mut attributes = vec![attr("action", "update_config")];

    // permission check
    if info.sender != config.owner {
        return Err(StdError::generic_err("unauthorized"));
    }

    if let Some(owner) = owner {
        config.owner = deps.api.addr_validate(&owner)?;
        attributes.push(attr("new_owner", owner.as_str()))
    }

    if let Some(fee_bp) = fee_bp {
        config.fee_bp = fee_bp;
        attributes.push(attr("new_fee_bp", fee_bp))
    }

    CONFIG.save(deps.storage, &config)?;

    Ok(Response::new().add_attributes(attributes))
}

pub fn execute_deposit(
    deps: DepsMut,
    _env: Env,
    sender: Addr,
    nft_contract_addr: Addr,
    nft_token_id: String,
    denom: String,
    amount: Uint128,
) -> StdResult<Response> {
    let key = query_nft_info_key(nft_contract_addr.to_string(), nft_token_id.to_string());

    if (NFT_LIST.may_load(deps.storage, key.to_string())?).is_some() {
        return Err(StdError::generic_err("NFT already listed!"));
    }

    NFT_LIST.save(
        deps.storage,
        key,
        &NFTInfo {
            owner: sender.to_string(),
            denom,
            amount,
        },
    )?;

    Ok(
        Response::new()
            .add_attributes(vec![("action", "deposit"), ("sender", sender.as_ref())]),
    )
}

pub fn execute_withdraw(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    nft_contract_addr: String,
    nft_token_id: String,
) -> StdResult<Response> {
    let mut messages: Vec<CosmosMsg> = vec![];

    let key = query_nft_info_key(nft_contract_addr.to_string(), nft_token_id.to_string());
    if let Some(nft_info) = NFT_LIST.may_load(deps.storage, key.to_string())? {
        if nft_info.owner != info.sender {
            return Err(StdError::generic_err("This NFT is not owned to the user!"));
        }

        NFT_LIST.remove(deps.storage, key);

        messages.push(CosmosMsg::Wasm(WasmMsg::Execute {
            contract_addr: nft_contract_addr,
            msg: to_binary(&Cw721ExecuteMsg::TransferNft {
                recipient: info.sender.to_string(),
                token_id: nft_token_id,
            })?,
            funds: vec![],
        }));
    } else {
        return Err(StdError::generic_err("NFT is not listed!"));
    }

    Ok(Response::new()
        .add_messages(messages)
        .add_attribute("action", "withdraw"))
}

pub fn execute_update_price(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    nft_contract_addr: String,
    nft_token_id: String,
    denom: String,
    amount: Uint128,
) -> StdResult<Response> {
    let key = query_nft_info_key(nft_contract_addr, nft_token_id);
    if let Some(nft_info) = NFT_LIST.may_load(deps.storage, key.to_string())? {
        if nft_info.owner != info.sender {
            return Err(StdError::generic_err("This NFT is not owned to the user!"));
        }

        NFT_LIST.save(
            deps.storage,
            key,
            &NFTInfo {
                owner: nft_info.owner,
                denom,
                amount,
            },
        )?;
    } else {
        return Err(StdError::generic_err("NFT is not listed!"));
    }

    Ok(Response::new().add_attribute("action", "update_price"))
}

pub fn execute_buy(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    nft_contract_addr: String,
    nft_token_id: String,
) -> StdResult<Response> {
    let mut messages: Vec<CosmosMsg> = vec![];
    let config: Config = CONFIG.load(deps.storage)?;

    let key = query_nft_info_key(nft_contract_addr.to_string(), nft_token_id.to_string());
    if let Some(nft_info) = NFT_LIST.may_load(deps.storage, key.to_string())? {
        let mut fund = info.funds[0].clone();
        if nft_info.denom != fund.denom || nft_info.amount != fund.amount {
            return Err(StdError::generic_err(
                "The payment is not matched with the selling price!",
            ));
        }

        messages.push(CosmosMsg::Wasm(WasmMsg::Execute {
            contract_addr: nft_contract_addr.clone(),
            msg: to_binary(&Cw721ExecuteMsg::TransferNft {
                recipient: info.sender.to_string(),
                token_id: nft_token_id.clone(),
            })?,
            funds: vec![],
        }));

        let fee_amount = fund
            .amount
            .checked_mul(config.fee_bp)?
            .checked_div(Uint128::from(10000u128))?;
        fund.amount = fund.amount.checked_sub(fee_amount)?;

        // check royalty
        if let Ok(royalty_info) = query_royalties_info(
            deps.as_ref(),
            nft_contract_addr,
            nft_token_id,
            nft_info.amount,
        ) {
            fund.amount = fund.amount.checked_sub(royalty_info.royalty_amount)?;

            messages.push(CosmosMsg::Bank(BankMsg::Send {
                to_address: royalty_info.address,
                amount: vec![Coin {
                    amount: royalty_info.royalty_amount,
                    denom: fund.denom.clone(),
                }],
            }));
        }

        messages.push(CosmosMsg::Bank(BankMsg::Send {
            to_address: nft_info.owner.to_string(),
            amount: vec![fund],
        }));

        NFT_LIST.remove(deps.storage, key);
    } else {
        return Err(StdError::generic_err("NFT is not listed!"));
    }

    Ok(Response::new()
        .add_messages(messages)
        .add_attribute("action", "buy"))
}

// Only owner can execute it.
pub fn execute_withdraw_fee(deps: DepsMut, env: Env, info: MessageInfo) -> StdResult<Response> {
    let config: Config = CONFIG.load(deps.storage)?;
    // permission check
    if info.sender != config.owner {
        return Err(StdError::generic_err("unauthorized"));
    }

    let coins = deps.querier.query_all_balances(env.contract.address)?;

    Ok(Response::new()
        .add_message(CosmosMsg::Bank(BankMsg::Send {
            to_address: info.sender.to_string(),
            amount: coins,
        }))
        .add_attributes(vec![attr("action", "withdraw_fee")]))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::Config {} => to_binary(&query_config(deps)?),
        QueryMsg::NftInfo {
            nft_contract_addr,
            nft_token_id,
        } => to_binary(&query_nft_info(deps, nft_contract_addr, nft_token_id)?),
    }
}

pub fn query_config(deps: Deps) -> StdResult<ConfigResponse> {
    let config = CONFIG.load(deps.storage)?;

    Ok(ConfigResponse {
        owner: config.owner.to_string(),
        fee_bp: config.fee_bp,
    })
}

pub fn query_nft_info(
    deps: Deps,
    nft_contract_addr: String,
    nft_token_id: String,
) -> StdResult<Option<NFTInfo>> {
    NFT_LIST.may_load(
        deps.storage,
        query_nft_info_key(nft_contract_addr, nft_token_id),
    )
}

pub fn query_nft_info_key(nft_contract_addr: String, nft_token_id: String) -> String {
    nft_contract_addr.to_string() + &nft_token_id
}

pub fn query_royalties_info(
    deps: Deps,
    contract_addr: String,
    token_id: String,
    sale_price: Uint128,
) -> StdResult<cw2981_royalties::msg::RoyaltiesInfoResponse> {
    let check: Result<cw2981_royalties::msg::CheckRoyaltiesResponse, StdError> =
        deps.querier.query(&QueryRequest::Wasm(WasmQuery::Smart {
            contract_addr: contract_addr.to_owned(),
            msg: to_json_binary(&cw2981_royalties::QueryMsg::Extension {
                msg: Cw2981QueryMsg::CheckRoyalties {},
            })?,
        }));
    if let Ok(check) = check {
        if check.royalty_payments {
            let royalties_info: Result<cw2981_royalties::msg::RoyaltiesInfoResponse, StdError> =
                deps.querier.query(&QueryRequest::Wasm(WasmQuery::Smart {
                    contract_addr: contract_addr.to_owned(),
                    msg: to_json_binary(&cw2981_royalties::QueryMsg::Extension {
                        msg: Cw2981QueryMsg::RoyaltyInfo {
                            token_id: token_id.to_owned(),
                            sale_price,
                        },
                    })?,
                }));
            if let Ok(royalties_info) = royalties_info {
                return Ok(royalties_info);
            }
        }
    }

    let borked_response: Result<RoyaltiesInfoResponse, _> =
        deps.querier.query(&QueryRequest::Wasm(WasmQuery::Smart {
            contract_addr,
            msg: to_binary(&NftQueryMsg::Extension {
                msg: Cw2981BorkedQueryMsg::RoyaltyInfo {
                    token_id,
                    sale_price,
                },
            })?,
        }));
    borked_response.map(
        |borked_response| cw2981_royalties::msg::RoyaltiesInfoResponse {
            address: borked_response.address,
            royalty_amount: borked_response.royalty_amount,
        },
    )
}

#[cfg(test)]
mod tests {
    use crate::{contract::query_nft_info, state::NFTInfo};

    use super::{
        execute, instantiate, query_config, Cw721ExecuteMsg, Cw721ReceiveMsg, ExecuteMsg,
        InstantiateMsg,
    };
    use crate::vault::Cw721HookMsg;
    use cosmwasm_std::{
        testing::{mock_dependencies, mock_dependencies_with_balance, mock_env, mock_info},
        to_binary, BankMsg, Coin, CosmosMsg, Uint128, WasmMsg,
    };

    fn mock_instantiate_msg(fee_bp: Uint128) -> InstantiateMsg {
        InstantiateMsg { fee_bp }
    }

    #[test]
    fn test_instantiate() {
        let mut deps = mock_dependencies();

        // create owner
        let owner_address = "owner-addr".to_string();
        let owner_info = mock_info(&owner_address, &[]);

        // instantiate minter
        let init_msg = mock_instantiate_msg(Uint128::new(100)); // 1% fee_bp
        instantiate(
            deps.as_mut(),
            mock_env(),
            owner_info.clone(),
            init_msg.clone(),
        )
        .unwrap();

        // check config
        let config = query_config(deps.as_ref()).unwrap();
        assert_eq!(config.owner, owner_address);
        assert_eq!(config.fee_bp, Uint128::new(100));
    }

    #[test]
    fn test_update_config() {
        let mut deps = mock_dependencies();

        // create owner
        let owner_address = "owner-addr".to_string();
        let owner_info = mock_info(&owner_address, &[]);

        // instantiate minter
        let init_msg = mock_instantiate_msg(Uint128::new(100)); // 1% fee_bp
        instantiate(
            deps.as_mut(),
            mock_env(),
            owner_info.clone(),
            init_msg.clone(),
        )
        .unwrap();

        let user_address = "user-addr".to_string();
        let user_info = mock_info(&user_address, &[]);

        // 1. only owner can update config
        let err = execute(
            deps.as_mut(),
            mock_env(),
            user_info.clone(),
            ExecuteMsg::UpdateConfig {
                owner: None,
                fee_bp: Some(Uint128::new(200)), // 2%
            },
        )
        .unwrap_err();
        assert_eq!(err.to_string(), "Generic error: unauthorized");

        // 2. owner field can be none and it will only update fee_bp
        execute(
            deps.as_mut(),
            mock_env(),
            owner_info.clone(),
            ExecuteMsg::UpdateConfig {
                owner: None,
                fee_bp: Some(Uint128::new(200)), // 2%
            },
        )
        .unwrap();
        let config = query_config(deps.as_ref()).unwrap();
        assert_eq!(config.owner, owner_address);
        assert_eq!(config.fee_bp, Uint128::new(200));

        // 3. owner can transfer ownership
        execute(
            deps.as_mut(),
            mock_env(),
            owner_info.clone(),
            ExecuteMsg::UpdateConfig {
                owner: Some(user_address.clone()),
                fee_bp: Some(Uint128::new(200)), // 2%
            },
        )
        .unwrap();
        let config = query_config(deps.as_ref()).unwrap();
        assert_eq!(config.owner, user_address);
        assert_eq!(config.fee_bp, Uint128::new(200));
    }

    #[test]
    fn test_nft_list() {
        let mut deps = mock_dependencies();

        // create owner
        let owner_address = "owner-addr".to_string();
        let owner_info = mock_info(&owner_address, &[]);

        // instantiate minter
        let init_msg = mock_instantiate_msg(Uint128::new(100)); // 1% fee_bp
        instantiate(
            deps.as_mut(),
            mock_env(),
            owner_info.clone(),
            init_msg.clone(),
        )
        .unwrap();

        let user_address = "user-addr".to_string();
        let contract_address = "contract-addr".to_string();
        let token_id = "1".to_string();
        let denom = "utori".to_string();
        let amount = Uint128::new(100000000); // 100 TORI

        execute(
            deps.as_mut(),
            mock_env(),
            mock_info(&contract_address, &[]),
            ExecuteMsg::ReceiveNft(Cw721ReceiveMsg {
                sender: user_address.clone(),
                token_id: token_id.clone(),
                msg: to_binary(&Cw721HookMsg::Deposit {
                    denom: denom.clone(),
                    amount,
                })
                .unwrap(),
            }),
        )
        .unwrap();

        let nft_info = query_nft_info(deps.as_ref(), contract_address, token_id).unwrap();
        assert_eq!(
            nft_info,
            Some(NFTInfo {
                owner: user_address,
                denom,
                amount,
            })
        );
    }

    #[test]
    fn test_nft_withdraw() {
        let mut deps = mock_dependencies();

        // create owner
        let owner_address = "owner-addr".to_string();
        let owner_info = mock_info(&owner_address, &[]);

        // instantiate minter
        let init_msg = mock_instantiate_msg(Uint128::new(100)); // 1% fee_bp
        instantiate(
            deps.as_mut(),
            mock_env(),
            owner_info.clone(),
            init_msg.clone(),
        )
        .unwrap();

        let user_address = "user-addr".to_string();
        let contract_address = "contract-addr".to_string();
        let token_id = "1".to_string();
        let denom = "utori".to_string();
        let amount = Uint128::new(100000000); // 100 TORI

        execute(
            deps.as_mut(),
            mock_env(),
            mock_info(&contract_address, &[]),
            ExecuteMsg::ReceiveNft(Cw721ReceiveMsg {
                sender: user_address.clone(),
                token_id: token_id.clone(),
                msg: to_binary(&Cw721HookMsg::Deposit {
                    denom: denom.clone(),
                    amount,
                })
                .unwrap(),
            }),
        )
        .unwrap();

        // 1. only nft owner can withdraw
        let err = execute(
            deps.as_mut(),
            mock_env(),
            mock_info(&owner_address, &[]),
            ExecuteMsg::Withdraw {
                nft_contract_addr: contract_address.clone(),
                nft_token_id: token_id.clone(),
            },
        )
        .unwrap_err();
        assert_eq!(
            err.to_string(),
            "Generic error: This NFT is not owned to the user!"
        );

        // 2. withdarw nft and it will be unlisted from marketplace
        execute(
            deps.as_mut(),
            mock_env(),
            mock_info(&user_address, &[]),
            ExecuteMsg::Withdraw {
                nft_contract_addr: contract_address.clone(),
                nft_token_id: token_id.clone(),
            },
        )
        .unwrap();

        let nft_info = query_nft_info(deps.as_ref(), contract_address, token_id).unwrap();
        assert_eq!(nft_info, None);
    }

    #[test]
    fn test_update_price() {
        let mut deps = mock_dependencies();

        // create owner
        let owner_address = "owner-addr".to_string();
        let owner_info = mock_info(&owner_address, &[]);

        // instantiate minter
        let init_msg = mock_instantiate_msg(Uint128::new(100)); // 1% fee_bp
        instantiate(
            deps.as_mut(),
            mock_env(),
            owner_info.clone(),
            init_msg.clone(),
        )
        .unwrap();

        let user_address = "user-addr".to_string();
        let contract_address = "contract-addr".to_string();
        let token_id = "1".to_string();
        let denom = "utori".to_string();
        let amount = Uint128::new(100000000); // 100 TORI

        execute(
            deps.as_mut(),
            mock_env(),
            mock_info(&contract_address, &[]),
            ExecuteMsg::ReceiveNft(Cw721ReceiveMsg {
                sender: user_address.clone(),
                token_id: token_id.clone(),
                msg: to_binary(&Cw721HookMsg::Deposit {
                    denom: denom.clone(),
                    amount,
                })
                .unwrap(),
            }),
        )
        .unwrap();

        let new_denom = "new-denom".to_string();
        let new_amount = Uint128::new(1000000000); // 1000

        // 1. only nft owner can update price
        let err = execute(
            deps.as_mut(),
            mock_env(),
            mock_info(&owner_address, &[]),
            ExecuteMsg::UpdatePrice {
                nft_contract_addr: contract_address.clone(),
                nft_token_id: token_id.clone(),
                denom: new_denom.clone(),
                amount: new_amount,
            },
        )
        .unwrap_err();
        assert_eq!(
            err.to_string(),
            "Generic error: This NFT is not owned to the user!"
        );

        // 2. withdarw nft and it will be unlisted from marketplace
        execute(
            deps.as_mut(),
            mock_env(),
            mock_info(&user_address, &[]),
            ExecuteMsg::UpdatePrice {
                nft_contract_addr: contract_address.clone(),
                nft_token_id: token_id.clone(),
                denom: new_denom.clone(),
                amount: new_amount,
            },
        )
        .unwrap();

        let nft_info = query_nft_info(deps.as_ref(), contract_address, token_id).unwrap();
        assert_eq!(
            nft_info,
            Some(NFTInfo {
                owner: user_address,
                denom: new_denom,
                amount: new_amount,
            })
        );
    }

    #[test]
    fn test_nft_buy() {
        let mut deps = mock_dependencies();

        // create owner
        let owner_address = "owner-addr".to_string();
        let owner_info = mock_info(&owner_address, &[]);

        // instantiate minter
        let init_msg = mock_instantiate_msg(Uint128::new(100)); // 1% fee_bp
        instantiate(
            deps.as_mut(),
            mock_env(),
            owner_info.clone(),
            init_msg.clone(),
        )
        .unwrap();

        let user_address = "user-addr".to_string();
        let contract_address = "contract-addr".to_string();
        let token_id = "1".to_string();
        let denom = "utori".to_string();
        let amount = Uint128::new(100000000); // 100 TORI

        execute(
            deps.as_mut(),
            mock_env(),
            mock_info(&contract_address, &[]),
            ExecuteMsg::ReceiveNft(Cw721ReceiveMsg {
                sender: user_address.clone(),
                token_id: token_id.clone(),
                msg: to_binary(&Cw721HookMsg::Deposit {
                    denom: denom.clone(),
                    amount,
                })
                .unwrap(),
            }),
        )
        .unwrap();

        let buyer_address = "buyer-addr".to_string();
        // 1. can buy only listed asset
        let invalid_token_id = "2".to_string();
        let err = execute(
            deps.as_mut(),
            mock_env(),
            mock_info(&buyer_address, &[]),
            ExecuteMsg::Buy {
                nft_contract_addr: contract_address.clone(),
                nft_token_id: invalid_token_id.clone(),
            },
        )
        .unwrap_err();
        assert_eq!(err.to_string(), "Generic error: NFT is not listed!");

        // 2. check correct fund denom
        let invalid_denom = "invalid-denom".to_string();
        let err = execute(
            deps.as_mut(),
            mock_env(),
            mock_info(
                &buyer_address,
                &[{
                    Coin {
                        denom: invalid_denom,
                        amount: Uint128::new(0),
                    }
                }],
            ),
            ExecuteMsg::Buy {
                nft_contract_addr: contract_address.clone(),
                nft_token_id: token_id.clone(),
            },
        )
        .unwrap_err();
        assert_eq!(
            err.to_string(),
            "Generic error: The payment is not matched with the selling price!"
        );

        // 3. check correct fund amount
        let err = execute(
            deps.as_mut(),
            mock_env(),
            mock_info(
                &buyer_address,
                &[{
                    Coin {
                        denom: denom.to_string(),
                        amount: Uint128::new(0),
                    }
                }],
            ),
            ExecuteMsg::Buy {
                nft_contract_addr: contract_address.clone(),
                nft_token_id: token_id.clone(),
            },
        )
        .unwrap_err();
        assert_eq!(
            err.to_string(),
            "Generic error: The payment is not matched with the selling price!"
        );

        // 4. can buy nft & it's unlsited
        let resp = execute(
            deps.as_mut(),
            mock_env(),
            mock_info(
                &buyer_address,
                &[{
                    Coin {
                        denom: denom.to_string(),
                        amount,
                    }
                }],
            ),
            ExecuteMsg::Buy {
                nft_contract_addr: contract_address.clone(),
                nft_token_id: token_id.clone(),
            },
        )
        .unwrap();
        assert_eq!(
            resp.messages[0].msg,
            CosmosMsg::Wasm(WasmMsg::Execute {
                contract_addr: contract_address.clone(),
                msg: to_binary(&Cw721ExecuteMsg::TransferNft {
                    recipient: buyer_address.clone(),
                    token_id: token_id.clone(),
                })
                .unwrap(),
                funds: vec![],
            })
        );
        assert_eq!(
            resp.messages[1].msg,
            CosmosMsg::Bank(BankMsg::Send {
                to_address: user_address,
                amount: vec![{
                    Coin {
                        amount: Uint128::new(100000000) * Uint128::new(99) / Uint128::new(100), // fee is removed
                        denom: denom.clone(),
                    }
                }],
            })
        );

        let nft_info = query_nft_info(deps.as_ref(), contract_address, token_id).unwrap();
        assert_eq!(nft_info, None);
    }

    #[test]
    fn test_withdraw_fee() {
        let denom = "utori".to_string();
        let amount = Uint128::new(100000000); // 100 TORI
        let mut deps = mock_dependencies_with_balance(&[Coin {
            denom: denom.clone(),
            amount: amount / Uint128::new(100),
        }]);

        // create owner
        let owner_address = "owner-addr".to_string();
        let owner_info = mock_info(&owner_address, &[]);

        // instantiate minter
        let init_msg = mock_instantiate_msg(Uint128::new(100)); // 1% fee_bp
        instantiate(
            deps.as_mut(),
            mock_env(),
            owner_info.clone(),
            init_msg.clone(),
        )
        .unwrap();

        let user_address = "user-addr".to_string();
        let contract_address = "contract-addr".to_string();
        let token_id = "1".to_string();

        execute(
            deps.as_mut(),
            mock_env(),
            mock_info(&contract_address, &[]),
            ExecuteMsg::ReceiveNft(Cw721ReceiveMsg {
                sender: user_address.clone(),
                token_id: token_id.clone(),
                msg: to_binary(&Cw721HookMsg::Deposit {
                    denom: denom.clone(),
                    amount,
                })
                .unwrap(),
            }),
        )
        .unwrap();

        let buyer_address = "buyer-addr".to_string();
        execute(
            deps.as_mut(),
            mock_env(),
            mock_info(
                &buyer_address,
                &[{
                    Coin {
                        denom: denom.to_string(),
                        amount,
                    }
                }],
            ),
            ExecuteMsg::Buy {
                nft_contract_addr: contract_address.clone(),
                nft_token_id: token_id.clone(),
            },
        )
        .unwrap();

        // 1. only owner can update config
        let err = execute(
            deps.as_mut(),
            mock_env(),
            mock_info(&user_address, &[]),
            ExecuteMsg::WithdrawFee {},
        )
        .unwrap_err();
        assert_eq!(err.to_string(), "Generic error: unauthorized");

        // 2. can withdraw fees from contract
        let resp = execute(
            deps.as_mut(),
            mock_env(),
            mock_info(&owner_address, &[]),
            ExecuteMsg::WithdrawFee {},
        )
        .unwrap();
        assert_eq!(
            resp.messages[0].msg,
            CosmosMsg::Bank(BankMsg::Send {
                to_address: owner_address,
                amount: vec![{
                    Coin {
                        amount: Uint128::new(100000000) / Uint128::new(100), // fee is removed
                        denom: denom.clone(),
                    }
                }],
            })
        );
    }
}
