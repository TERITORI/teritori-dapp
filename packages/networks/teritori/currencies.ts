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
    sourceNetwork: "cosmoshub",
    sourceNetworkDisplayName: NetworkName.CosmosHub,
    sourceDenom: "uatom",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-431",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-10",
    icon: "icons/networks/cosmos-hub-circle.svg",
  },
  {
    kind: "ibc",
    denom:
      "ibc/ED07A3391A112B175915CD8FAF43A2DA8E4790EDE12566649D0C2F97716B8518",
    displayName: "OSMO",
    sourceNetwork: "osmosis",
    sourceNetworkDisplayName: NetworkName.Osmosis,
    sourceDenom: "uosmo",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-431",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-0",
    icon: "icons/networks/osmosis-circle.svg",
  },
  {
    kind: "ibc",
    denom:
      "ibc/89C79BD28DCCF300B9EE87740B061011AD870EC480777FAB95D85B3ED36BC06C",
    displayName: "JUNO",
    sourceNetwork: "juno",
    sourceNetworkDisplayName: NetworkName.Juno,
    sourceDenom: "ujuno",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-431",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-11",
    icon: "icons/networks/juno-circle.svg",
  },
];
