import { NetworkInfo } from "../types";
import { cosmosHubCurrencies } from "./currencies";

export const cosmosThetaNetwork: NetworkInfo = {
  id: "cosmos-hub",
  chainId: "cosmoshub-4",
  displayName: "Cosmos Hub",
  icon: "icons/networks/cosmos-hub-circle.svg",
  currencies: cosmosHubCurrencies,
  addressPrefix: "cosmos",
  restEndpoint: "https://cosmos-mainnet-rpc.allthatnode.com:1317",
  rpcEndpoint: "https://cosmos-mainnet-rpc.allthatnode.com:26657",
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
