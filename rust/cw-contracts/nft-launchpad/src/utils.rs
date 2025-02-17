use cosmwasm_std::Event;

pub fn get_events_values(ev: &Vec<Event>, ty: &str, key: &str) -> Vec<String> {
    ev.iter()
        .filter(|v| v.ty == ty)
        .map(|v| {
            v.attributes
                .iter()
                .find(|vv| vv.key == key)
                .map(|vv| vv.value.clone())
        })
        .filter_map(|v| v)
        .collect()
}
