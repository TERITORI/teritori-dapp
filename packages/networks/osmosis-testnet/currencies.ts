import { currencyOSMOcolor } from "../../utils/style/colors";
import { CurrencyInfo } from "../types";

export const osmosisTestnetCurrencies: CurrencyInfo[] = [
  {
    denom: "uosmo",
    displayName: "OSMO",
    decimals: 6,
    coingeckoId: "osmosis",
    icon: "osmosis-circle.svg",
    kind: "native",
    color: currencyOSMOcolor,
  },
  {
    kind: "ibc",
    denom:
      "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
    sourceNetwork: "cosmos-hub-theta",
    sourceDenom: "uatom",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-0",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-141",
  },
  {
    kind: "ibc",
    denom:
      "ibc/EB7FB9C8B425F289B63703413327C2051030E848CE4EAAEA2E51199D6D39D3EC",
    sourceNetwork: "teritori-testnet",
    sourceDenom: "utori",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-362",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-0",
  },
];
