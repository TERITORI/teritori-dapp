#[cfg(test)]

mod test {
    use std::fmt::Debug;

    use crate::{
        execute, instantiate,
        msg::{ExecMsg, InstantiateMsg, QueryMsg},
        query,
        state::Collection,
    };
    use cosmwasm_schema::serde::Serialize;
    use cosmwasm_std::{Addr, StdError, StdResult};
    use cw_multi_test::{App, AppResponse, ContractWrapper, Executor, error::AnyResult};

    struct AppContext {
        app: App,
        contract_addr: Addr,
    }

    trait Shortcut {
        fn query<T: for<'de> cosmwasm_schema::serde::Deserialize<'de>>(
            &self,
            msg: &impl Serialize,
        ) -> Result<T, StdError>;
        fn exec<T: Serialize + Debug>(&mut self, msg: &T) -> AnyResult<AppResponse>;
    }

    impl Shortcut for AppContext {
        fn query<T>(&self, msg: &impl Serialize) -> StdResult<T>
        where
            T: for<'de> cosmwasm_schema::serde::Deserialize<'de>,
        {
            self.app
                .wrap()
                .query_wasm_smart(&self.contract_addr, msg)
        }

        fn exec<T: Serialize + Debug>(&mut self, msg: &T) -> AnyResult<AppResponse> {
            self.app
                .execute_contract(
                    Addr::unchecked("creator"),
                    self.contract_addr.clone(),
                    msg,
                    &[],
                )
        }

    }

    fn get_app_context() -> AppContext {
        let (app, contract_addr) = get_context();
        let app_ctx = AppContext { app, contract_addr };
        app_ctx
    }

    fn get_context() -> (App, Addr) {
        let mut app = App::default();

        let contract_wrapper = ContractWrapper::new(execute, instantiate, query);
        let launchpad_contract = Box::new(contract_wrapper);

        let contract_id = app.store_code(launchpad_contract);

        let contract_addr = app
            .instantiate_contract(
                // deployed contract id
                contract_id,
                // sender address
                Addr::unchecked("creator"),
                // message sent to contract
                &InstantiateMsg {
                    name: String::from("teritori launchpad"),
                },
                // native funds send to contract
                &[],
                // label of contract
                "Teritori Launchpad Contract",
                // admin of contract (who can do migration later)
                None,
            )
            .unwrap();

        (app, contract_addr)
    }

    fn create_default_collection() -> AppContext {
        let mut app_ctx = get_app_context();

        // Create collection
        let create_collection_msg = ExecMsg::CreateCollection {
            name: String::from("My collection"),
            image_uri: String::from("https://myimage.png"),
        };
        let _ = app_ctx.exec(&create_collection_msg);

        app_ctx
    }

    #[test]
    fn create_collection() {
        create_default_collection();
    }

    #[test]
    fn query_collection() {
        let app_ctx = create_default_collection();

        // Query collection
        let query_collection_msg = QueryMsg::Collection { idx: 1 };
        let resp: Collection = app_ctx.query(&query_collection_msg).unwrap();

        assert_eq!(
            resp,
            Collection {
                creator: Addr::unchecked("creator"),
                name: String::from("My collection"),
                image_uri: String::from("https://myimage.png"),
                merkle_root: None
            }
        );
    }

}
