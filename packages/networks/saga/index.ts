import { CosmosNetworkInfo, NetworkKind } from "../types";

export const sagaNetwork: CosmosNetworkInfo = {
  id: "saga",
  displayName: "Saga",
  chainId: "ssc-1",
  registryName: "saga",
  overrides: "cosmos-registry:saga",
  kind: NetworkKind.Cosmos,
  currencies: [
    {
      kind: "native",
      denom: "usaga",
      decimals: 6,
      displayName: "SAGA",
      coingeckoId: "saga-2",
      icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/saga/images/saga.svg",
      color: "TODO",
    },
  ],
  features: [],
  featureObjects: [],
  idPrefix: "saga",
  addressPrefix: "saga",
  txExplorer: "https://www.mintscan.io/saga/transactions/$hash",
  accountExplorer: "https://www.mintscan.io/saga/accounts/$address",
  contractExplorer: "https://www.mintscan.io/saga/accounts/$address",
  icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/saga/images/saga.svg",
  testnet: false,
  backendEndpoint: "",
  restEndpoint: "https://saga-mainnet-lcd.autostake.com:443",
  rpcEndpoint: "https://rpc-saga.keplr.app",
  stakeCurrency: "saga",
  gasPriceStep: {
    low: 0.01,
    average: 0.025,
    high: 0.04,
  },
  nameServiceDefaultImage:
    "https://raw.githubusercontent.com/cosmos/chain-registry/master/saga/images/saga.svg",
  cosmosFeatures: [],
};
