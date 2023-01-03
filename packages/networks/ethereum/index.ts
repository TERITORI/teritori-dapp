import { Network } from "../../utils/network";
import { NetworkInfo } from "../types";
import { ethereumCurrencies } from "./currencies";

export const ethereumNetwork: NetworkInfo = {
  id: "ethereum",
  network: Network.Ethereum,
  chainId: "1",
  displayName: "Ethereum",
  icon: "icons/networks/ethereum-circle.svg",
  currencies: ethereumCurrencies,
  addressPrefix: "eth",
  restEndpoint: "https://ethereum.publicnode.com",
  rpcEndpoint: "https://ethereum.publicnode.com",
  stakeCurrency: "ether",
  gasPriceStep: {
    low: 0.0,
    average: 0.025,
    high: 0.04,
  },
  features: [],
};
