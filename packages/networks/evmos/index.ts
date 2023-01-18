import { NetworkName } from "../NetworkName";
import { NetworkInfo } from "../types";
import { evmosCurrencies } from "./currencies";

//TODO: set correct values
export const evmosNetwork: NetworkInfo = {
  id: "evmos",
  chainId: "evmos_9001-2",
  displayName: NetworkName.Evmos,
  icon: "icons/networks/evmos.svg",
  iconCircle: "icons/networks/evmos-circle.svg",
  currencies: evmosCurrencies,
  addressPrefix: "x",
  restEndpoint: "https://lcd-evmos.keplr.app/",
  rpcEndpoint: "https://rpc-evmos.keplr.app/",
  stakeCurrency: "x",
  gasPriceStep: {
    low: 0.01,
    average: 0.025,
    high: 0.04,
  },
  features: [],
  disabled: true,
};
