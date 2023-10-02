import { currencyETHcolor } from "../../utils/style/colors";
import { CurrencyInfo } from "../types";

export const polygonMumbaiCurrencies: CurrencyInfo[] = [
  {
    denom: "0x0000000000000000000000000000000000000000", // native currency: wei
    displayName: "MATIC",
    decimals: 18,
    coingeckoId: "matic",
    icon: "icons/networks/polygon.svg",
    kind: "native",
    color: currencyETHcolor,
  },
];
