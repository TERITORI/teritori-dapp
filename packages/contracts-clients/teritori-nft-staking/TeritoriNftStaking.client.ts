/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.16.3.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { Coin, StdFee } from "@cosmjs/amino";
import { ConfigResponse, Cw721HookMsg, ExecuteMsg, Binary, Cw721ReceiveMsg, InstantiateMsg, QueryMsg } from "./TeritoriNftStaking.types";
export interface TeritoriNftStakingReadOnlyInterface {
  contractAddress: string;
  config: () => Promise<ConfigResponse>;
  isCollectionWhitelisted: ({
    nftContractAddr
  }: {
    nftContractAddr: string;
  }) => Promise<IsCollectionWhitelistedResponse>;
  stakeInfo: ({
    nftContractAddr,
    nftTokenId
  }: {
    nftContractAddr: string;
    nftTokenId: string;
  }) => Promise<StakeInfoResponse>;
}
export class TeritoriNftStakingQueryClient implements TeritoriNftStakingReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.config = this.config.bind(this);
    this.isCollectionWhitelisted = this.isCollectionWhitelisted.bind(this);
    this.stakeInfo = this.stakeInfo.bind(this);
  }

  config = async (): Promise<ConfigResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      config: {}
    });
  };
  isCollectionWhitelisted = async ({
    nftContractAddr
  }: {
    nftContractAddr: string;
  }): Promise<IsCollectionWhitelistedResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      is_collection_whitelisted: {
        nft_contract_addr: nftContractAddr
      }
    });
  };
  stakeInfo = async ({
    nftContractAddr,
    nftTokenId
  }: {
    nftContractAddr: string;
    nftTokenId: string;
  }): Promise<StakeInfoResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      stake_info: {
        nft_contract_addr: nftContractAddr,
        nft_token_id: nftTokenId
      }
    });
  };
}
export interface TeritoriNftStakingInterface extends TeritoriNftStakingReadOnlyInterface {
  contractAddress: string;
  sender: string;
  updateConfig: ({
    cooldownDays,
    owner
  }: {
    cooldownDays: number;
    owner: string;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  addWhitelistCollection: ({
    nftContractAddr
  }: {
    nftContractAddr: string;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  removeWhitelistCollection: ({
    nftContractAddr
  }: {
    nftContractAddr: string;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  receiveNft: ({
    msg,
    sender,
    tokenId
  }: {
    msg: Binary;
    sender: string;
    tokenId: string;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  unstake: ({
    nftContractAddr,
    nftTokenId
  }: {
    nftContractAddr: string;
    nftTokenId: string;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
}
export class TeritoriNftStakingClient extends TeritoriNftStakingQueryClient implements TeritoriNftStakingInterface {
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.updateConfig = this.updateConfig.bind(this);
    this.addWhitelistCollection = this.addWhitelistCollection.bind(this);
    this.removeWhitelistCollection = this.removeWhitelistCollection.bind(this);
    this.receiveNft = this.receiveNft.bind(this);
    this.unstake = this.unstake.bind(this);
  }

  updateConfig = async ({
    cooldownDays,
    owner
  }: {
    cooldownDays: number;
    owner: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      update_config: {
        cooldown_days: cooldownDays,
        owner
      }
    }, fee, memo, funds);
  };
  addWhitelistCollection = async ({
    nftContractAddr
  }: {
    nftContractAddr: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      add_whitelist_collection: {
        nft_contract_addr: nftContractAddr
      }
    }, fee, memo, funds);
  };
  removeWhitelistCollection = async ({
    nftContractAddr
  }: {
    nftContractAddr: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      remove_whitelist_collection: {
        nft_contract_addr: nftContractAddr
      }
    }, fee, memo, funds);
  };
  receiveNft = async ({
    msg,
    sender,
    tokenId
  }: {
    msg: Binary;
    sender: string;
    tokenId: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      receive_nft: {
        msg,
        sender,
        token_id: tokenId
      }
    }, fee, memo, funds);
  };
  unstake = async ({
    nftContractAddr,
    nftTokenId
  }: {
    nftContractAddr: string;
    nftTokenId: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      unstake: {
        nft_contract_addr: nftContractAddr,
        nft_token_id: nftTokenId
      }
    }, fee, memo, funds);
  };
}