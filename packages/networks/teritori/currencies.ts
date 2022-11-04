import { CurrencyInfo } from "../types";

export const teritoriCurrencies: CurrencyInfo[] = [
  {
    denom: "utori",
    displayName: "TORI",
    decimals: 6,
    coingeckoId: "teritori",
    icon: "icons/networks/teritori-circle.svg",
    kind: "native",
    color: "#16BBFF",
  },
  {
    kind: "ibc",
    denom:
      "ibc/a670d9568b3e399316eede40c1181b7aa4bd0695f0b37513ce9b95b977dfc12e",
    sourceNetwork: "cosmos-hub",
    sourceDenom: "uatom",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-431",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-10",
  },
];
