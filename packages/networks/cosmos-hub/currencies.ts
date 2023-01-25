import { CurrencyInfo } from "../types";
import {purpleDark} from "../../utils/style/colors";

export const cosmosHubCurrencies: CurrencyInfo[] = [
  {
    denom: "uatom",
    displayName: "ATOM",
    decimals: 6,
    coingeckoId: "cosmos",
    icon: "icons/networks/cosmos-hub-circle.svg",
    kind: "native",
    color: purpleDark,
  },
];
