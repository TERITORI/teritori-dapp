import { useQuery } from "@tanstack/react-query";

import { getNativeCurrency } from "../networks";
import { isDefined } from "../utils/filter";

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
      const prices: { [key: string]: { usd: number } } = await response.json();
      return prices;
    },
    { initialData: {}, refetchInterval: 5000 }
  );
  return data;
};
