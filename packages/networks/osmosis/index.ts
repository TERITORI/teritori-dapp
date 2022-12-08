import { NetworkName } from "../NetworkName";
import { NetworkInfo } from "../types";
import { osmosisCurrencies } from "./currencies";

export const osmosisNetwork: NetworkInfo = {
  id: "osmosis",
  chainId: "osmosis-1",
  displayName: NetworkName.Osmosis,
  icon: "icons/networks/osmosis.svg",
  iconCircle: "icons/networks/osmosis-circle.svg",
  currencies: osmosisCurrencies,
  addressPrefix: "osmo",
  restEndpoint: "https://lcd.osmosis.zone",
  rpcEndpoint: "https://rpc.osmosis.zone:443",
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
};
