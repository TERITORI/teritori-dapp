import { cosmosHubCurrencies } from "./currencies";
import { NetworkKind, NetworkInfo } from "../types";

export const cosmosNetwork: NetworkInfo = {
  id: "cosmos-hub",
  kind: NetworkKind.Cosmos,
  chainId: "cosmoshub-4",
  displayName: "Cosmos Hub",
  icon: "cosmos-hub.svg",
  features: [],
  currencies: cosmosHubCurrencies,
  overrides: "cosmos-registry:cosmoshub",
  registryName: "cosmoshub",
  txExplorer: "https://www.mintscan.io/cosmos/txs/$hash",
  accountExplorer: "https://www.mintscan.io/cosmos/account/$address",
  contractExplorer: "https://www.mintscan.io/cosmos/account/$address",
  idPrefix: "cosm",
  testnet: false,
  backendEndpoint: "https://dapp-backend.mainnet.teritori.com",
  addressPrefix: "cosmos",
  restEndpoint: "https://rest-cosmoshub.ecostake.com",
  rpcEndpoint: "https://rpc-cosmoshub.ecostake.com",
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
