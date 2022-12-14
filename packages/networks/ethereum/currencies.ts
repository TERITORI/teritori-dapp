import { NetworkName } from "../NetworkName";
import { allNativeCurrencies } from "../allNativeCurrencies";
import { CurrencyInfo } from "../types";

//TODO: set correct values
export const ethereumCurrencies: CurrencyInfo[] = [
  allNativeCurrencies.find(
    (nativeCurrencyInfo) =>
      nativeCurrencyInfo.sourceNetworkDisplayName === NetworkName.Ethereum
  ) as CurrencyInfo,
];
