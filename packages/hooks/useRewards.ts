import { useQuery } from "@tanstack/react-query";

import { getNetwork } from "../networks";
import { CosmosRewardsResponse } from "../utils/teritori";
import {
  CoingeckoCoin,
  getCoingeckoPrice,
  useCoingeckoPrices,
} from "./useCoingeckoPrices";
import { useSelectedNetworkId } from "./useSelectedNetwork";

export type Reward = {
  validator: string;
  denom: string;
  amount: string;
  price: number;
};
export type TotalRewards = {
  denom: string;
  amount: string;
  price: number;
};

const initialData = { rewards: [], total: [] };

// TODO: Handle multiple wallets addresses (Maybe use useWallets + useQueries)

// Getting the rewards, by user's wallet address, and by network.
export const useRewards = (walletAddress?: string) => {
  const selectedNetwork = useSelectedNetworkId();
  const networkId = selectedNetwork || process.env.TERITORI_NETWORK_ID || "";

  // ---- Getting rewards from cosmos distribution
  const { data: networkRewards } = useQuery(
    ["rewards", networkId, walletAddress],
    async () => {
      if (!walletAddress || !networkId) {
        return initialData;
      }
      return getNetworkRewards(networkId, walletAddress);
    },
    { initialData, refetchInterval: 5000 }
  );

  // ---- Get all denoms used for these rewards
  const denoms: string[] = [];
  networkRewards.rewards.forEach((rew) => {
    rew.reward.forEach((r) => {
      let neverAdded = false;
      denoms.forEach((d) => {
        if (d === r.denom) neverAdded = true;
      });
      if (!neverAdded) denoms.push(r.denom);
    });
  });

  // ---- Get all prices for these denoms
  const coins: CoingeckoCoin[] = [];
  denoms.forEach((denom) => {
    coins.push({
      networkId,
      denom,
    });
  });
  const prices = useCoingeckoPrices(coins);

  // ========= Handle rewards per validator
  const rewards: Reward[] = [];

  networkRewards.rewards.forEach((rew) => {
    rew.reward.forEach((r) => {
      const price = getCoingeckoPrice(networkId, r.denom, r.amount, prices);
      const finalReward: Reward = {
        validator: rew.validator_address,
        denom: r.denom,
        amount: r.amount,
        price: price || 0,
      };
      rewards.push(finalReward);
    });
  });
  // })

  // ========= Handle the rewards total
  const totalsRewards: TotalRewards[] = [];

  networkRewards.total.forEach((t) => {
    const price = getCoingeckoPrice(networkId, t.denom, t.amount, prices);
    const finalTotal: TotalRewards = {
      denom: t.denom,
      amount: t.amount,
      price: price || 0,
    };
    totalsRewards.push(finalTotal);
  });

  return { totalsRewards, rewards };
};

// Returns the rewards from cosmos API. You can specify a validator address
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

// Rewards total price for all denoms
export const rewardsPrice = (rewards: Reward[]) => {
  return rewards.reduce((accumulatedPrice, rewards) => {
    return accumulatedPrice + rewards.price;
  }, 0);
};

// Rewards total price for all denoms
export const totalsRewardsPrice = (totalsRewards: TotalRewards[]) => {
  return totalsRewards.reduce((accumulatedPrice, rewards) => {
    return accumulatedPrice + rewards.price;
  }, 0);
};
