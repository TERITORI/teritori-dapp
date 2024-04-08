/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.35.7.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { Coin, StdFee } from "@cosmjs/amino";
import { InstantiateMsg, Config, ExecuteMsg, Uint128, Addr, Collection, MintPeriod, WhitelistInfo, QueryMsg } from "./NftLaunchpad.types";
export interface NftLaunchpadReadOnlyInterface {
  contractAddress: string;
  getCollectionById: ({
    collectionId
  }: {
    collectionId: number;
  }) => Promise<Collection>;
  getCollectionByAddr: ({
    collectionAddr
  }: {
    collectionAddr: string;
  }) => Promise<Collection>;
  getConfig: () => Promise<Config>;
}
export class NftLaunchpadQueryClient implements NftLaunchpadReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.getCollectionById = this.getCollectionById.bind(this);
    this.getCollectionByAddr = this.getCollectionByAddr.bind(this);
    this.getConfig = this.getConfig.bind(this);
  }

  getCollectionById = async ({
    collectionId
  }: {
    collectionId: number;
  }): Promise<Collection> => {
    return this.client.queryContractSmart(this.contractAddress, {
      get_collection_by_id: {
        collection_id: collectionId
      }
    });
  };
  getCollectionByAddr = async ({
    collectionAddr
  }: {
    collectionAddr: string;
  }): Promise<Collection> => {
    return this.client.queryContractSmart(this.contractAddress, {
      get_collection_by_addr: {
        collection_addr: collectionAddr
      }
    });
  };
  getConfig = async (): Promise<Config> => {
    return this.client.queryContractSmart(this.contractAddress, {
      get_config: {}
    });
  };
}
export interface NftLaunchpadInterface extends NftLaunchpadReadOnlyInterface {
  contractAddress: string;
  sender: string;
  updateConfig: ({
    changes
  }: {
    changes: Config;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  submitCollection: ({
    collection
  }: {
    collection: Collection;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  updateMerkleRoot: ({
    collectionId,
    merkleRoot
  }: {
    collectionId: number;
    merkleRoot: string;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  deployCollection: ({
    collectionId
  }: {
    collectionId: number;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
}
export class NftLaunchpadClient extends NftLaunchpadQueryClient implements NftLaunchpadInterface {
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.updateConfig = this.updateConfig.bind(this);
    this.submitCollection = this.submitCollection.bind(this);
    this.updateMerkleRoot = this.updateMerkleRoot.bind(this);
    this.deployCollection = this.deployCollection.bind(this);
  }

  updateConfig = async ({
    changes
  }: {
    changes: Config;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      update_config: {
        changes
      }
    }, fee, memo, _funds);
  };
  submitCollection = async ({
    collection
  }: {
    collection: Collection;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      submit_collection: {
        collection
      }
    }, fee, memo, _funds);
  };
  updateMerkleRoot = async ({
    collectionId,
    merkleRoot
  }: {
    collectionId: number;
    merkleRoot: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      update_merkle_root: {
        collection_id: collectionId,
        merkle_root: merkleRoot
      }
    }, fee, memo, _funds);
  };
  deployCollection = async ({
    collectionId
  }: {
    collectionId: number;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      deploy_collection: {
        collection_id: collectionId
      }
    }, fee, memo, _funds);
  };
}