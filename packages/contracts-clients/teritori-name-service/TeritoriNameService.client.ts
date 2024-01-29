/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.35.7.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { Coin, StdFee } from "@cosmjs/amino";
import { AddressOfResponse, AdminAddressResponse, Expiration, Timestamp, Uint64, Logo, EmbeddedLogo, Binary, AllNftInfoResponse, OwnerOfResponse, Approval, NftInfoResponseForMetadata, Metadata, AllOperatorsResponse, AllTokensResponse, AuthorizedCharactersResponse, BaseTokensResponse, Uint128, ContractInfoResponse, ExecuteMsg, SetAuthorizedCharactersMsg, UpdateSupportedDomainMsg, UpdateMintingFeesMsg, UpdateMetadataMsg, MintMsgForMetadata, GetFullPathResponse, GetParentIdResponse, GetParentInfoResponse, GetPathResponse, InstantiateMsg, IsContractResponse, IsSupportedDomainResponse, ListInfoByAliasResponse, UserInfo, ListUserInfoResponse, MigrateMsg, MintPriceResponse, MinterResponse, MintingFeesResponse, NftInfoResponse, NumTokensResponse, OperatorsResponse, PathsForTokenResponse, PathsResponse, PrimaryAliasResponse, QueryMsg, TokensResponse } from "./TeritoriNameService.types";
export interface TeritoriNameServiceReadOnlyInterface {
  contractAddress: string;
  isSupportedDomain: ({
    domain
  }: {
    domain: string;
  }) => Promise<IsSupportedDomainResponse>;
  primaryAlias: ({
    address
  }: {
    address: string;
  }) => Promise<PrimaryAliasResponse>;
  ownerOf: ({
    includeExpired,
    tokenId
  }: {
    includeExpired?: boolean;
    tokenId: string;
  }) => Promise<OwnerOfResponse>;
  addressOf: ({
    tokenId
  }: {
    tokenId: string;
  }) => Promise<AddressOfResponse>;
  allOperators: ({
    includeExpired,
    limit,
    owner,
    startAfter
  }: {
    includeExpired?: boolean;
    limit?: number;
    owner: string;
    startAfter?: string;
  }) => Promise<AllOperatorsResponse>;
  numTokens: () => Promise<NumTokensResponse>;
  contractInfo: () => Promise<ContractInfoResponse>;
  nftInfo: ({
    tokenId
  }: {
    tokenId: string;
  }) => Promise<NftInfoResponse>;
  allNftInfo: ({
    includeExpired,
    tokenId
  }: {
    includeExpired?: boolean;
    tokenId: string;
  }) => Promise<AllNftInfoResponse>;
  tokens: ({
    limit,
    owner,
    startAfter
  }: {
    limit?: number;
    owner: string;
    startAfter?: string;
  }) => Promise<TokensResponse>;
  baseTokens: ({
    limit,
    owner,
    startAfter
  }: {
    limit?: number;
    owner: string;
    startAfter?: string;
  }) => Promise<BaseTokensResponse>;
  allTokens: ({
    limit,
    startAfter
  }: {
    limit?: number;
    startAfter?: string;
  }) => Promise<AllTokensResponse>;
  adminAddress: () => Promise<AdminAddressResponse>;
  isContract: ({
    tokenId
  }: {
    tokenId: string;
  }) => Promise<IsContractResponse>;
  getParentId: ({
    tokenId
  }: {
    tokenId: string;
  }) => Promise<GetParentIdResponse>;
  getParentInfo: ({
    tokenId
  }: {
    tokenId: string;
  }) => Promise<GetParentInfoResponse>;
  getFullPath: ({
    tokenId
  }: {
    tokenId: string;
  }) => Promise<GetFullPathResponse>;
  paths: ({
    limit,
    owner,
    startAfter
  }: {
    limit?: number;
    owner: string;
    startAfter?: string;
  }) => Promise<PathsResponse>;
  pathsForToken: ({
    limit,
    owner,
    startAfter,
    tokenId
  }: {
    limit?: number;
    owner: string;
    startAfter?: string;
    tokenId: string;
  }) => Promise<PathsForTokenResponse>;
  listInfoByAlias: ({
    aliases
  }: {
    aliases: string[];
  }) => Promise<ListInfoByAliasResponse>;
  mintPrice: ({
    tokenId
  }: {
    tokenId: string;
  }) => Promise<MintPriceResponse>;
  authorizedCharacters: ({
    charType
  }: {
    charType: string;
  }) => Promise<AuthorizedCharactersResponse>;
}
export class TeritoriNameServiceQueryClient implements TeritoriNameServiceReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.isSupportedDomain = this.isSupportedDomain.bind(this);
    this.primaryAlias = this.primaryAlias.bind(this);
    this.ownerOf = this.ownerOf.bind(this);
    this.addressOf = this.addressOf.bind(this);
    this.allOperators = this.allOperators.bind(this);
    this.numTokens = this.numTokens.bind(this);
    this.contractInfo = this.contractInfo.bind(this);
    this.nftInfo = this.nftInfo.bind(this);
    this.allNftInfo = this.allNftInfo.bind(this);
    this.tokens = this.tokens.bind(this);
    this.baseTokens = this.baseTokens.bind(this);
    this.allTokens = this.allTokens.bind(this);
    this.adminAddress = this.adminAddress.bind(this);
    this.isContract = this.isContract.bind(this);
    this.getParentId = this.getParentId.bind(this);
    this.getParentInfo = this.getParentInfo.bind(this);
    this.getFullPath = this.getFullPath.bind(this);
    this.paths = this.paths.bind(this);
    this.pathsForToken = this.pathsForToken.bind(this);
    this.listInfoByAlias = this.listInfoByAlias.bind(this);
    this.mintPrice = this.mintPrice.bind(this);
    this.authorizedCharacters = this.authorizedCharacters.bind(this);
  }

  isSupportedDomain = async ({
    domain
  }: {
    domain: string;
  }): Promise<IsSupportedDomainResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      is_supported_domain: {
        domain
      }
    });
  };
  primaryAlias = async ({
    address
  }: {
    address: string;
  }): Promise<PrimaryAliasResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      primary_alias: {
        address
      }
    });
  };
  ownerOf = async ({
    includeExpired,
    tokenId
  }: {
    includeExpired?: boolean;
    tokenId: string;
  }): Promise<OwnerOfResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      owner_of: {
        include_expired: includeExpired,
        token_id: tokenId
      }
    });
  };
  addressOf = async ({
    tokenId
  }: {
    tokenId: string;
  }): Promise<AddressOfResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      address_of: {
        token_id: tokenId
      }
    });
  };
  allOperators = async ({
    includeExpired,
    limit,
    owner,
    startAfter
  }: {
    includeExpired?: boolean;
    limit?: number;
    owner: string;
    startAfter?: string;
  }): Promise<AllOperatorsResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      all_operators: {
        include_expired: includeExpired,
        limit,
        owner,
        start_after: startAfter
      }
    });
  };
  numTokens = async (): Promise<NumTokensResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      num_tokens: {}
    });
  };
  contractInfo = async (): Promise<ContractInfoResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      contract_info: {}
    });
  };
  nftInfo = async ({
    tokenId
  }: {
    tokenId: string;
  }): Promise<NftInfoResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      nft_info: {
        token_id: tokenId
      }
    });
  };
  allNftInfo = async ({
    includeExpired,
    tokenId
  }: {
    includeExpired?: boolean;
    tokenId: string;
  }): Promise<AllNftInfoResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      all_nft_info: {
        include_expired: includeExpired,
        token_id: tokenId
      }
    });
  };
  tokens = async ({
    limit,
    owner,
    startAfter
  }: {
    limit?: number;
    owner: string;
    startAfter?: string;
  }): Promise<TokensResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      tokens: {
        limit,
        owner,
        start_after: startAfter
      }
    });
  };
  baseTokens = async ({
    limit,
    owner,
    startAfter
  }: {
    limit?: number;
    owner: string;
    startAfter?: string;
  }): Promise<BaseTokensResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      base_tokens: {
        limit,
        owner,
        start_after: startAfter
      }
    });
  };
  allTokens = async ({
    limit,
    startAfter
  }: {
    limit?: number;
    startAfter?: string;
  }): Promise<AllTokensResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      all_tokens: {
        limit,
        start_after: startAfter
      }
    });
  };
  adminAddress = async (): Promise<AdminAddressResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      admin_address: {}
    });
  };
  isContract = async ({
    tokenId
  }: {
    tokenId: string;
  }): Promise<IsContractResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      is_contract: {
        token_id: tokenId
      }
    });
  };
  getParentId = async ({
    tokenId
  }: {
    tokenId: string;
  }): Promise<GetParentIdResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      get_parent_id: {
        token_id: tokenId
      }
    });
  };
  getParentInfo = async ({
    tokenId
  }: {
    tokenId: string;
  }): Promise<GetParentInfoResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      get_parent_info: {
        token_id: tokenId
      }
    });
  };
  getFullPath = async ({
    tokenId
  }: {
    tokenId: string;
  }): Promise<GetFullPathResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      get_full_path: {
        token_id: tokenId
      }
    });
  };
  paths = async ({
    limit,
    owner,
    startAfter
  }: {
    limit?: number;
    owner: string;
    startAfter?: string;
  }): Promise<PathsResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      paths: {
        limit,
        owner,
        start_after: startAfter
      }
    });
  };
  pathsForToken = async ({
    limit,
    owner,
    startAfter,
    tokenId
  }: {
    limit?: number;
    owner: string;
    startAfter?: string;
    tokenId: string;
  }): Promise<PathsForTokenResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      paths_for_token: {
        limit,
        owner,
        start_after: startAfter,
        token_id: tokenId
      }
    });
  };
  listInfoByAlias = async ({
    aliases
  }: {
    aliases: string[];
  }): Promise<ListInfoByAliasResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      list_info_by_alias: {
        aliases
      }
    });
  };
  mintPrice = async ({
    tokenId
  }: {
    tokenId: string;
  }): Promise<MintPriceResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      mint_price: {
        token_id: tokenId
      }
    });
  };
  authorizedCharacters = async ({
    charType
  }: {
    charType: string;
  }): Promise<AuthorizedCharactersResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      authorized_characters: {
        char_type: charType
      }
    });
  };
}
export interface TeritoriNameServiceInterface extends TeritoriNameServiceReadOnlyInterface {
  contractAddress: string;
  sender: string;
  setAuthorizedCharacters: ({
    charType,
    chars,
    isAuthorized
  }: {
    charType: string;
    chars: string;
    isAuthorized: boolean;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  updateSupportedDomain: ({
    domain,
    isSupported
  }: {
    domain: string;
    isSupported: boolean;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  updateMintingFees: ({
    baseMintFee,
    burnPercentage,
    tokenCap
  }: {
    baseMintFee?: Uint128;
    burnPercentage?: number;
    tokenCap?: number;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  updateUsernameLengthCap: ({
    newLength
  }: {
    newLength: number;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  updatePrimaryAlias: ({
    tokenId
  }: {
    tokenId: string;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  updateMetadata: ({
    metadata,
    tokenId
  }: {
    metadata: Metadata;
    tokenId: string;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  burn: ({
    tokenId
  }: {
    tokenId: string;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  setAdminAddress: ({
    adminAddress
  }: {
    adminAddress: string;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  mint: ({
    extension,
    owner,
    tokenId,
    tokenUri
  }: {
    extension: Metadata;
    owner: string;
    tokenId: string;
    tokenUri?: string;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  mintPath: ({
    extension,
    owner,
    tokenId,
    tokenUri
  }: {
    extension: Metadata;
    owner: string;
    tokenId: string;
    tokenUri?: string;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  transferNft: ({
    recipient,
    tokenId
  }: {
    recipient: string;
    tokenId: string;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  sendNft: ({
    contract,
    msg,
    tokenId
  }: {
    contract: string;
    msg: Binary;
    tokenId: string;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  approve: ({
    expires,
    spender,
    tokenId
  }: {
    expires?: Expiration;
    spender: string;
    tokenId: string;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  revoke: ({
    spender,
    tokenId
  }: {
    spender: string;
    tokenId: string;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  approveAll: ({
    expires,
    operator
  }: {
    expires?: Expiration;
    operator: string;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  revokeAll: ({
    operator
  }: {
    operator: string;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
}
export class TeritoriNameServiceClient extends TeritoriNameServiceQueryClient implements TeritoriNameServiceInterface {
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.setAuthorizedCharacters = this.setAuthorizedCharacters.bind(this);
    this.updateSupportedDomain = this.updateSupportedDomain.bind(this);
    this.updateMintingFees = this.updateMintingFees.bind(this);
    this.updateUsernameLengthCap = this.updateUsernameLengthCap.bind(this);
    this.updatePrimaryAlias = this.updatePrimaryAlias.bind(this);
    this.updateMetadata = this.updateMetadata.bind(this);
    this.burn = this.burn.bind(this);
    this.setAdminAddress = this.setAdminAddress.bind(this);
    this.mint = this.mint.bind(this);
    this.mintPath = this.mintPath.bind(this);
    this.transferNft = this.transferNft.bind(this);
    this.sendNft = this.sendNft.bind(this);
    this.approve = this.approve.bind(this);
    this.revoke = this.revoke.bind(this);
    this.approveAll = this.approveAll.bind(this);
    this.revokeAll = this.revokeAll.bind(this);
  }

  setAuthorizedCharacters = async ({
    charType,
    chars,
    isAuthorized
  }: {
    charType: string;
    chars: string;
    isAuthorized: boolean;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      set_authorized_characters: {
        char_type: charType,
        chars,
        is_authorized: isAuthorized
      }
    }, fee, memo, _funds);
  };
  updateSupportedDomain = async ({
    domain,
    isSupported
  }: {
    domain: string;
    isSupported: boolean;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      update_supported_domain: {
        domain,
        is_supported: isSupported
      }
    }, fee, memo, _funds);
  };
  updateMintingFees = async ({
    baseMintFee,
    burnPercentage,
    tokenCap
  }: {
    baseMintFee?: Uint128;
    burnPercentage?: number;
    tokenCap?: number;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      update_minting_fees: {
        base_mint_fee: baseMintFee,
        burn_percentage: burnPercentage,
        token_cap: tokenCap
      }
    }, fee, memo, _funds);
  };
  updateUsernameLengthCap = async ({
    newLength
  }: {
    newLength: number;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      update_username_length_cap: {
        new_length: newLength
      }
    }, fee, memo, _funds);
  };
  updatePrimaryAlias = async ({
    tokenId
  }: {
    tokenId: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      update_primary_alias: {
        token_id: tokenId
      }
    }, fee, memo, _funds);
  };
  updateMetadata = async ({
    metadata,
    tokenId
  }: {
    metadata: Metadata;
    tokenId: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      update_metadata: {
        metadata,
        token_id: tokenId
      }
    }, fee, memo, _funds);
  };
  burn = async ({
    tokenId
  }: {
    tokenId: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      burn: {
        token_id: tokenId
      }
    }, fee, memo, _funds);
  };
  setAdminAddress = async ({
    adminAddress
  }: {
    adminAddress: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      set_admin_address: {
        admin_address: adminAddress
      }
    }, fee, memo, _funds);
  };
  mint = async ({
    extension,
    owner,
    tokenId,
    tokenUri
  }: {
    extension: Metadata;
    owner: string;
    tokenId: string;
    tokenUri?: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      mint: {
        extension,
        owner,
        token_id: tokenId,
        token_uri: tokenUri
      }
    }, fee, memo, _funds);
  };
  mintPath = async ({
    extension,
    owner,
    tokenId,
    tokenUri
  }: {
    extension: Metadata;
    owner: string;
    tokenId: string;
    tokenUri?: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      mint_path: {
        extension,
        owner,
        token_id: tokenId,
        token_uri: tokenUri
      }
    }, fee, memo, _funds);
  };
  transferNft = async ({
    recipient,
    tokenId
  }: {
    recipient: string;
    tokenId: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      transfer_nft: {
        recipient,
        token_id: tokenId
      }
    }, fee, memo, _funds);
  };
  sendNft = async ({
    contract,
    msg,
    tokenId
  }: {
    contract: string;
    msg: Binary;
    tokenId: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      send_nft: {
        contract,
        msg,
        token_id: tokenId
      }
    }, fee, memo, _funds);
  };
  approve = async ({
    expires,
    spender,
    tokenId
  }: {
    expires?: Expiration;
    spender: string;
    tokenId: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      approve: {
        expires,
        spender,
        token_id: tokenId
      }
    }, fee, memo, _funds);
  };
  revoke = async ({
    spender,
    tokenId
  }: {
    spender: string;
    tokenId: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      revoke: {
        spender,
        token_id: tokenId
      }
    }, fee, memo, _funds);
  };
  approveAll = async ({
    expires,
    operator
  }: {
    expires?: Expiration;
    operator: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      approve_all: {
        expires,
        operator
      }
    }, fee, memo, _funds);
  };
  revokeAll = async ({
    operator
  }: {
    operator: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      revoke_all: {
        operator
      }
    }, fee, memo, _funds);
  };
}