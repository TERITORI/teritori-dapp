import { NetworkInfo } from "../types";
import { teritoriCurrencies } from "./currencies";

export const teritoriNetwork: NetworkInfo = {
  id: "teritori",
  chainId: "teritori-1",
  displayName: "Teritori",
  icon: "icons/networks/teritori-circle.svg",
  currencies: teritoriCurrencies,
  addressPrefix: "tori",
  restEndpoint: "https://rest.mainnet.teritori.com",
  rpcEndpoint: "https://rpc.mainnet.teritori.com",
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
