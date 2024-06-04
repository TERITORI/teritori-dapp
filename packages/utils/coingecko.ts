import { Decimal } from "@cosmjs/math";

import { getNativeCurrency } from "../networks";

export type CoingeckoPrices = { [key: string]: { usd: number } };

export type CoingeckoCoin = {
  networkId: string | undefined;
  denom: string | undefined;
};

export const getCoingeckoPrice = (
  networkId: string,
  denom: string,
  amount: string,
  prices: CoingeckoPrices,
) => {
  try {
    if (!amount || !denom) {
      return undefined;
    }
    const currency = getNativeCurrency(networkId, denom);
    if (!currency) {
      return undefined;
    }
    const price = prices[currency.coingeckoId];
    if (!price) {
      return undefined;
    }
    return (
      Decimal.fromAtomics(amount, currency.decimals).toFloatApproximation() *
      price.usd
    );
  } catch {
    return undefined;
  }
};
