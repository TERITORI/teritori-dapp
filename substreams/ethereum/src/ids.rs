pub fn collection_id(minter: &String) -> String {
    return format!("eth-{}", minter);
}

pub fn nft_id(minter: &String, token_id: &u64) -> String {
    return format!("eth-{}-{}", minter, token_id);
}

pub fn user_id(user: &String) -> String {
    return format!("eth-{}", user);
}

pub fn activity_id(tx_hash: &String, log_id: &u64) -> String {
    return format!("eth-{}-{}", tx_hash, log_id);
}