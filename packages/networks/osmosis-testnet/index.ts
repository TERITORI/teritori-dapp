import { osmosisTestnetCurrencies } from "./currencies";
import { NetworkFeature, NetworkInfo, NetworkKind } from "../types";

export const osmosisTestnetNetwork: NetworkInfo = {
  id: "osmosis-testnet",
  kind: NetworkKind.Cosmos,
  chainId: "osmo-test-5",
  overrides: "cosmos-registry:osmosistestnet",
  displayName: "Osmosis Latest Testnet",
  icon: "icons/networks/osmosis.svg",
  features: [NetworkFeature.Swap],
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
  restEndpoint: "https://lcd.testnet.osmosis.zone",
  rpcEndpoint: "https://rpc.testnet.osmosis.zone:443",
  stakeCurrency: "uosmo",
  gasPriceStep: {
    low: 0.0,
    average: 0.025,
    high: 0.04,
  },
  cosmosFeatures: [
    "stargate",
    "ibc-transfer",
    "cosmwasm",
    "no-legacy-stdTx",
    "ibc-go",
  ],
};
