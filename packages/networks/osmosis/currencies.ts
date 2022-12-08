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
];
