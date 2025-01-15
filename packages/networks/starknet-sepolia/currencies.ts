import { currencyETHcolor } from "../../utils/style/colors";
import { CurrencyInfo } from "../types";

export const starknetSepoliaCurrencies: CurrencyInfo[] = [
  {
    denom: "wei",
    displayName: "SepoliaETH",
    decimals: 18,
    variant: "ethereum",
    coingeckoId: "ethereum",
    icon: "ethereum-circle.svg",
    kind: "native",
    color: currencyETHcolor,
  },
];
