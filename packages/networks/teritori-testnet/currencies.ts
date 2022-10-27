import { CurrencyInfo } from "../types";

export const teritoriTestnetCurrencies: CurrencyInfo[] = [
  {
    denom: "utori",
    displayName: "TORI",
    decimals: 6,
    coingeckoId: "teritori",
    icon: "icons/networks/teritori-circle.svg",
    kind: "native",
  },
  {
    kind: "ibc",
    denom:
      "ibc/C9300DDD93DF3A3A668CAB02398A0AA081EF89EC005B2DB68832E363BAAABF85",
    sourceNetwork: "cosmos-hub-theta",
    sourceDenom: "uatom",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-685",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-30",
  },
];
