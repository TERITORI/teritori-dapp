import { NetworkName } from "../NetworkName";
import { allNativeCurrencies } from "../allNativeCurrencies";
import { CurrencyInfo } from "../types";

export const osmosisTestnetCurrencies: CurrencyInfo[] = [
  allNativeCurrencies.find(
    (nativeCurrencyInfo) =>
      nativeCurrencyInfo.sourceNetworkDisplayName === NetworkName.OsmosisTestnet
  ) as CurrencyInfo,

  //TODO: ibc for teritori-testnet and cosmos-hub-theta
];
