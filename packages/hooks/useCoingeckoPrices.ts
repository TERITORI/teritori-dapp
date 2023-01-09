import { useQuery } from "@tanstack/react-query";

import { getNativeCurrency } from "../networks";
import { isDefined } from "../utils/filter";

export type CoingeckoPrices = { [key: string]: { usd: number } };

export const useCoingeckoPrices = (
  coins: { networkId: string | undefined; denom: string | undefined }[]
) => {
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
  return data;
};
