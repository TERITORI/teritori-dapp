import { currencyJUNOcolor } from "../../utils/style/colors";
import { CurrencyInfo } from "../types";

export const junoCurrencies: CurrencyInfo[] = [
  {
    denom: "ujuno",
    displayName: "JUNO",
    decimals: 6,
    coingeckoId: "juno-network",
    icon: "juno-circle.svg",
    kind: "native",
    color: currencyJUNOcolor,
  },
  {
    kind: "ibc",
    denom:
      "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
    sourceNetwork: "cosmos-hub",
    sourceDenom: "uatom",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-1",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-207",
  },
  {
    kind: "ibc",
    denom:
      "ibc/ED07A3391A112B175915CD8FAF43A2DA8E4790EDE12566649D0C2F97716B8518",
    sourceNetwork: "osmosis",
    sourceDenom: "uosmo",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-0",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-42",
  },
  {
    kind: "ibc",
    denom:
      "ibc/436B576861090C1C921D56BA1FAE481A04D2E938EBDFF55C4712670F9754AC40",
    sourceNetwork: "teritori",
    sourceDenom: "utori",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-164",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-11",
  },
];
