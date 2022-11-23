import { useQuery } from "@tanstack/react-query";
import { Decimal } from "cosmwasm";

import { getNativeCurrency } from "../networks";
import { isDefined } from "../utils/filter";

type CoingeckoPrices = { [key: string]: { usd: number } };
export type CoingeckoCoin = {
  networkId: string | undefined;
  denom: string | undefined;
};

export const useCoingeckoPrices = (coins: CoingeckoCoin[]) => {
  const ids = coins
    .map((coin) => getNativeCurrency(coin.networkId, coin.denom)?.coingeckoId)
    .filter(isDefined)
    .sort((a, b) => a.localeCompare(b));

  const { data } = useQuery(
    ["coingeckoPrices", ids],
    async () => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(
          ids.join(",")
        )}&vs_currencies=usd`
      );
      const prices: CoingeckoPrices = await response.json();
      return prices;
    },
    {
      initialData: {},
      refetchInterval: 20000,
      staleTime: Infinity,
      initialDataUpdatedAt: 0,
    }
  );

  const getCoingeckoPrice = (
    networkId: string,
    denom: string,
    amount: string,
    prices: CoingeckoPrices
  ) => {
    const currency = getNativeCurrency(networkId, denom);
    return (
      currency &&
      Decimal.fromAtomics(
        // An amount with not enough decimals will be considered as zero
        Math.round(parseFloat(amount)).toString(),
        currency.decimals
      ).toFloatApproximation() * (prices[currency.coingeckoId]?.usd || 0)
    );
  };

  return { prices: data, getCoingeckoPrice };
};
