import { NetworkName } from "../NetworkName";
import { NetworkInfo } from "../types";
import { cosmosHubThetaCurrencies } from "./currencies";

export const cosmosThetaNetwork: NetworkInfo = {
  id: "cosmos-hub-theta",
  chainId: "theta-testnet-001",
  displayName: NetworkName.CosmosHubTheta,
  icon: "icons/networks/cosmos-hub.svg",
  iconCircle: "icons/networks/cosmos-hub-circle.svg",
  currencies: cosmosHubThetaCurrencies,
  addressPrefix: "cosmos",
  restEndpoint: "https://cosmos-testnet-rpc.allthatnode.com:1317",
  rpcEndpoint: "https://cosmos-testnet-rpc.allthatnode.com:26657",
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
  hidden: true,
};
