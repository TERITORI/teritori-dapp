import IconSVG from "../../../assets/icons/networks/teritori-circle.svg";
import { CurrencyInfo } from "../types";

export const teritoriCurrencies: CurrencyInfo[] = [
  {
    denom: "utori",
    displayName: "TORI",
    decimals: 6,
    coingeckoId: "teritori",
    icon: IconSVG,
    kind: "native",
    color: "#16BBFF",
  },
  {
    kind: "ibc",
    denom:
      "ibc/A670D9568B3E399316EEDE40C1181B7AA4BD0695F0B37513CE9B95B977DFC12E",
    sourceNetwork: "cosmos-hub",
    sourceDenom: "uatom",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-431",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-10",
  },
];
