use cosmwasm_std::Attribute;
use sylvia::cw_multi_test::AppResponse;

fn has_attr(given_attrs: &Vec<Attribute>, expected_attr: &Attribute) -> bool {
    let resp = given_attrs
        .iter()
        .find(|item| item.key == expected_attr.key && item.value == expected_attr.value);
    resp.is_some()
}

pub fn assert_wasm_attr(resp: AppResponse, expected_attr: Attribute) {
    let wasm_attrs: Vec<Attribute> = resp
        .events
        .iter()
        .filter(|event| event.ty == "wasm")
        .flat_map(|event| event.attributes.clone())
        .collect();

    if !has_attr(&wasm_attrs, &expected_attr) {
        panic!(
            "Attribute not found. Wasm attrs: {:?} - Expected attr: {:?}",
            wasm_attrs, expected_attr
        )
    }
}
