/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.35.7.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

export type Uint128 = string;
export type AllNftsInVaultResponse = NFTInfo[];
export interface NFTInfo {
  amount: Uint128;
  denom: string;
  owner: string;
  [k: string]: unknown;
}
export interface ConfigResponse {
  fee_bp: Uint128;
  owner: string;
  [k: string]: unknown;
}
export type ExecuteMsg = {
  update_config: {
    fee_bp?: Uint128 | null;
    owner?: string | null;
    [k: string]: unknown;
  };
} | {
  receive_nft: Cw721ReceiveMsg;
} | {
  withdraw: {
    nft_contract_addr: string;
    nft_token_id: string;
    [k: string]: unknown;
  };
} | {
  update_price: {
    amount: Uint128;
    denom: string;
    nft_contract_addr: string;
    nft_token_id: string;
    [k: string]: unknown;
  };
} | {
  buy: {
    nft_contract_addr: string;
    nft_token_id: string;
    [k: string]: unknown;
  };
} | {
  withdraw_fee: {
    [k: string]: unknown;
  };
};
export type Binary = string;
export interface Cw721ReceiveMsg {
  msg: Binary;
  sender: string;
  token_id: string;
  [k: string]: unknown;
}
export interface InstantiateMsg {
  fee_bp: Uint128;
  [k: string]: unknown;
}
export interface NftInfoResponse {
  amount: Uint128;
  denom: string;
  owner: string;
  [k: string]: unknown;
}
export type NftListResponse = NFTInfo[];
export type NftOwnerInfoResponse = string;
export type NftQueryMsg = {
  owner_of: {
    include_expired?: boolean | null;
    token_id: string;
  };
} | {
  approval: {
    include_expired?: boolean | null;
    spender: string;
    token_id: string;
  };
} | {
  approvals: {
    include_expired?: boolean | null;
    token_id: string;
  };
} | {
  all_operators: {
    include_expired?: boolean | null;
    limit?: number | null;
    owner: string;
    start_after?: string | null;
  };
} | {
  num_tokens: {};
} | {
  contract_info: {};
} | {
  nft_info: {
    token_id: string;
  };
} | {
  all_nft_info: {
    include_expired?: boolean | null;
    token_id: string;
  };
} | {
  tokens: {
    limit?: number | null;
    owner: string;
    start_after?: string | null;
  };
} | {
  all_tokens: {
    limit?: number | null;
    start_after?: string | null;
  };
} | {
  minter: {};
} | {
  extension: {
    msg: Cw2981BorkedQueryMsg;
  };
};
export type Cw2981BorkedQueryMsg = {
  RoyaltyInfo: {
    sale_price: Uint128;
    token_id: string;
    [k: string]: unknown;
  };
} | {
  CheckRoyalties: {
    [k: string]: unknown;
  };
};
export type QueryMsg = {
  config: {
    [k: string]: unknown;
  };
} | {
  nft_info: {
    nft_contract_addr: string;
    nft_token_id: string;
    [k: string]: unknown;
  };
};
export interface RoyaltiesInfoResponse {
  address: string;
  royalty_amount: Uint128;
  [k: string]: unknown;
}