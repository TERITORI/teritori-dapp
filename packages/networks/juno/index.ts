import { NetworkName } from "../NetworkName";
import { NetworkInfo } from "../types";
import { junoCurrencies } from "./currencies";

//TODO: set correct values
export const junoNetwork: NetworkInfo = {
  id: "juno",
  chainId: "juno-1",
  displayName: NetworkName.Juno,
  icon: "icons/networks/juno.svg",
  iconCircle: "icons/networks/juno-circle.svg",
  currencies: junoCurrencies,
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
