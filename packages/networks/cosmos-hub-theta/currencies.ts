import { currencyATOMcolor } from "../../utils/style/colors";
import { CurrencyInfo } from "../types";

export const cosmosHubThetaCurrencies: CurrencyInfo[] = [
  {
    denom: "uatom",
    displayName: "ATOM",
    decimals: 6,
    coingeckoId: "cosmos",
    icon: "icons/networks/cosmos-hub-circle.svg",
    kind: "native",
    color: currencyATOMcolor,
  },
];
