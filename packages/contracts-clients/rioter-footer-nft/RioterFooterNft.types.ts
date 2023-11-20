/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.35.3.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

export type Addr = string;
export interface ConfigResponse {
  owner: Addr;
  [k: string]: unknown;
}
export interface Config {
  owner: Addr;
  [k: string]: unknown;
}
export type ExecuteMsg = {
  update_config: {
    owner: string;
    [k: string]: unknown;
  };
} | {
  update_fee_config: {
    fee_per_size: Uint128;
    [k: string]: unknown;
  };
} | {
  update_map_size: {
    height: Uint128;
    width: Uint128;
    [k: string]: unknown;
  };
} | {
  set_whitelisted_collection: {
    collection: string;
    whitelist: boolean;
    [k: string]: unknown;
  };
} | {
  add_my_nft: {
    additional: string;
    contract_address: string;
    position: NftPosition;
    token_id: string;
    [k: string]: unknown;
  };
};
export type Uint128 = string;
export interface NftPosition {
  height: Uint128;
  width: Uint128;
  x: Uint128;
  y: Uint128;
  [k: string]: unknown;
}
export interface FeeConfig {
  fee_per_size: Uint128;
  [k: string]: unknown;
}
export interface InstantiateMsg {
  fee_per_size: Uint128;
  height: Uint128;
  width: Uint128;
  [k: string]: unknown;
}
export interface MapSize {
  height: Uint128;
  width: Uint128;
  [k: string]: unknown;
}
export interface NftData {
  additional: string;
  contract_address: string;
  position: NftPosition;
  token_id: string;
  [k: string]: unknown;
}
export interface QueryFeeConfigResponse {
  fee_per_size: Uint128;
  [k: string]: unknown;
}
export interface QueryMapSizeResponse {
  height: Uint128;
  width: Uint128;
  [k: string]: unknown;
}
export type QueryMsg = {
  config: {
    [k: string]: unknown;
  };
} | {
  query_fee_config: {
    [k: string]: unknown;
  };
} | {
  query_map_size: {
    [k: string]: unknown;
  };
} | {
  query_nft_count: {
    [k: string]: unknown;
  };
} | {
  query_nfts: {
    from: number;
    to: number;
    [k: string]: unknown;
  };
};
export type QueryNftCountResponse = number;
export type QueryNftsResponse = NftData[];