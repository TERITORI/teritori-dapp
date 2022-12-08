import { NetworkName } from "../NetworkName";
import { NetworkInfo } from "../types";
import { teritoriTestnetCurrencies } from "./currencies";

export const teritoriTestnetNetwork: NetworkInfo = {
  id: "teritori-testnet",
  chainId: "teritori-testnet-v3",
  displayName: NetworkName.TeritoriTestnet,
  icon: "icons/networks/teritori.svg",
  iconCircle: "icons/networks/teritori-circle.svg",
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
  hidden: true,
};
