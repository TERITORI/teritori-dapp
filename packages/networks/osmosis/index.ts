import { osmosisCurrencies } from "./currencies";
import { NetworkKind, NetworkInfo, NetworkFeature } from "../types";

export const osmosisNetwork: NetworkInfo = {
  id: "osmosis",
  kind: NetworkKind.Cosmos,
  chainId: "osmosis-1",
  displayName: "Osmosis",
  icon: "icons/networks/osmosis.svg",
  features: [NetworkFeature.Swap],
  overrides: "cosmos-registry:osmosis",
  currencies: osmosisCurrencies,
  txExplorer: "https://www.mintscan.io/osmosis/txs/$hash",
  accountExplorer: "https://www.mintscan.io/osmosis/account/$address",
  contractExplorer: "https://www.mintscan.io/osmosis/account/$address",
  idPrefix: "osmo",
  testnet: false,
  backendEndpoint: "https://dapp-backend.mainnet.teritori.com",
  addressPrefix: "osmo",
  restEndpoint: "https://lcd.osmosis.zone",
  rpcEndpoint: "https://rpc.osmosis.zone:443",
  stakeCurrency: "uosmo",
  gasPriceStep: {
    low: 0.0,
    average: 0.025,
    high: 0.04,
  },
  nameServiceDefaultImage:
    "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.svg",
  cosmosFeatures: [
    "stargate",
    "ibc-transfer",
    "cosmwasm",
    "no-legacy-stdTx",
    "ibc-go",
  ],
};
