import { Network } from "../../utils/network";
import { NetworkInfo } from "../types";
import { ethereumMainnetCurrencies } from "./currencies";

export const ethereumGoerliNetwork: NetworkInfo = {
  id: "ethereum-mainnet",
  network: Network.Ethereum,
  chainId: "1",
  displayName: "Ethereum Mainnet",
  icon: "icons/networks/ethereum-circle.svg",
  currencies: ethereumMainnetCurrencies,
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
