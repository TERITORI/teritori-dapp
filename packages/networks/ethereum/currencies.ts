import IconSVG from "../../../assets/icons/networks/ethereum-circle.svg";
import { CurrencyInfo } from "../types";

export const ethereumCurrencies: CurrencyInfo[] = [
  {
    denom: "0x0000000000000000000000000000000000000000", // native currency: wei
    displayName: "ETH",
    decimals: 18,
    coingeckoId: "ethereum",
    icon: IconSVG,
    kind: "native",
    color: "#16BBFF",
  },
];
