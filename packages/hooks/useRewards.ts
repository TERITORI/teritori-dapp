import {
  isDeliverTxFailure,
  MsgWithdrawDelegatorRewardEncodeObject,
} from "@cosmjs/stargate";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { useFeedbacks } from "../context/FeedbacksProvider";
import { getNetwork } from "../networks";
import { getKeplrOfflineSigner } from "../utils/keplr";
import {
  CosmosRewardsResponse,
  getTeritoriSigningStargateClient,
} from "../utils/teritori";
import { CoingeckoCoin, useCoingeckoPrices } from "./useCoingeckoPrices";
import { useErrorHandler } from "./useErrorHandler";
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
  const { setToastSuccess, setToastError } = useFeedbacks();
  const { triggerError } = useErrorHandler();

  const claimAllRewards = async (callback?: () => void) => {
    try {
      if (!walletAddress) return;
      const signer = await getKeplrOfflineSigner();
      const client = await getTeritoriSigningStargateClient(signer);

      const msgs: MsgWithdrawDelegatorRewardEncodeObject[] = [];
      networkRewards.rewards.forEach((rew) => {
        if (!rew.reward.length) return;
        msgs.push({
          typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
          value: {
            delegatorAddress: walletAddress,
            validatorAddress: rew.validator_address,
          },
        });
      });
      if (!msgs.length) return;
      const txResponse = await client.signAndBroadcast(
        walletAddress,
        msgs,
        "auto"
      );
      if (isDeliverTxFailure(txResponse)) {
        callback && callback();
        console.error("tx failed", txResponse);
        setToastError({
          title: "Transaction failed",
          message: txResponse.rawLog || "",
        });
        return;
      }
      setToastSuccess({ title: "Claim success", message: "" });
    } catch (error) {
      triggerError({ title: "Claim failed!", error, callback });
    }
  };

  const claimReward = async (
    validatorAddress: string,
    callback?: () => void
  ) => {
    try {
      if (!walletAddress) return;
      const signer = await getKeplrOfflineSigner();
      const client = await getTeritoriSigningStargateClient(signer);
      const msg: MsgWithdrawDelegatorRewardEncodeObject = {
        typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
        value: {
          delegatorAddress: walletAddress,
          validatorAddress,
        },
      };
      const txResponse = await client.signAndBroadcast(
        walletAddress,
        [msg],
        "auto"
      );
      if (isDeliverTxFailure(txResponse)) {
        callback && callback();
        console.error("tx failed", txResponse);
        setToastError({
          title: "Transaction failed",
          message: txResponse.rawLog || "",
        });
        return;
      }
      setToastSuccess({ title: "Claim success", message: "" });
    } catch (error) {
      triggerError({ title: "Claim failed!", error, callback });
    }
  };

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
  const denoms: string[] = useMemo(() => {
    const memoDenoms: string[] = [];
    networkRewards.rewards.forEach((rew) => {
      rew.reward.forEach((r) => {
        let neverAdded = false;
        memoDenoms.forEach((d) => {
          if (d === r.denom) neverAdded = true;
        });
        if (!neverAdded) memoDenoms.push(r.denom);
      });
    });
    return memoDenoms;
  }, [networkId, networkRewards.rewards]);

  // ---- Get all prices for these denoms
  const coins: CoingeckoCoin[] = useMemo(() => {
    const memoCoins: CoingeckoCoin[] = [];
    denoms.forEach((denom) => {
      memoCoins.push({
        networkId,
        denom,
      });
    });
    return memoCoins;
  }, [networkId, denoms]);

  const { prices, getCoingeckoPrice } = useCoingeckoPrices(coins);

  // ========= Handle rewards per validator
  const rewards: Reward[] = useMemo(() => {
    const memoRewards: Reward[] = [];
    networkRewards.rewards.forEach((rew) => {
      rew.reward.forEach((r) => {
        const price = getCoingeckoPrice(networkId, r.denom, r.amount, prices);
        if (price) {
          const finalReward: Reward = {
            validator: rew.validator_address,
            denom: r.denom,
            amount: r.amount,
            price: price || 0,
          };
          memoRewards.push(finalReward);
        }
      });
    });
    return memoRewards;
  }, [networkId, networkRewards.rewards, prices]);

  // ========= Handle the rewards total
  const totalsRewards: TotalRewards[] = useMemo(() => {
    const memoTotalsRewards: TotalRewards[] = [];
    networkRewards.total.forEach((t) => {
      const price = getCoingeckoPrice(networkId, t.denom, t.amount, prices);
      if (price) {
        const finalTotal: TotalRewards = {
          denom: t.denom,
          amount: t.amount,
          price: price || 0,
        };
        memoTotalsRewards.push(finalTotal);
      }
    });
    return memoTotalsRewards;
  }, [networkId, networkRewards.total, prices]);

  return { totalsRewards, rewards, claimReward, claimAllRewards };
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
export const rewardsPrice = (rewards: (TotalRewards | Reward)[]) => {
  return rewards.reduce((accumulatedPrice, rewards) => {
    return accumulatedPrice + rewards.price;
  }, 0);
};
