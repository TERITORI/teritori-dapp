import { NetworkInfo } from "../types";
import { ethereumGoerliCurrencies } from "./currencies";

export const ethereumGoerliNetwork: NetworkInfo = {
  id: "ethereum-goerli",
  chainId: "5",
  displayName: "Ethereum Goerli",
  icon: "icons/networks/ethereum-circle.svg",
  currencies: ethereumGoerliCurrencies,
  addressPrefix: "eth",
  restEndpoint: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  rpcEndpoint: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  stakeCurrency: "ether",
  gasPriceStep: {
    low: 0.0,
    average: 0.025,
    high: 0.04,
  },
  features: [],
};
