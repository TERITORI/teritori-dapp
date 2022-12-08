import { NetworkName } from "../NetworkName";
import { NetworkInfo } from "../types";
import { osmosisTestnetCurrencies } from "./currencies";

export const osmosisTestnetNetwork: NetworkInfo = {
  id: "osmosis-testnet",
  chainId: "osmo-test-4",
  displayName: NetworkName.OsmosisTestnet,
  icon: "icons/networks/osmosis.svg",
  iconCircle: "icons/networks/osmosis-circle.svg",
  currencies: osmosisTestnetCurrencies,
  addressPrefix: "osmo",
  restEndpoint: "https://lcd-test.osmosis.zone",
  rpcEndpoint: "https://rpc-test.osmosis.zone:443",
  stakeCurrency: "uosmo",
  gasPriceStep: {
    low: 0.01,
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
  hidden: true
};
