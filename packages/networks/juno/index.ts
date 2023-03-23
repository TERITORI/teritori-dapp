import IconSVG from "../../../assets/icons/networks/juno.svg";
import { NetworkKind, NetworkInfo } from "../types";

export const junoNetwork: NetworkInfo = {
  id: "juno",
  kind: NetworkKind.Cosmos,
  chainId: "juno-1",
  displayName: "Juno",
  icon: IconSVG,
  currencies: [],
  txExplorer: "https://www.mintscan.io/juno/txs/$hash",
  accountExplorer: "https://www.mintscan.io/juno/account/$address",
  contractExplorer: "https://www.mintscan.io/juno/account/$address",
  idPrefix: "juno",
  testnet: false,
  backendEndpoint: "https://dapp-backend.mainnet.teritori.com",
  addressPrefix: "juno",
  restEndpoint: "TODO",
  rpcEndpoint: "TODO",
  stakeCurrency: "ujuno",
  gasPriceStep: {
    low: 0.01,
    average: 0.025,
    high: 0.04,
  },
  features: [],
};
