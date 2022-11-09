import { useQuery } from "@tanstack/react-query";
import { Decimal } from "cosmwasm";
import { useMemo } from "react";

import { getNativeCurrency, getNetwork } from "../networks";
import { CosmosRewardsResponse } from "../utils/teritori";
import { useCoingeckoPrices } from "./useCoingeckoPrices";

export const useRewards = (
  networkId: string | undefined,
  address: string | undefined
) => {
  // Getting rewards from cosmos distribution
  const { data: networkRewards } = useQuery(
    ["rewards", networkId, address],
    async () => {
      if (!address || !networkId) {
        return [];
      }

      return getNetworkRewards(networkId, address);
    },
    { initialData: [], refetchInterval: 5000 }
  );

  // Keeping only rewards objects
  const rewards: {
    denom: string;
    amount: string;
  }[] = [];
  networkRewards.forEach((nRew) => {
    nRew.reward.forEach((rew) => {
      rewards.push(rew);
    });
  });

  // Prices from coinGecko for each denom and network
  const prices = useCoingeckoPrices(
    rewards.map((rew) => ({ networkId, denom: rew.denom }))
  );

  const totalAmount = useMemo(() => {
    let finalPrice = 0;

    if (!rewards || !Object.keys(prices).length) return null;

    rewards.forEach((rew) => {
      const currency = getNativeCurrency(networkId, rew.denom);

      // Getting atomic prices for each reward amount
      const price =
        currency &&
        Decimal.fromAtomics(
          Math.round(parseFloat(rew.amount)).toString(),
          currency.decimals
        ).toFloatApproximation() * (prices[currency.coingeckoId]?.usd || 0);

      // Add reward's price to result
      finalPrice += price || 0;
    });

    return finalPrice;
  }, [networkId, rewards, prices]);

  return { rewards, totalAmount };
};

const getNetworkRewards = async (
  networkId: string,
  address: string
): Promise<
  {
    validator_address: string;
    reward: {
      denom: string;
      amount: string;
    }[];
  }[]
> => {
  const network = getNetwork(networkId);
  if (!network) {
    return [];
  }
  const response = await fetch(
    `${network.restEndpoint}/cosmos/distribution/v1beta1/delegators/${address}/rewards`
  );
  const responseJSON: CosmosRewardsResponse = await response.json();
  return responseJSON.rewards;
};
