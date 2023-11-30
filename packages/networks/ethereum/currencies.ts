import { currencyETHcolor } from "../../utils/style/colors";
import { CurrencyInfo } from "../types";

export const ethereumCurrencies: CurrencyInfo[] = [
  {
    denom: "0x0000000000000000000000000000000000000000", // native currency: wei
    displayName: "ETH",
    decimals: 18,
    coingeckoId: "ethereum",
    icon: "ethereum-circle.svg",
    kind: "native",
    color: currencyETHcolor,
  },
];
