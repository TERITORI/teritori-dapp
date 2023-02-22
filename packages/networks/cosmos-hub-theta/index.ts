import { Network } from "../../utils/network";
import { NetworkInfo } from "../types";
import { cosmosHubThetaCurrencies } from "./currencies";

export const cosmosThetaNetwork: NetworkInfo = {
  id: "cosmos-hub-theta",
  network: Network.CosmosHub,
  chainId: "theta-testnet-001",
  displayName: "Cosmos Hub Theta",
  icon: "icons/networks/cosmos-hub-circle.svg",
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
};
