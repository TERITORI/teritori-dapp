import { NetworkName } from "../NetworkName";
import { allNativeCurrencies } from "../allNativeCurrencies";
import { CurrencyInfo } from "../types";

export const osmosisTestnetCurrencies: CurrencyInfo[] = [
  allNativeCurrencies.find(
    (nativeCurrencyInfo) =>
      nativeCurrencyInfo.sourceNetworkDisplayName === NetworkName.OsmosisTestnet
  ) as CurrencyInfo,
  {
    kind: "ibc",
    denom: "",
    displayName: "ATOM",
    sourceNetwork: "cosmos-hub-testnet",
    sourceNetworkDisplayName: NetworkName.CosmosHubTheta,
    sourceDenom: "uatom",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-1234",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-673",
    icon: "icons/networks/cosmos-hub-circle.svg",
  },
  {
    kind: "ibc",
    denom: "",
    displayName: "TORI",
    sourceNetwork: "teritori-testnet",
    sourceNetworkDisplayName: NetworkName.TeritoriTestnet,
    sourceDenom: "utori",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-1810",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-34",
    icon: "icons/networks/teritori-circle.svg",
  },
  // TODO: Have to create juno-testnet network (uni-5) ?
  {
    kind: "ibc",
    denom: "",
    displayName: "JUNO",
    sourceNetwork: "juno-testnet",
    sourceNetworkDisplayName: NetworkName.JunoTestnet,
    sourceDenom: "ujuno",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-1836",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-414",
    icon: "icons/networks/juno-circle.svg",
  },
];
