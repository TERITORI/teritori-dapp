import { NetworkName } from "../NetworkName";
import { NetworkInfo } from "../types";
import { cosmosHubCurrencies } from "./currencies";

export const cosmosNetwork: NetworkInfo = {
  id: "cosmoshub",
  chainId: "cosmoshub-4",
  displayName: NetworkName.CosmosHub,
  icon: "icons/networks/cosmos-hub.svg",
  iconCircle: "icons/networks/cosmos-hub-circle.svg",
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
