import { NetworkKind, NetworkInfo } from "../types";

export const osmosisNetwork: NetworkInfo = {
  id: "osmosis",
  kind: NetworkKind.Cosmos,
  chainId: "TODO",
  displayName: "Osmosis",
  icon: "icons/networks/osmosis.svg",
  currencies: [],
  txExplorer: "https://www.mintscan.io/osmosis/txs/$hash",
  accountExplorer: "https://www.mintscan.io/osmosis/account/$address",
  contractExplorer: "https://www.mintscan.io/osmosis/account/$address",
  idPrefix: "osmo",
  testnet: false,
  backendEndpoint: "https://dapp-backend.mainnet.teritori.com",
  addressPrefix: "osmo",
  restEndpoint: "TODO",
  rpcEndpoint: "TODO",
  stakeCurrency: "uosmo",
  gasPriceStep: {
    low: 0.0,
    average: 0.025,
    high: 0.04,
  },
  features: [],
};
