import { cosmosHubCurrencies } from "./currencies";
import { NetworkKind, CosmosNetworkInfo } from "../types";

export const cosmosNetwork: CosmosNetworkInfo = {
  id: "cosmos-hub",
  kind: NetworkKind.Cosmos,
  chainId: "cosmoshub-4",
  displayName: "Cosmos Hub",
  icon: "icons/networks/cosmos-hub.svg",
  currencies: cosmosHubCurrencies,
  txExplorer: "https://www.mintscan.io/cosmos/txs/$hash",
  accountExplorer: "https://www.mintscan.io/cosmos/account/$address",
  contractExplorer: "https://www.mintscan.io/cosmos/account/$address",
  idPrefix: "cosm",
  testnet: false,
  backendEndpoint: "https://dapp-backend.mainnet.teritori.com",
  addressPrefix: "cosmos",
  restEndpoint: "https://api-cosmoshub-ia.cosmosia.notional.ventures",
  rpcEndpoint: "https://rpc-cosmoshub-ia.cosmosia.notional.ventures",
  stakeCurrency: "uatom",
  gasPriceStep: {
    low: 0.01,
    average: 0.025,
    high: 0.04,
  },
  features: ["ibc-transfer", "ibc-go"],
};
