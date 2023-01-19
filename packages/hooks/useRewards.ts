import { useQuery } from "@tanstack/react-query";
import { Decimal } from "cosmwasm";
import { useMemo } from "react";

import { getNativeCurrency, getNetwork } from "../networks";
import { CosmosRewardsTotalResponse } from "../utils/teritori";
import { useCoingeckoPrices } from "./useCoingeckoPrices";

// Getting the total amount of all the rewards, by user's address, and by network
export const useRewardsTotal = (
  networkId: string | undefined,
  address: string | undefined
) => {
  // Getting rewards total from cosmos distribution
  const { data: networkRewardsTotal = [] } = useQuery(
    ["rewards", networkId, address],
    async () => {
      if (!address || !networkId) {
        return [];
      }
      return (await getNetworkRewardsTotal(networkId, address)) || [];
    },
    { initialData: [], refetchInterval: 5000 }
  );

  // Prices from coinGecko for each denom and network
  const prices = useCoingeckoPrices(
    networkRewardsTotal.map((total) => ({ networkId, denom: total.denom }))
  );

  const totalAmount = useMemo(() => {
    let finalPrice = 0;

    if (!networkRewardsTotal || !Object.keys(prices).length) return null;

    networkRewardsTotal.forEach((total) => {
      const currency = getNativeCurrency(networkId, total.denom);

      // Getting atomic prices for each total amount
      const price =
        currency &&
        Decimal.fromAtomics(
          Math.round(parseFloat(total.amount)).toString(),
          currency.decimals
        ).toFloatApproximation() * (prices[currency.coingeckoId]?.usd || 0);

      // Add total's price to the result
      finalPrice += price || 0;
    });

    return finalPrice;
  }, [networkId, networkRewardsTotal, prices]);

  return { totalAmount };
};

const getNetworkRewardsTotal = async (
  networkId: string,
  address: string
): Promise<
  {
    denom: string;
    amount: string;
  }[]
> => {
  const network = getNetwork(networkId);
  if (!network || !address.includes(network.addressPrefix)) {
    return [];
  }
  const response = await fetch(
    `${network.restEndpoint}/cosmos/distribution/v1beta1/delegators/${address}/rewards`
  );
  const responseJSON: CosmosRewardsTotalResponse = await response.json();
  return responseJSON.total;
};
