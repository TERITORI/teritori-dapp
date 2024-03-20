use std::env::current_dir;
use std::fs::create_dir_all;

use cosmwasm_schema::{export_schema, export_schema_with_title, remove_schemas, schema_for};
use nft_marketplace::{
    state::NFTInfo,
    vault::{
        ConfigResponse, ExecuteMsg, InstantiateMsg, NftQueryMsg, QueryMsg, RoyaltiesInfoResponse,
    },
};

fn main() {
    let mut out_dir = current_dir().unwrap();
    out_dir.push("schema");
    create_dir_all(&out_dir).unwrap();
    remove_schemas(&out_dir).unwrap();

    export_schema(&schema_for!(InstantiateMsg), &out_dir);
    export_schema(&schema_for!(ExecuteMsg), &out_dir);
    export_schema(&schema_for!(QueryMsg), &out_dir);

    // Query responses
    export_schema(&schema_for!(ConfigResponse), &out_dir);
    export_schema_with_title(&schema_for!(Vec<NFTInfo>), &out_dir, "NftListResponse");
    export_schema_with_title(
        &schema_for!(Vec<NFTInfo>),
        &out_dir,
        "AllNftsInVaultResponse",
    );
    export_schema_with_title(&schema_for!(NFTInfo), &out_dir, "NftInfoResponse");
    export_schema_with_title(&schema_for!(String), &out_dir, "NftOwnerInfoResponse");
    export_schema_with_title(&schema_for!(NftQueryMsg), &out_dir, "NftQueryMsg");
    export_schema_with_title(
        &schema_for!(RoyaltiesInfoResponse),
        &out_dir,
        "RoyaltiesInfoResponse",
    );
}
