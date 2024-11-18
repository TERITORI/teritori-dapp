import { NetworkKind, NetworkInfo } from "../types";

export const irisNetwork: NetworkInfo = {
  id: "cosmos-registry:irisnet",
  kind: NetworkKind.Cosmos,
  chainId: "irishub-1",
  displayName: "IRISnet",
  icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/irisnet/images/iris.svg",
  currencies: [
    {
      kind: "native",
      denom: "uiris",
      decimals: 6,
      variant: "cosmos",
      displayName: "IRIS",
      coingeckoId: "iris-network",
      icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/irisnet/images/iris.svg",
      color: "TODO",
    },
  ],
  features: [],
  featureObjects: [],
  overrides: "cosmos-registry:irisnet",
  registryName: "irisnet",
  txExplorer: "https://www.mintscan.io/iris/txs/$hash",
  accountExplorer: "https://www.mintscan.io/iris/account/$address",
  contractExplorer: "https://www.mintscan.io/iris/account/$address",
  idPrefix: "irisnet",
  testnet: false,
  backendEndpoint: "",
  addressPrefix: "iaa",
  restEndpoint: "https://iris-rest.publicnode.com/",
  rpcEndpoint: "https://rpc-irisnet-01.stakeflow.io/",
  stakeCurrency: "uiris",
  gasPriceStep: {
    low: 0.2,
    average: 0.3,
    high: 0.4,
  },
  nameServiceDefaultImage:
    "https://raw.githubusercontent.com/cosmos/chain-registry/master/irisnet/images/iris.svg",
  cosmosFeatures: [],
};
