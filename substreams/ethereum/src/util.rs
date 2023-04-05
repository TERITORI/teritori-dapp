use crate::{
    abi,
    ParsedTx,
};
use substreams::{scalar::BigInt, log};
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

pub fn get_minter_from_nft(nft_contract: &String) -> String {
    let minter_option = abi::teritori_nft::functions::Minter {}.call(address_decode(nft_contract));
    let minter = address_pretty(&minter_option.unwrap());
    return minter;
}

pub fn address_decode(address_pretty: &String) -> Vec<u8> {
    hex::decode(address_pretty.split("0x").collect::<Vec<&str>>()[1]).unwrap()
}

pub fn read_uint32(input: &[u8]) -> Result<u32, String> {
    if input.len() != 32 {
        return Err(format!("uint32 invalid length: {}", input.len()));
    }
    let as_array: [u8; 4] = input[28..32].try_into().unwrap();
    Ok(u32::from_be_bytes(as_array))
}
