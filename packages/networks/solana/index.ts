import { NetworkName } from "../NetworkName";
import { NetworkInfo } from "../types";
import { solanaCurrencies } from "./currencies";

//TODO: set correct values
export const solanaNetwork: NetworkInfo = {
  id: "solana",
  chainId: "x",
  displayName: NetworkName.Solana,
  icon: "icons/networks/solana.svg",
  iconCircle: "icons/networks/solana-circle.svg",
  currencies: solanaCurrencies,
  addressPrefix: "x",
  restEndpoint: "x",
  rpcEndpoint: "x",
  stakeCurrency: "x",
  gasPriceStep: {
    low: 0.01,
    average: 0.025,
    high: 0.04,
  },
  features: [],
  disabled: true,
};
