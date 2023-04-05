use substreams_ethereum::pb::eth::v2::Call;
use substreams::log;
use crate::util::{address_pretty, is_match_method_sig};


#[derive(Debug)]
pub struct WhiteList {
    contract_addr: String,
    method_sig: String,
}

pub fn get_whitelists() -> [WhiteList; 2] {
    let whitelists: [WhiteList; 2] = [WhiteList {
        contract_addr: env!("SQUAD_STAKING_ADDRESS").to_string(),
        method_sig: "801c5236".to_string(), // stake
    }, WhiteList {
        contract_addr: env!("TERITORI_NFT_ADDRESS").to_string(),
        method_sig: "a6487c53".to_string(), // initialize
    }];

    return whitelists;
}

pub fn is_whitelisted(call: &Call, needed_contract: &str, needed_sig: &str) -> bool {
    let contract = address_pretty(&call.address);

// if contract == "0x7a9e5dbe7d3946ce4ea2f2396549c349635ebf2f" {
//     if call.input.len() >= 4 {
//         let call_method_sig = hex::encode(Vec::from(&call.input[0..4]));
//         log::info!{"{:?}", call_method_sig}
//     }

// }


    return contract == needed_contract && is_match_method_sig(&call, needed_sig);
}

pub fn should_index(call: &Call) -> bool {
    for whitelist in get_whitelists() {
        let should = is_whitelisted(call, &whitelist.contract_addr, &whitelist.method_sig);
        if should {
            return true;
        }
    }
    return false;
}
