import { currencyETHcolor } from "../../utils/style/colors";
import { CurrencyInfo } from "../types";

export const starknetCurrencies: CurrencyInfo[] = [
  {
    denom: "wei",
    displayName: "StarknetETH",
    decimals: 18,
    variant: "ethereum",
    coingeckoId: "ethereum",
    icon: "ethereum-circle.svg",
    kind: "native",
    color: currencyETHcolor,
  },
];
