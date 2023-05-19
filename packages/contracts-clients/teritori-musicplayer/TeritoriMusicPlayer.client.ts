//@ts-nocheck

/**
 * This file was automatically generated by @cosmwasm/ts-codegen@0.25.0.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the @cosmwasm/ts-codegen generate command to regenerate this file.
 */

import {
  CosmWasmClient,
  SigningCosmWasmClient,
  ExecuteResult,
} from "@cosmjs/cosmwasm-stargate";
import { Coin, StdFee } from "@cosmjs/amino";
import {
  Addr,
  Config,
  ExecuteMsg,
  Uint128,
  InstantiateMsg,
  MusicAlbumCategory,
  MusicAlbumResult,
  MusicAlbum,
  QueryMsg,
} from "./TeritoriMusicPlayer.types";
export interface TeritoriMusicPlayerReadOnlyInterface {
  contractAddress: string;
  config: () => Promise<ConfigResponse>;
  queryFeeByCategory: ({
    category,
  }: {
    category: number;
  }) => Promise<QueryFeeByCategoryResponse>;
  queryLockedTokens: ({
    wallet,
  }: {
    wallet: string;
  }) => Promise<QueryLockedTokensResponse>;
  queryAvailableFreePosts: ({
    wallet,
  }: {
    wallet: string;
  }) => Promise<QueryAvailableFreePostsResponse>;
  queryMusicAlbum: ({
    identifier,
  }: {
    identifier: string;
  }) => Promise<QueryMusicAlbumResponse>;
}
export class TeritoriMusicPlayerQueryClient
  implements TeritoriMusicPlayerReadOnlyInterface
{
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.config = this.config.bind(this);
    this.queryFeeByCategory = this.queryFeeByCategory.bind(this);
    this.queryLockedTokens = this.queryLockedTokens.bind(this);
    this.queryAvailableFreePosts = this.queryAvailableFreePosts.bind(this);
    this.queryMusicAlbum = this.queryMusicAlbum.bind(this);
  }

  config = async (): Promise<ConfigResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      config: {},
    });
  };
  queryFeeByCategory = async ({
    category,
  }: {
    category: number;
  }): Promise<QueryFeeByCategoryResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      query_fee_by_category: {
        category,
      },
    });
  };
  queryLockedTokens = async ({
    wallet,
  }: {
    wallet: string;
  }): Promise<QueryLockedTokensResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      query_locked_tokens: {
        wallet,
      },
    });
  };
  queryAvailableFreePosts = async ({
    wallet,
  }: {
    wallet: string;
  }): Promise<QueryAvailableFreePostsResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      query_available_free_posts: {
        wallet,
      },
    });
  };
  queryMusicAlbum = async ({
    identifier,
  }: {
    identifier: string;
  }): Promise<QueryMusicAlbumResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      query_music_album: {
        identifier,
      },
    });
  };
}
export interface TeritoriMusicPlayerInterface
  extends TeritoriMusicPlayerReadOnlyInterface {
  contractAddress: string;
  sender: string;
  updateConfig: (
    {
      owner,
    }: {
      owner?: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[]
  ) => Promise<ExecuteResult>;
  updateFeeByCategory: (
    {
      category,
      fee,
    }: {
      category: number;
      fee: Uint128;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[]
  ) => Promise<ExecuteResult>;
  addFreePosts: (
    {
      freeCount,
      wallets,
    }: {
      freeCount: Uint128;
      wallets: string[];
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[]
  ) => Promise<ExecuteResult>;
  createMusicAlbum: (
    {
      category,
      identifier,
      metadata,
    }: {
      category: number;
      identifier: string;
      metadata: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[]
  ) => Promise<ExecuteResult>;
  lockTokens: (
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[]
  ) => Promise<ExecuteResult>;
  unlockTokens: (
    {
      amount,
    }: {
      amount: Uint128;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[]
  ) => Promise<ExecuteResult>;
  withdrawFund: (
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[]
  ) => Promise<ExecuteResult>;
}
export class TeritoriMusicPlayerClient
  extends TeritoriMusicPlayerQueryClient
  implements TeritoriMusicPlayerInterface
{
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(
    client: SigningCosmWasmClient,
    sender: string,
    contractAddress: string
  ) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.updateConfig = this.updateConfig.bind(this);
    this.updateFeeByCategory = this.updateFeeByCategory.bind(this);
    this.addFreePosts = this.addFreePosts.bind(this);
    this.createMusicAlbum = this.createMusicAlbum.bind(this);
    this.lockTokens = this.lockTokens.bind(this);
    this.unlockTokens = this.unlockTokens.bind(this);
    this.withdrawFund = this.withdrawFund.bind(this);
  }

  updateConfig = async (
    {
      owner,
    }: {
      owner?: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[]
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        update_config: {
          owner,
        },
      },
      fee,
      memo,
      funds
    );
  };
  updateFeeByCategory = async (
    {
      category,
      fee,
    }: {
      category: number;
      fee: Uint128;
    },
    _fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[]
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        update_fee_by_category: {
          category,
          fee,
        },
      },
      _fee,
      memo,
      funds
    );
  };
  addFreePosts = async (
    {
      freeCount,
      wallets,
    }: {
      freeCount: Uint128;
      wallets: string[];
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[]
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        add_free_posts: {
          free_count: freeCount,
          wallets,
        },
      },
      fee,
      memo,
      funds
    );
  };
  createMusicAlbum = async (
    {
      category,
      identifier,
      metadata,
    }: {
      category: number;
      identifier: string;
      metadata: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[]
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        create_music_album: {
          category,
          identifier,
          metadata,
        },
      },
      fee,
      memo,
      funds
    );
  };
  lockTokens = async (
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[]
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        lock_tokens: {},
      },
      fee,
      memo,
      funds
    );
  };
  unlockTokens = async (
    {
      amount,
    }: {
      amount: Uint128;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[]
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        unlock_tokens: {
          amount,
        },
      },
      fee,
      memo,
      funds
    );
  };
  withdrawFund = async (
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[]
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        withdraw_fund: {},
      },
      fee,
      memo,
      funds
    );
  };
}
