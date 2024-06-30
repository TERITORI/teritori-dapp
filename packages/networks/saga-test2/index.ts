import { CosmosNetworkInfo, NetworkKind } from "../types";

export const sagaTest2: CosmosNetworkInfo = {
  id: "sagatestnet2",
  displayName: "Saga Testnet 2",
  chainId: "ssc-testnet-2",
  registryName: "sagatestnet2",
  kind: NetworkKind.Cosmos,
  currencies: [
    {
      kind: "native",
      denom: "utsaga",
      decimals: 6,
      displayName: "TSAGA",
      coingeckoId: "not-found",
      icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/saga/images/saga.svg",
      color: "TODO",
      variant: "cosmos",
    },
  ],
  features: [],
  featureObjects: [],
  idPrefix: "sagatestnet2",
  addressPrefix: "saga",
  txExplorer: "https://www.mintscan.io/saga-testnet/tx/$hash",
  accountExplorer: "https://mintscan.io/saga-testnet/address/$address",
  contractExplorer: "https://mintscan.io/saga-testnet/address/$address",
  icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/saga/images/saga.png",
  testnet: true,
  backendEndpoint: "",
  restEndpoint: "https://testnet2-keplr-lcd.sagarpc.io",
  rpcEndpoint: "https://testnet2-keplr.sagarpc.io",
  stakeCurrency: "utsaga",
  gasPriceStep: {
    low: 0.0025,
    average: 0.025,
    high: 0.04,
  },
  nameServiceDefaultImage:
    "https://raw.githubusercontent.com/cosmos/chain-registry/master/saga/images/saga.png",
  cosmosFeatures: [],
};
