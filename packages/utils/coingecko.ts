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
  const currency = getNativeCurrency(networkId, denom);
  return (
    currency &&
    Decimal.fromAtomics(
      // An amount with not enough decimals will be considered as zero
      Math.round(parseFloat(amount)).toString(),
      currency.decimals,
    ).toFloatApproximation() * (prices[currency.coingeckoId]?.usd || 0)
  );
};
