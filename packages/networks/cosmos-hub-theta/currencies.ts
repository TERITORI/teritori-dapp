import IconSVG from "../../../assets/icons/networks/cosmos-hub-circle.svg";
import { purpleDark } from "../../utils/style/colors";
import { CurrencyInfo } from "../types";

export const cosmosHubThetaCurrencies: CurrencyInfo[] = [
  {
    denom: "uatom",
    displayName: "ATOM",
    decimals: 6,
    coingeckoId: "cosmos",
    icon: IconSVG,
    kind: "native",
    color: purpleDark,
  },
];
