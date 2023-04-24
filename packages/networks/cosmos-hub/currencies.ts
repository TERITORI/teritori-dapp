import { currencyATOMcolor } from "../../utils/style/colors";
import { CurrencyInfo } from "../types";

export const cosmosHubCurrencies: CurrencyInfo[] = [
  {
    denom: "uatom",
    displayName: "ATOM",
    decimals: 6,
    coingeckoId: "cosmos",
    icon: "cosmos-hub-circle.svg",
    kind: "native",
    color: currencyATOMcolor,
  },
];
