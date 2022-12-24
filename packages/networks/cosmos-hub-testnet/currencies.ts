import { NetworkName } from "../NetworkName";
import { allNativeCurrencies } from "../allNativeCurrencies";
import { CurrencyInfo } from "../types";

export const cosmosHubThetaCurrencies: CurrencyInfo[] = [
  allNativeCurrencies.find(
    (nativeCurrencyInfo) =>
      nativeCurrencyInfo.sourceNetworkDisplayName === NetworkName.CosmosHubTheta
  ) as CurrencyInfo,
  {
    kind: "ibc",
    denom: "",
    displayName: "OSMO",
    sourceNetwork: "osmosis-testnet",
    sourceNetworkDisplayName: NetworkName.OsmosisTestnet,
    sourceDenom: "uosmo",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-1235",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-1683",
    icon: "icons/networks/osmosis-circle.svg",
  },
  {
    kind: "ibc",
    denom: "",
    displayName: "TORI",
    sourceNetwork: "teritori-testnet",
    sourceNetworkDisplayName: NetworkName.TeritoriTestnet,
    sourceDenom: "utori",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-685",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-30",
    icon: "icons/networks/teritori-circle.svg",
  },
  // Only Juno mainnet (juno-1)
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
