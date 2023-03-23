import IconSVG from "../../../assets/icons/networks/ethereum-circle.svg";
import { CurrencyInfo } from "../types";

export const ethereumGoerliCurrencies: CurrencyInfo[] = [
  {
    denom: "0x0000000000000000000000000000000000000000", // native currency: wei
    displayName: "GoerliETH",
    decimals: 18,
    coingeckoId: "ethereum",
    icon: IconSVG,
    kind: "native",
    color: "#16BBFF",
  },
];
