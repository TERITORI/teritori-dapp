/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.35.7.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

export type Uint128 = string;
export interface InstantiateMsg {
  fee_per10k: number;
  max_tickets: number;
  owner: string;
  ticket_price: Coin;
  [k: string]: unknown;
}
export interface Coin {
  amount: Uint128;
  denom: string;
  [k: string]: unknown;
}
export type ExecuteMsg = ExecMsg;
export type ExecMsg = {
  buy_ticket: {
    entropy: boolean;
    [k: string]: unknown;
  };
} | {
  withdraw_fees: {
    destination: string;
    [k: string]: unknown;
  };
} | {
  stop: {
    [k: string]: unknown;
  };
} | {
  change_owner: {
    new_owner: string;
    [k: string]: unknown;
  };
};
export type QueryMsg = QueryMsg1;
export type QueryMsg1 = {
  info: {
    [k: string]: unknown;
  };
} | {
  history: {
    cursor?: number | null;
    limit: number;
    [k: string]: unknown;
  };
};
export type Addr = string;
export type ArrayOfTupleOfUint64AndAddr = [number, Addr][];
export interface Info {
  config: Config;
  current_tickets_count: number;
}
export interface Config {
  fee_per10k: number;
  max_tickets: number;
  owner: Addr;
  stopped: boolean;
  ticket_price: Coin;
}