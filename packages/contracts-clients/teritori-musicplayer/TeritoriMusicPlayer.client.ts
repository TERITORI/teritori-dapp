/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.33.0.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { Coin, StdFee } from "@cosmjs/amino";
import { ConfigResponse, Addr, Config, ExecuteMsg, InstantiateMsg, MusicAlbumResponse, MusicAlbum, QueryMsg } from "./TeritoriMusicPlayer.types";
export interface TeritoriMusicPlayerReadOnlyInterface {
  contractAddress: string;
  config: () => Promise<ConfigResponse>;
  musicAlbum: ({
    identifier
  }: {
    identifier: string;
  }) => Promise<MusicAlbumResponse>;
}
export class TeritoriMusicPlayerQueryClient implements TeritoriMusicPlayerReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.config = this.config.bind(this);
    this.musicAlbum = this.musicAlbum.bind(this);
  }

  config = async (): Promise<ConfigResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      config: {}
    });
  };
  musicAlbum = async ({
    identifier
  }: {
    identifier: string;
  }): Promise<MusicAlbumResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      music_album: {
        identifier
      }
    });
  };
}
export interface TeritoriMusicPlayerInterface extends TeritoriMusicPlayerReadOnlyInterface {
  contractAddress: string;
  sender: string;
  updateConfig: ({
    owner
  }: {
    owner?: string;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  createMusicAlbum: ({
    identifier,
    metadata
  }: {
    identifier: string;
    metadata: string;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  deleteMusicAlbum: ({
    identifier
  }: {
    identifier: string;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  addToLibrary: ({
    identifier
  }: {
    identifier: string;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  removeFromLibrary: ({
    identifier
  }: {
    identifier: string;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
}
export class TeritoriMusicPlayerClient extends TeritoriMusicPlayerQueryClient implements TeritoriMusicPlayerInterface {
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.updateConfig = this.updateConfig.bind(this);
    this.createMusicAlbum = this.createMusicAlbum.bind(this);
    this.deleteMusicAlbum = this.deleteMusicAlbum.bind(this);
    this.addToLibrary = this.addToLibrary.bind(this);
    this.removeFromLibrary = this.removeFromLibrary.bind(this);
  }

  updateConfig = async ({
    owner
  }: {
    owner?: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      update_config: {
        owner
      }
    }, fee, memo, _funds);
  };
  createMusicAlbum = async ({
    identifier,
    metadata
  }: {
    identifier: string;
    metadata: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      create_music_album: {
        identifier,
        metadata
      }
    }, fee, memo, _funds);
  };
  deleteMusicAlbum = async ({
    identifier
  }: {
    identifier: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      delete_music_album: {
        identifier
      }
    }, fee, memo, _funds);
  };
  addToLibrary = async ({
    identifier
  }: {
    identifier: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      add_to_library: {
        identifier
      }
    }, fee, memo, _funds);
  };
  removeFromLibrary = async ({
    identifier
  }: {
    identifier: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      remove_from_library: {
        identifier
      }
    }, fee, memo, _funds);
  };
}
