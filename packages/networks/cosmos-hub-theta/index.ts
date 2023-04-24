import { cosmosHubThetaCurrencies } from "./currencies";
import { NetworkInfo, NetworkKind } from "../types";

export const cosmosThetaNetwork: NetworkInfo = {
  id: "cosmos-hub-theta",
  kind: NetworkKind.Cosmos,
  chainId: "theta-testnet-001",
  displayName: "Cosmos Hub Theta",
  features: [],
  icon: "cosmos-hub.svg",
  currencies: cosmosHubThetaCurrencies,
  txExplorer: "https://explorer.theta-testnet.polypore.xyz/transactions/$hash",
  accountExplorer:
    "https://explorer.theta-testnet.polypore.xyz/accounts/$address",
  contractExplorer: "",
  idPrefix: "cosmtest",
  testnet: true,
  backendEndpoint: "https://dapp-backend.testnet.teritori.com",
  addressPrefix: "cosmos",
  restEndpoint: "https://cosmos-testnet-rpc.allthatnode.com:1317",
  rpcEndpoint: "https://cosmos-testnet-rpc.allthatnode.com:26657",
  stakeCurrency: "uatom",
  gasPriceStep: {
    low: 0.01,
    average: 0.025,
    high: 0.04,
  },
  cosmosFeatures: [
    "stargate",
    "ibc-transfer",
    "cosmwasm",
    "no-legacy-stdTx",
    "ibc-go",
  ],
};
