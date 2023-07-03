export enum NetworkKind {
  Unknown = "Unknown",
  Ethereum = "Ethereum",
  Cosmos = "Cosmos",
  Solana = "Solana",
  Gno = "Gno",
}

export interface NetworkInfoBase {
  id: string;
  displayName: string;
  kind: NetworkKind;
  icon?: string;
  currencies: CurrencyInfo[];
  features: NetworkFeature[];
  idPrefix: string;
  txExplorer: string;
  accountExplorer: string;
  contractExplorer: string;
  testnet: boolean;
  backendEndpoint: string;
  secondaryDuringMintList?: string[];
  excludeFromLaunchpadList?: string[];
}

export type CosmosNetworkInfo = NetworkInfoBase & {
  kind: NetworkKind.Cosmos;
  chainId: string;
  addressPrefix: string;
  restEndpoint: string;
  rpcEndpoint: string;
  stakeCurrency: string;
  gasPriceStep: {
    low: number;
    average: number;
    high: number;
  };
  cosmosFeatures: string[];
  walletUrlForStaking?: string;
  nameServiceContractAddress?: string;
  nameServiceDefaultImage?: string;
  nameServiceTLD?: string;
  vaultContractAddress?: string;
  distributorContractAddress?: string;
  riotContractAddressGen0?: string;
  riotContractAddressGen1?: string;
  riotSquadStakingContractAddressV1?: string;
  riotSquadStakingContractAddressV2?: string;
  riotersFooterContractAddress?: string;
  socialFeedContractAddress?: string;
  daoCw20CodeId?: number;
  daoFactoryCodeId?: number;
  daoCoreCodeId?: number;
  daoPreProposeSingleCodeId?: number;
  daoProposalSingleCodeId?: number;
  daoVotingCw20StakedCodeId?: number;
  daoCw20StakeCodeId?: number;
  daoCw4GroupCodeId?: number;
  daoVotingCw4CodeId?: number;
  daoFactoryContractAddress?: string;
  coreDAOAddress?: string;
};

export type EthereumNetworkInfo = NetworkInfoBase & {
  kind: NetworkKind.Ethereum;
  endpoint: string;
  chainId: number;
  alchemyApiKey: string;
  theGraphEndpoint: string;
  vaultContractAddress: string;
  riotContractAddress: string;
};

export type SolanaNetworkInfo = NetworkInfoBase & {
  kind: NetworkKind.Solana;
  holaplexGraphqlEndpoint: string;
  vaultContractAddress: string;
};
export type GnoNetworkInfo = NetworkInfoBase & {
  kind: NetworkKind.Gno;
  chainId: string;
  endpoint: string;
  stakeCurrency: string;
  vaultContractAddress: string;
};

export type NetworkInfo =
  | CosmosNetworkInfo
  | EthereumNetworkInfo
  | GnoNetworkInfo;

export type CurrencyKind = "native" | "ibc";

export type NativeCurrencyInfo = {
  kind: "native";
  denom: string;
  displayName: string;
  decimals: number;
  coingeckoId: string;
  icon: string;
  color: string;
};

export type IBCCurrencyInfo = {
  kind: "ibc";
  denom: string;
  sourceNetwork: string;
  sourceDenom: string;
  sourceChannelPort: string;
  sourceChannelId: string;
  destinationChannelPort: string;
  destinationChannelId: string;
  deprecated?: boolean;
};

export type CurrencyInfo = NativeCurrencyInfo | IBCCurrencyInfo;

export enum NetworkFeature {
  NFTMarketplace = "NFTMarketplace",
  NFTLaunchpad = "NFTLaunchpad",
  NameService = "NameService",
  Swap = "Swap",
}
