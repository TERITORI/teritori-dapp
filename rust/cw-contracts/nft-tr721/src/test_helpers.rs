use cosmwasm_std::{Attribute, HexBinary, Uint128};
use cw2981_royalties::{Metadata, Trait};
use cw_multi_test::AppResponse;
use rs_merkle::{Hasher, MerkleTree};

use crate::{
    contract::{MintInfo, MintPeriod, WhitelistInfo},
    hasher::TrKeccak256,
};

pub const METADATAS_MERKLE_ROOT: &str =
    "0110bb1a773c10cce02033f0594eda56df7b9ca30137520327b804107b252001";
pub const WHITELIST_USER: &str = "whitelist_user";
pub const DEFAULT_BLOCK_TIME: u64 = 1_571_797_419;

pub fn get_default_nfts() -> Vec<Metadata> {
    let nft0 = Metadata {
        name: Some("nft #0".to_string()),
        image: Some("image0".to_string()),
        attributes: Some(vec![
            Trait {
                display_type: None,
                trait_type: "type0".to_string(),
                value: "value0".to_string(),
            },
            Trait {
                display_type: None,
                trait_type: "type1".to_string(),
                value: "value1".to_string(),
            },
        ]),
        royalty_percentage: Some(9),
        ..Metadata::default()
    };
    let nft1 = Metadata {
        name: Some("nft #1".to_string()),
        image: Some("image1".to_string()),
        attributes: Some(vec![Trait {
            display_type: None,
            trait_type: "type1".to_string(),
            value: "value1".to_string(),
        }]),
        royalty_percentage: Some(5),
        ..Metadata::default()
    };
    let nft2 = Metadata {
        name: Some("nft #2".to_string()),
        image: Some("image2".to_string()),
        attributes: Some(vec![Trait {
            display_type: Some("attr2".to_string()),
            trait_type: "type2".to_string(),
            value: "value2".to_string(),
        }]),
        ..Metadata::default()
    };
    let nft3 = Metadata {
        name: Some("nft #3".to_string()),
        image: Some("image3".to_string()),
        attributes: Some(vec![Trait {
            display_type: Some("attr3".to_string()),
            trait_type: "type3".to_string(),
            value: "value3".to_string(),
        }]),
        ..Metadata::default()
    };

    vec![nft0, nft1, nft2, nft3]
}

pub fn get_default_period() -> MintPeriod {
    MintPeriod {
        unit_price: Uint128::new(1),
        denom: "denom".to_string(),
        limit_per_address: Some(2),

        start_time: DEFAULT_BLOCK_TIME,
        end_time: Some(DEFAULT_BLOCK_TIME),
        max_tokens: Some(1),

        whitelist_info: Some(WhitelistInfo {
            addresses_merkle_root: "".to_string(),
            addresses_count: 1,
            addresses_ipfs: "ipfs_path".to_string(),
        }),
    }
}

pub fn get_merkle_tree(leaf_values: Vec<&str>) -> MerkleTree<TrKeccak256> {
    let leaves: Vec<[u8; 32]> = leaf_values
        .iter()
        .map(|x| TrKeccak256::hash(x.as_bytes()))
        .collect();
    MerkleTree::<TrKeccak256>::from_leaves(&leaves)
}

pub fn get_merkle_tree_info(leaf_values: Vec<&str>, needed_leaf_indice: usize) -> (String, String) {
    let tree = get_merkle_tree(leaf_values);
    let root_hex = HexBinary::from(tree.root().unwrap()).to_string();
    let proof = tree.proof(&vec![needed_leaf_indice]);
    let proof_hex = HexBinary::from(proof.to_bytes().to_owned()).to_string();

    (root_hex, proof_hex)
}

pub fn get_default_periods() -> Vec<MintPeriod> {
    vec![]
}

pub fn get_default_mint_info() -> MintInfo {
    MintInfo {
        tokens_count: get_default_nfts().len().try_into().unwrap(),
        metadatas_merkle_root: METADATAS_MERKLE_ROOT.to_string(),
        royalty_address: None,
        royalty_percentage: None,
    }
}

pub fn has_attr(given_attrs: &Vec<Attribute>, expected_attr: &Attribute) -> bool {
    let resp = given_attrs
        .iter()
        .find(|item| item.key == expected_attr.key && item.value == expected_attr.value);
    resp.is_some()
}

pub fn assert_wasm_attr(resp: AppResponse, expected_attr: Attribute) {
    // app.events[0]: exec events
    // app.events[1]: wasm events
    let wasm_attrs = &resp.events[1].attributes;

    if !has_attr(wasm_attrs, &expected_attr) {
        panic!(
            "Attribute not found. Wasm attrs: {:?} - Expected attr: {:?}",
            wasm_attrs, expected_attr
        )
    }
}
