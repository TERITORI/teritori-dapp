import { NetworkInfo, NetworkKind } from "../types";
import { osmosisTestnetCurrencies } from "./currencies";

export const osmosisTestnetNetwork: NetworkInfo = {
  id: "osmosis-testnet",
  kind: NetworkKind.Cosmos,
  chainId: "osmo-test-4",
  displayName: "Osmosis Testnet",
  icon: "icons/networks/osmosis.svg",
  currencies: osmosisTestnetCurrencies,
  txExplorer: "https://testnet.mintscan.io/osmosis-testnet/txs/$hash",
  accountExplorer:
    "https://testnet.mintscan.io/osmosis-testnet/account/$address",
  contractExplorer:
    "https://testnet.mintscan.io/osmosis-testnet/account/$address",
  idPrefix: "testosmo",
  testnet: true,
  backendEndpoint: "https://dapp-backend.testnet.teritori.com",
  addressPrefix: "osmo",
  restEndpoint: "https://lcd-test.osmosis.zone",
  rpcEndpoint: "https://rpc-test.osmosis.zone:443",
  stakeCurrency: "uosmo",
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
};
