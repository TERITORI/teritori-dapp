import { NetworkInfo } from "../types";
import { cosmosHubCurrencies } from "./currencies";

export const cosmosNetwork: NetworkInfo = {
  id: "cosmos-hub",
  chainId: "cosmoshub-4",
  displayName: "Cosmos Hub",
  icon: "icons/networks/cosmos-hub-circle.svg",
  currencies: cosmosHubCurrencies,
  addressPrefix: "cosmos",
  restEndpoint: "https://api-cosmoshub-ia.cosmosia.notional.ventures",
  rpcEndpoint: "https://rpc-cosmoshub-ia.cosmosia.notional.ventures",
  stakeCurrency: "uatom",
  gasPriceStep: {
    low: 0.01,
    average: 0.025,
    high: 0.04,
  },
  features: [
    "stargate",
    "ibc-transfer",
    "cosmwasm",
    "no-legacy-stdTx",
    "ibc-go",
  ],
};
