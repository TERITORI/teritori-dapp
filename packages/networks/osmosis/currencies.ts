import { currencyOSMOcolor } from "../../utils/style/colors";
import { CurrencyInfo } from "../types";

export const osmosisCurrencies: CurrencyInfo[] = [
  {
    denom: "uosmo",
    displayName: "OSMO",
    decimals: 6,
    coingeckoId: "osmosis",
    icon: "icons/networks/osmosis-circle.svg",
    kind: "native",
    color: currencyOSMOcolor,
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

  //TODO: ibc for teritori
];
