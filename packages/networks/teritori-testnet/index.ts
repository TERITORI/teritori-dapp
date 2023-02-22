import { Network } from "../../utils/network";
import { NetworkInfo } from "../types";
import { teritoriTestnetCurrencies } from "./currencies";

export const teritoriTestnetNetwork: NetworkInfo = {
  id: "teritori-testnet",
  network: Network.Teritori,
  chainId: "teritori-testnet-v3",
  displayName: "Teritori Testnet",
  icon: "icons/networks/teritori-circle.svg",
  currencies: teritoriTestnetCurrencies,
  addressPrefix: "tori",
  restEndpoint: "https://rest.testnet.teritori.com",
  rpcEndpoint: "https://rpc.testnet.teritori.com",
  stakeCurrency: "utori",
  gasPriceStep: {
    low: 0.0,
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
