/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.35.7.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

export interface InstantiateMsg {
  admin_addr: string;
  description: string;
  image_uri: string;
  mint_royalties_per10k_default: number;
  name: string;
  symbol: string;
  [k: string]: unknown;
}
export type ExecuteMsg = ExecMsg;
export type ExecMsg = {
  create_channel: {
    memberships_config: MembershipConfig[];
    trade_royalties_addr?: string | null;
    trade_royalties_per10k: number;
    [k: string]: unknown;
  };
} | {
  update_channel: {
    id: Uint64;
    memberships_config?: MembershipConfig[] | null;
    owner?: string | null;
    trade_royalties_addr?: string | null;
    trade_royalties_per10k?: number | null;
    [k: string]: unknown;
  };
} | {
  subscribe: {
    channel_addr: string;
    membership_kind: number;
    recipient_addr: string;
    [k: string]: unknown;
  };
} | {
  update_config: {
    admin_addr?: string | null;
    description?: string | null;
    image_uri?: string | null;
    mint_royalties?: number | null;
    name?: string | null;
    symbol?: string | null;
    [k: string]: unknown;
  };
} | {
  update_channel_mint_platform_fee: {
    channel_addr: string;
    mint_royalties: number;
    [k: string]: unknown;
  };
} | {
  withdraw_mint_platform_fee: {
    destination_addr?: string | null;
    [k: string]: unknown;
  };
} | {
  withdraw_mint_funds: {
    channel_addr: string;
    destination_addr?: string | null;
    [k: string]: unknown;
  };
} | {
  transfer_nft: {
    recipient: string;
    token_id: string;
    [k: string]: unknown;
  };
} | {
  send_nft: {
    contract: string;
    msg: Binary;
    token_id: string;
    [k: string]: unknown;
  };
} | {
  burn: {
    token_id: string;
    [k: string]: unknown;
  };
};
export type Uint64 = string;
export type Uint128 = string;
export type Binary = string;
export interface MembershipConfig {
  description: string;
  display_name: string;
  duration_seconds: Uint64;
  nft_image_uri: string;
  nft_name_prefix: string;
  price: Coin;
}
export interface Coin {
  amount: Uint128;
  denom: string;
  [k: string]: unknown;
}
export type QueryMsg = QueryMsg1;
export type QueryMsg1 = {
  config: {
    [k: string]: unknown;
  };
} | {
  channel: {
    channel_addr: string;
    [k: string]: unknown;
  };
} | {
  admin_funds: {
    [k: string]: unknown;
  };
} | {
  channel_funds: {
    channel_addr: string;
    [k: string]: unknown;
  };
} | {
  subscription: {
    channel_addr: string;
    sub_addr: string;
    [k: string]: unknown;
  };
} | {
  royalty_info: {
    sale_price: Uint128;
    token_id: string;
    [k: string]: unknown;
  };
} | {
  check_royalties: {
    [k: string]: unknown;
  };
} | {
  owner_of: {
    include_expired?: boolean | null;
    token_id: string;
    [k: string]: unknown;
  };
} | {
  num_tokens: {
    [k: string]: unknown;
  };
} | {
  contract_info: {
    [k: string]: unknown;
  };
} | {
  nft_info: {
    token_id: string;
    [k: string]: unknown;
  };
} | {
  all_nft_info: {
    include_expired?: boolean | null;
    token_id: string;
    [k: string]: unknown;
  };
} | {
  tokens: {
    limit?: number | null;
    owner: string;
    start_after?: string | null;
    [k: string]: unknown;
  };
} | {
  all_tokens: {
    limit?: number | null;
    start_after?: string | null;
    [k: string]: unknown;
  };
};
export interface AdminFundsResponse {
  funds: Coin[];
}
export type Expiration = {
  at_height: number;
} | {
  at_time: Timestamp;
} | {
  never: {};
};
export type Timestamp = Uint64;
export interface AllNftInfoResponseForMetadata {
  access: OwnerOfResponse;
  info: NftInfoResponseForMetadata;
}
export interface OwnerOfResponse {
  approvals: Approval[];
  owner: string;
}
export interface Approval {
  expires: Expiration;
  spender: string;
}
export interface NftInfoResponseForMetadata {
  extension: Metadata;
  token_uri?: string | null;
}
export interface Metadata {
  animation_url?: string | null;
  attributes?: Trait[] | null;
  background_color?: string | null;
  description?: string | null;
  external_url?: string | null;
  image?: string | null;
  image_data?: string | null;
  name?: string | null;
  youtube_url?: string | null;
}
export interface Trait {
  display_type?: string | null;
  trait_type: string;
  value: string;
}
export interface TokensResponse {
  tokens: string[];
}
export type Addr = string;
export interface ChannelResponse {
  id: Uint64;
  memberships_config: MembershipConfig[];
  mint_royalties_per10k: number;
  owner_addr: Addr;
  trade_royalties_addr: Addr;
  trade_royalties_per10k: number;
}
export interface ChannelFundsResponse {
  funds: Coin[];
}
export interface CheckRoyaltiesResponse {
  royalty_payments: boolean;
}
export interface Config {
  admin_addr: Addr;
  description: string;
  image_uri: string;
  mint_royalties_per10k_default: number;
  name: string;
  symbol: string;
}
export interface ContractInfoResponse {
  name: string;
  symbol: string;
}
export interface NumTokensResponse {
  count: number;
}
export interface RoyaltiesInfoResponse {
  address: string;
  royalty_amount: Uint128;
}
export interface SubscriptionResponse {
  level: number;
  subscription?: Subscription | null;
}
export interface Subscription {
  expiration: Timestamp;
  level_expiration: Timestamp;
}