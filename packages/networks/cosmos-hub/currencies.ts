import comsomsHubCircleSVG from "../../../assets/icons/networks/cosmos-hub-circle.svg";
import { purpleDark } from "../../utils/style/colors";
import { CurrencyInfo } from "../types";

export const cosmosHubCurrencies: CurrencyInfo[] = [
  {
    denom: "uatom",
    displayName: "ATOM",
    decimals: 6,
    coingeckoId: "cosmos",
    icon: comsomsHubCircleSVG,
    kind: "native",
    color: purpleDark,
  },
];
