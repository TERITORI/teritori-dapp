import { currencyGNOcolor } from "../../utils/style/colors";
import { CurrencyInfo } from "../types";

export const gnoCurrencies: CurrencyInfo[] = [
  {
    denom: "ugnot",
    displayName: "GNOT",
    decimals: 6,
    variant: "gno",
    coingeckoId: "gno",
    icon: "gno.svg",
    kind: "native",
    color: currencyGNOcolor,
  },
  {
    denom: "gno.land/r/demo/tori20",
    displayName: "TORI20",
    decimals: 6,
    variant: "grc20",
    coingeckoId: "gno",
    icon: "gno.svg",
    kind: "native",
    color: currencyGNOcolor,
  },
];
