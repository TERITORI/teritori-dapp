import { currencyTORIcolor } from "../../utils/style/colors";
import { CurrencyInfo } from "../types";

export const teritoriTestnetCurrencies: CurrencyInfo[] = [
  {
    denom: "utori",
    displayName: "TORI",
    decimals: 6,
    coingeckoId: "teritori",
    icon: "icons/networks/teritori-circle.svg",
    kind: "native",
    color: currencyTORIcolor,
  },
  {
    kind: "ibc",
    denom:
      "ibc/2CC0B1B7A981ACC74854717F221008484603BB8360E81B262411B0D830EDE9B0",
    sourceNetwork: "cosmos-registry:axelartestnet",
    sourceDenom: "uaxl",
    sourceChannelId: "channel-399",
    sourceChannelPort: "transfer",
    destinationChannelId: "channel-0",
    destinationChannelPort: "transfer",
  },
];
