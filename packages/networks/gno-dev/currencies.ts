import { currencyGNOcolor } from "../../utils/style/colors";
import { CurrencyInfo } from "../types";

export const gnoCurrencies: CurrencyInfo[] = [
  {
    denom: "ugnot",
    displayName: "GNOT",
    decimals: 6,
    coingeckoId: "gno",
    icon: "gno.svg",
    kind: "native",
    color: currencyGNOcolor,
  },
  {
    denom: "gno.land/r/demo/tori20",
    displayName: "TORI20",
    decimals: 6,
    coingeckoId: "gno",
    icon: "gno.svg",
    kind: "grc20",
    color: currencyGNOcolor,
  },
];
