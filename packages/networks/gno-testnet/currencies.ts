import { currencyGNOcolor } from "../../utils/style/colors";
import { CurrencyInfo } from "../types";

export const gnoCurrencies: CurrencyInfo[] = [
  {
    denom: "ugnot", // native currency: ugnot
    displayName: "ugnot",
    decimals: 6,
    coingeckoId: "ugnot",
    icon: "icons/networks/ethereum-circle.svg",
    kind: "native",
    color: currencyGNOcolor,
  },
];
