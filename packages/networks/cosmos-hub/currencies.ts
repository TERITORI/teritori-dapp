import { NetworkName } from "../NetworkName";
import { allNativeCurrencies } from "../allNativeCurrencies";
import { CurrencyInfo } from "../types";

export const cosmosHubCurrencies: CurrencyInfo[] = [
  allNativeCurrencies.find(
    (nativeCurrencyInfo) =>
      nativeCurrencyInfo.sourceNetworkDisplayName === NetworkName.CosmosHub
  ) as CurrencyInfo,
  {
    kind: "ibc",
    denom: "",
    displayName: "TORI",
    sourceNetwork: "teritori",
    sourceNetworkDisplayName: NetworkName.Teritori,
    sourceDenom: "utori",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-431",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-10",
    icon: "icons/networks/teritori-circle.svg",
  },
  {
    kind: "ibc",
    denom: "",
    displayName: "OSMO",
    sourceNetwork: "osmosis",
    sourceNetworkDisplayName: NetworkName.Osmosis,
    sourceDenom: "uosmo",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-141",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-0",
    icon: "icons/networks/osmosis-circle.svg",
  },
  {
    kind: "ibc",
    denom: "",
    displayName: "JUNO",
    sourceNetwork: "juno",
    sourceNetworkDisplayName: NetworkName.Juno,
    sourceDenom: "ujuno",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-207",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-1",
    icon: "icons/networks/juno-circle.svg",
  },
];
