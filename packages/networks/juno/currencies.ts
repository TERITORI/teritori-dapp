import { NetworkName } from "../NetworkName";
import { allNativeCurrencies } from "../allNativeCurrencies";
import { CurrencyInfo } from "../types";

export const junoCurrencies: CurrencyInfo[] = [
  allNativeCurrencies.find(
    (nativeCurrencyInfo) =>
      nativeCurrencyInfo.sourceNetworkDisplayName === NetworkName.Juno
  ) as CurrencyInfo,
  {
    kind: "ibc",
    denom:
      "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
    displayName: "ATOM",
    sourceNetwork: "cosmos-hub",
    sourceNetworkDisplayName: NetworkName.CosmosHub,
    sourceDenom: "uatom",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-1",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-207",
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
    sourceChannelId: "channel-0",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-42",
    icon: "icons/networks/osmosis-circle.svg",
  },
  {
    kind: "ibc",
    denom:
      "ibc/436B576861090C1C921D56BA1FAE481A04D2E938EBDFF55C4712670F9754AC40",
    displayName: "TORI",
    sourceNetwork: "teritori",
    sourceNetworkDisplayName: NetworkName.Teritori,
    sourceDenom: "utori",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-164",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-11",
    icon: "icons/networks/teritori-circle.svg",
  },
];
