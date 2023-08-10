import { currencyGNOcolor } from "../../utils/style/colors";
import { CurrencyInfo } from "../types";

export const gnoCurrencies: CurrencyInfo[] = [
  {
    denom: "ugnot",
    displayName: "GNOT",
    decimals: 6,
    coingeckoId: "gno",
    icon: "icons/networks/gno.svg",
    kind: "native",
    color: currencyGNOcolor,
  },
];
