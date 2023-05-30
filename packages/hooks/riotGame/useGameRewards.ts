import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { useFeedbacks } from "../../context/FeedbacksProvider";
import {
  TeritoriDistributorClient,
  TeritoriDistributorQueryClient,
} from "../../contracts-clients/teritori-distributor/TeritoriDistributor.client";
import {
  mustGetNonSigningCosmWasmClient,
  NetworkKind,
  parseUserId,
} from "../../networks";
import useSelectedWallet from "../useSelectedWallet";
import { useWalletCosmWasmClient } from "../wallets/useWalletClients";

export const useGameRewards = () => {
  const selectedWallet = useSelectedWallet();
  const userId = selectedWallet?.userId;
  const { setToastSuccess, setToastError } = useFeedbacks();
  const [isClaiming, setIsClaiming] = useState(false);
  const getSigningCosmWasmClient = useWalletCosmWasmClient(selectedWallet?.id);

  const { data } = useQuery(
    ["claimableAmount", userId],
    async () => {
      const [network, userAddress] = parseUserId(userId);
      if (
        network?.kind !== NetworkKind.Cosmos ||
        !network.distributorContractAddress ||
        !userAddress
      ) {
        return "0";
      }

      const nonSigningClient = await mustGetNonSigningCosmWasmClient(
        network.id
      );
      const distributorQueryClient = new TeritoriDistributorQueryClient(
        nonSigningClient,
        network.distributorContractAddress
      );
      return await distributorQueryClient.userClaimable({
        addr: userAddress,
      });
    },
    { staleTime: Infinity }
  );
  const claimableAmount = data || 0;

  const claimRewards = useCallback(async () => {
    setIsClaiming(true);
    try {
      const [network, userAddress] = parseUserId(userId);

      if (
        network?.kind !== NetworkKind.Cosmos ||
        !network.distributorContractAddress ||
        !userAddress
      ) {
        throw new Error("invalid user id");
      }

      const distributorClient = new TeritoriDistributorClient(
        await getSigningCosmWasmClient(),
        userAddress,
        network.distributorContractAddress
      );

      await distributorClient.claim();
      setToastSuccess({
        title: "Success",
        message: "Your rewards have been sent to your wallet",
      });
    } catch (e: any) {
      setToastError({ title: "Error", message: e.message });
    } finally {
      setIsClaiming(false);
    }
  }, [getSigningCosmWasmClient, setToastError, setToastSuccess, userId]);

  return { isClaiming, claimableAmount, claimRewards };
};
