use sylvia::multitest::App;

use crate::contract::{multitest_utils::CodeId, Action, News};
use crate::error::ContractError;

#[test]
fn basic_full_flow() {
    let app = App::default();
    let code_id = CodeId::store_code(&app);

    let admin = "admin";
    let new_admin = "new_admin";
    let contract_creator = "creator";
    let unauthorized_sender = "unauthorized_sender";
    
    let action = Action {
        label: "".to_string(),
        url: "".to_string()
    };
    let news_item = News {
        title: "a".to_string(),
        subtitle: "a".to_string(),
        text: "a".to_string(),
        image: "a".to_string(),
        actions: Some(vec![action])
    };
    let news = vec![news_item];

    // Instantiate the contract
    let contract = code_id
    .instantiate(
        admin.to_string(),
    )
    .call(contract_creator)
    .unwrap();

    // Test get_config
    let config = contract.get_config().unwrap();
    assert_eq!(config.admin_addr, admin.to_string());

    // Test update_config with unauthorized sender
    let failed_update_config_res = contract
    .update_config(new_admin.to_string())
    .call(unauthorized_sender);
    assert_eq!(
        failed_update_config_res.err().unwrap(),
        ContractError::Unauthorized
    );
    // Test update_config with authorized sender, then get_config
    contract
    .update_config(new_admin.to_string())
    .call(admin)
    .unwrap();
    let new_config = contract.get_config().unwrap();
    assert_eq!(new_config.admin_addr, new_admin.to_string());

    // Test update_news with unauthorized sender
    let failed_update_news_res = contract
    .update_news(news.clone())
    .call(unauthorized_sender);
    assert_eq!(
        failed_update_news_res.err().unwrap(),
        ContractError::Unauthorized
    );
    // Test update_news with authorized sender
    contract
    .update_news(news.clone())
    .call(new_admin)
    .unwrap();
     // Test get_news
     contract
     .get_news()
     .unwrap();

}
