use crate::ParsedTx;
use substreams::{scalar::BigInt};
use substreams_ethereum::pb::eth::v2::{Call, TransactionTrace};

pub fn address_pretty(input: &Vec<u8>) -> String {
    format!("0x{}", hex::encode(input))
}

pub fn is_match_method_sig(call: &Call, needed_method_sig: &str) -> bool {
    // Check if call input contains method sig
    if call.input.len() < 4 {
        return false;
    }

    let call_method_sig = hex::encode(Vec::from(&call.input[0..4]));
    return call_method_sig == needed_method_sig;
}

pub fn parse_tx(tx: &TransactionTrace) -> ParsedTx {
    let to = address_pretty(&tx.to);
    let from = address_pretty(&tx.from);
    let hash = address_pretty(&tx.hash);
    let value_option = tx.value.clone();

    let mut value = String::from("0");

    if value_option.is_some() {
        value = BigInt::from_unsigned_bytes_be(&value_option.unwrap().bytes.as_ref()).to_string();
    }

    return ParsedTx {
        to,
        from,
        hash,
        value,
    };
}
