import { currencyTORIcolor } from "../../utils/style/colors";
import { CurrencyInfo } from "../types";

export const teritoriLocalnetCurrencies: CurrencyInfo[] = [
  {
    denom: "utori",
    displayName: "TORI",
    variant: "cosmos",
    decimals: 6,
    coingeckoId: "teritori",
    icon: "icons/networks/teritori-circle.svg",
    kind: "native",
    color: currencyTORIcolor,
  },
];
