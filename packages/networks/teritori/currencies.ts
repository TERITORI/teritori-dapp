import { NetworkName } from "../NetworkName";
import { allNativeCurrencies } from "../allNativeCurrencies";
import { CurrencyInfo } from "../types";

export const teritoriCurrencies: CurrencyInfo[] = [
  allNativeCurrencies.find(
    (nativeCurrencyInfo) =>
      nativeCurrencyInfo.sourceNetworkDisplayName === NetworkName.Teritori
  ) as CurrencyInfo,
  {
    kind: "ibc",
    denom:
      "ibc/A670D9568B3E399316EEDE40C1181B7AA4BD0695F0B37513CE9B95B977DFC12E",
    displayName: "ATOM",
    sourceNetwork: "cosmos-hub",
    sourceNetworkDisplayName: NetworkName.CosmosHub,
    sourceDenom: "uatom",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-10",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-431",
    icon: "icons/networks/cosmos-hub-circle.svg",
  },
  {
    kind: "ibc",
    denom:"",
    displayName: "OSMO",
    sourceNetwork: "osmosis",
    sourceNetworkDisplayName: NetworkName.Osmosis,
    sourceDenom: "uosmo",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-0",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-362",
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
    sourceChannelId: "channel-11",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-164",
    icon: "icons/networks/juno-circle.svg",
  },
];
