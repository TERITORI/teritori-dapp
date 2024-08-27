import { currencyETHcolor } from "../../utils/style/colors";
import { CurrencyInfo } from "../types";

export const polygonCurrencies: CurrencyInfo[] = [
  {
    denom: "0x0000000000000000000000000000000000000000", // native currency: wei
    displayName: "MATIC",
    decimals: 18,
    variant: "ethereum",
    coingeckoId: "matic",
    icon: "polygon.svg",
    kind: "native",
    color: currencyETHcolor,
  },
];
