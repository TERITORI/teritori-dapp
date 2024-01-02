import { useQuery } from "@tanstack/react-query";

import { getNativeCurrency } from "../networks";
import { CoingeckoCoin, CoingeckoPrices } from "../utils/coingecko";
import { isDefined } from "../utils/filter";

export const useCoingeckoPrices = (coins: CoingeckoCoin[]) => {
  const ids = coins
    .map((coin) => getNativeCurrency(coin.networkId, coin.denom)?.coingeckoId)
    .filter(isDefined)
    .sort((a, b) => a.localeCompare(b));

  const { data } = useQuery(
    ["coingeckoPrices", ids],
    async () => {
      if (ids.length === 0) return {};

      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(
          ids.join(","),
        )}&vs_currencies=usd`,
      );
      const prices: CoingeckoPrices = await response.json();
      return prices;
    },
    {
      initialData: {},
      refetchInterval: 60000,
      staleTime: Infinity,
      initialDataUpdatedAt: 0,
    },
  );

  return { prices: data };
};
