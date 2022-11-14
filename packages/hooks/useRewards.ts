import { useQuery } from "@tanstack/react-query";
import { Decimal } from "cosmwasm";
import { useMemo } from "react";

import { getNativeCurrency, getNetwork } from "../networks";
import { CosmosRewardsResponse } from "../utils/teritori";
import { CoingeckoPrices, useCoingeckoPrices } from "./useCoingeckoPrices";
import { useSelectedNetworkId } from "./useSelectedNetwork";
import useSelectedWallet from "./useSelectedWallet";

const initialData = { rewards: [], total: [] };

// Getting the total amount of all the rewards, by user's address, and by network
export const useRewards = () => {
  const selectedWallet = useSelectedWallet();
  const selectedNetwork = useSelectedNetworkId();
  const networkId = selectedNetwork || process.env.TERITORI_NETWORK_ID || "";
  const address = selectedWallet?.address;

  // Getting rewards from cosmos distribution
  const { data: networkRewards } = useQuery(
    ["rewards", networkId, address],
    async () => {
      if (!address || !networkId) {
        return initialData;
      }
      return getNetworkRewards(
        networkId,
        "tori14grryrkwtf0ugtlthrnr59ktztc9mnfch5x2dg"
      );
    },
    { initialData, refetchInterval: 5000 }
  );

  // ---- rewards : Prices from coinGecko for each denom and network
  const rewardsPricesAndValidators: {
    rewardPrices: CoingeckoPrices;
    validator: string;
  }[] = [];

  networkRewards.rewards.forEach(async (rew) => {
    const rewardPrices = await useCoingeckoPrices(
      rew.reward.map((r) => ({ networkId, denom: r.denom }))
    );

    rewardsPricesAndValidators.push({
      rewardPrices,
      validator: rew.validator_address,
    });
  });

  //TODO: true prices per validator

  // ---- total : Prices from coinGecko for each denom and network
  const totalPrices = useCoingeckoPrices(
    networkRewards.total.map((total) => ({ networkId, denom: total.denom }))
  );

  const totalAmount = useMemo(() => {
    let finalPrice = 0;

    if (!networkRewards.total || !Object.keys(totalPrices).length) return null;

    networkRewards.total.forEach((total) => {
      const currency = getNativeCurrency(networkId, total.denom);

      // Getting atomic prices for each total amount
      const price =
        currency &&
        Decimal.fromAtomics(
          Math.round(parseFloat(total.amount)).toString(),
          currency.decimals
        ).toFloatApproximation() *
          (totalPrices[currency.coingeckoId]?.usd || 0);

      // Add total's price to the result
      finalPrice += price || 0;
    });

    return finalPrice;
  }, [networkId, networkRewards.total, totalPrices]);

  return { totalAmount, rewardsPricesAndValidators };
};

const getNetworkRewards = async (
  networkId: string,
  address: string
): Promise<CosmosRewardsResponse> => {
  const network = getNetwork(networkId);
  if (!network) {
    return initialData;
  }
  const response = await fetch(
    `${network.restEndpoint}/cosmos/distribution/v1beta1/delegators/${address}/rewards`
  );
  return await response.json();
};
