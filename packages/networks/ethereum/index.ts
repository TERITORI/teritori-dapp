import { NetworkName } from "../NetworkName";
import { NetworkInfo } from "../types";
import { ethereumCurrencies } from "./currencies";

//TODO: set correct values
export const ethereumNetwork: NetworkInfo = {
  id: "ethereum",
  chainId: "x",
  displayName: NetworkName.Ethereum,
  icon: "icons/networks/ethereum.svg",
  iconCircle: "icons/networks/ethereum-circle.svg",
  currencies: ethereumCurrencies,
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
