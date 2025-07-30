import { NetworkFeature, NetworkFeatureObject } from "./features";
import { IBCCurrencyInfo } from "./ibc";

export { NetworkFeature } from "./features";

export enum NetworkKind {
  Unknown = "Unknown",
  Ethereum = "Ethereum",
  Cosmos = "Cosmos",
  Solana = "Solana",
  Gno = "Gno",
  Starknet = "Starknet",
}

interface NetworkInfoBase {
  id: string;
  displayName: string;
  kind: NetworkKind;
  icon?: string;
  currencies: CurrencyInfo[];
  features: NetworkFeature[];
  featureObjects?: NetworkFeatureObject[];
  idPrefix: string;
  txExplorer: string;
  accountExplorer: string;
  contractExplorer: string;
  testnet: boolean;
  backendEndpoint: string;
  secondaryDuringMintList?: string[];
  excludeFromLaunchpadList?: string[];

  // p2e
  distributorContractAddress?: string;
  riotContractAddressGen0?: string;
  riotContractAddressGen1?: string;
  overrides?: string;
}

export type StarknetNetworkInfo = NetworkInfoBase & {
  kind: NetworkKind.Starknet;
  chainId: string;
  addressPrefix: string;
  restEndpoint: string;
  rpcEndpoint: string;

  vaultContractAddress?: string;
  todoListContractAddress?: `0x${string}`;
};

export type CosmosNetworkInfo = NetworkInfoBase & {
  kind: NetworkKind.Cosmos;
  chainId: string;
  addressPrefix: string;
  restEndpoint: string;
  rpcEndpoint: string;
  stakeCurrency: string;
  registryName: string;
  gasPriceStep: {
    low: number;
    average: number;
    high: number;
  };
  cosmosFeatures: string[];
  walletUrlForStaking?: string;
  nameServiceCodeId?: number;
  nameServiceContractAddress?: string;
  nameServiceDefaultImage?: string;
  nameServiceTLD?: string;
  marketplaceVaultCodeId?: number;
  vaultContractAddress?: string;
  riotSquadStakingContractAddressV1?: string;
  riotSquadStakingContractAddressV2?: string;
  socialFeedCodeId?: number;
  socialFeedContractAddress?: string;
  daoCw20CodeId?: number;
  cwAdminFactoryCodeId?: number;
  daoCoreCodeId?: number;
  daoPreProposeSingleCodeId?: number;
  daoProposalSingleCodeId?: number;
  daoVotingCw20StakedCodeId?: number;
  daoCw20StakeCodeId?: number;
  cw4GroupCodeId?: number;
  daoVotingCw4CodeId?: number;
  cwAdminFactoryContractAddress?: string;
  coreDAOAddress?: string;
  cwAddressListContractAddress?: string;
  cwAddressListCodeId?: number;
};

export type EthereumNetworkInfo = NetworkInfoBase & {
  kind: NetworkKind.Ethereum;
  endpoint: string;
  chainId: number;
  alchemyApiKey: string;
  vaultContractAddress: string;
  riotSquadStakingContractAddress: string;
  firehoseEndpoint?: string;
  indexStartBlock?: string;
  substreamsManifest?: string;
  toriBridgedTokenAddress?: string;

  riotContractAddressGen0: string;
  riotOriginalCollectionIdGen0?: string;
  riotBridgeAddressGen0?: string;
  riotNFTAddressGen0?: string;
  riotBridgedNFTAddressGen0?: string;

  riotContractAddressGen1?: string;
  riotOriginalCollectionIdGen1?: string;
  riotBridgeAddressGen1?: string;
  riotNFTAddressGen1?: string;
  riotBridgedNFTAddressGen1?: string;
};

export type GnoNetworkInfo = NetworkInfoBase & {
  kind: NetworkKind.Gno;
  chainId: string;
  endpoint: string;
  stakeCurrency: string;
  vaultContractAddress: string;
  nameServiceContractAddress: string;
  nameServiceDefaultImage: string;
  gnowebURL: string;
  daoRegistryPkgPath?: string;
  modboardsPkgPath?: string;
  globalFeedId?: string;
  socialFeedsPkgPath?: string;
  socialFeedsDAOPkgPath?: string;
  votingGroupPkgPath?: string;
  rolesVotingGroupPkgPath?: string;
  rolesGroupPkgPath?: string;
  daoProposalSinglePkgPath?: string;
  daoInterfacesPkgPath?: string;
  daoCorePkgPath?: string;
  groupsPkgPath?: string;
  daoUtilsPkgPath?: string;
  toriPkgPath?: string;
  profilePkgPath?: string;
  faucetURL?: string;
  txIndexerURL?: string;
  cockpitNamespace?: string;
};

export type NetworkInfo =
  | CosmosNetworkInfo
  | EthereumNetworkInfo
  | GnoNetworkInfo
  | StarknetNetworkInfo;

export type NativeCurrencyInfo = {
  kind: "native";
  variant: "cosmos" | "ethereum" | "gno" | "grc20";
  denom: string;
  displayName: string;
  decimals: number;
  coingeckoId: string;
  icon: string;
  color: string;
};

export type CurrencyInfo = NativeCurrencyInfo | IBCCurrencyInfo;

export enum UserKind {
  Single = "Single",
  Multisig = "Multisig",
  Organization = "Organization",
}
