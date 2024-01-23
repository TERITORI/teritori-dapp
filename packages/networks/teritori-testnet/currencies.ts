import { currencyTORIcolor } from "../../utils/style/colors";
import { CurrencyInfo } from "../types";

export const teritoriTestnetCurrencies: CurrencyInfo[] = [
  {
    denom: "utori",
    displayName: "TORI",
    decimals: 6,
    coingeckoId: "teritori",
    icon: "teritori-circle.svg",
    kind: "native",
    color: currencyTORIcolor,
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
    deprecated: true,
  },
  {
    kind: "ibc",
    denom:
      "ibc/8D9734B53D56DC57A92E4CC788547699853F411190F6DAA70FA12B9BD062F7AE",
    sourceNetwork: "cosmos-hub-theta",
    sourceDenom: "uatom",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-701",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-33",
  },
];
