/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.35.7.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

export type Uint128 = string;
export interface ConfigResponse {
  is_mintable: boolean;
  mint_max?: Uint128 | null;
  mint_start_time: number;
  minter: string;
  nft_addr: string;
  nft_base_uri: string;
  nft_max_supply: Uint128;
  nft_price_amount: Uint128;
  nft_symbol: string;
  owner: string;
  price_denom: string;
  royalty_payment_address?: string | null;
  royalty_percentage?: number | null;
  secondary_during_mint?: boolean | null;
  whitelist_mint_max?: Uint128 | null;
  whitelist_mint_period: number;
  whitelist_mint_price_amount?: Uint128 | null;
  [k: string]: unknown;
}
export type Addr = string;
export interface Config {
  is_mintable: boolean;
  mint_max?: Uint128 | null;
  mint_start_time: number;
  minter: Addr;
  nft_addr: Addr;
  nft_base_uri: string;
  nft_max_supply: Uint128;
  nft_price_amount: Uint128;
  nft_symbol: string;
  owner: Addr;
  price_denom: string;
  royalty_payment_address?: string | null;
  royalty_percentage?: number | null;
  secondary_during_mint?: boolean | null;
  whitelist_mint_max?: Uint128 | null;
  whitelist_mint_period: number;
  whitelist_mint_price_amount?: Uint128 | null;
  [k: string]: unknown;
}
export type CurrentSupplyResponse = string;
export type ExecuteMsg = {
  update_config: {
    mint_max?: Uint128 | null;
    mint_start_time?: number | null;
    minter?: string | null;
    nft_addr?: Addr | null;
    nft_base_uri?: string | null;
    nft_max_supply?: Uint128 | null;
    nft_price_amount?: Uint128 | null;
    nft_symbol?: string | null;
    owner?: string | null;
    price_denom?: string | null;
    royalty_payment_address?: string | null;
    royalty_percentage?: number | null;
    secondary_during_mint?: boolean | null;
    whitelist_mint_max?: Uint128 | null;
    whitelist_mint_period?: number | null;
    whitelist_mint_price_amount?: Uint128 | null;
    [k: string]: unknown;
  };
} | {
  whitelist: {
    addrs: string[];
    [k: string]: unknown;
  };
} | {
  start_mint: {
    mint_start_time?: number | null;
    [k: string]: unknown;
  };
} | {
  request_mint: {
    addr: Addr;
    [k: string]: unknown;
  };
} | {
  mint: {
    extension?: Metadata | null;
    token_id: string;
    token_uri?: string | null;
    [k: string]: unknown;
  };
} | {
  pause: {
    [k: string]: unknown;
  };
} | {
  unpause: {
    [k: string]: unknown;
  };
} | {
  withdraw_fund: {
    [k: string]: unknown;
  };
};
export interface Metadata {
  animation_url?: string | null;
  attributes?: Attribute[] | null;
  description?: string | null;
  external_url?: string | null;
  image?: string | null;
  name?: string | null;
  royalty_payment_address?: string | null;
  royalty_percentage?: number | null;
  [k: string]: unknown;
}
export interface Attribute {
  trait_type: string;
  value: string;
  [k: string]: unknown;
}
export interface InstantiateMsg {
  mint_max?: Uint128 | null;
  nft_base_uri: string;
  nft_ci: number;
  nft_max_supply: Uint128;
  nft_name: string;
  nft_price_amount: Uint128;
  nft_symbol: string;
  price_denom: string;
  royalty_payment_address?: string | null;
  royalty_percentage?: number | null;
  secondary_during_mint?: boolean | null;
  whitelist_mint_max?: Uint128 | null;
  whitelist_mint_period: number;
  whitelist_mint_price_amount?: Uint128 | null;
  [k: string]: unknown;
}
export type IsWhitelistedResponse = boolean;
export interface MigrateMsg {
  [k: string]: unknown;
}
export type QueryMsg = {
  config: {
    [k: string]: unknown;
  };
} | {
  is_whitelisted: {
    addr: Addr;
    [k: string]: unknown;
  };
} | {
  whitelist_size: {
    [k: string]: unknown;
  };
} | {
  token_requests_count: {
    [k: string]: unknown;
  };
} | {
  current_supply: {
    [k: string]: unknown;
  };
} | {
  token_request_by_index: {
    index: Uint128;
    [k: string]: unknown;
  };
};
export type TokenRequestByIndexResponse = string;
export type TokenRequestsCountResponse = string;
export type WhitelistSizeResponse = number;