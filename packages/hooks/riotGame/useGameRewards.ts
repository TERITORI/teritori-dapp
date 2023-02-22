import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { useFeedbacks } from "../../context/FeedbacksProvider";
import {
  TeritoriDistributorClient,
  TeritoriDistributorQueryClient,
} from "../../contracts-clients/teritori-distributor/TeritoriDistributor.client";
import { TERITORI_DISTRIBUTOR_CONTRACT_ADDRESS } from "../../utils/game";
import {
  getNonSigningCosmWasmClient,
  getSigningCosmWasmClient,
} from "../../utils/keplr";
import useSelectedWallet from "../useSelectedWallet";

export const useGameRewards = () => {
  const selectedWallet = useSelectedWallet();
  const { setToastSuccess, setToastError } = useFeedbacks();
  const [isClaiming, setIsClaiming] = useState(false);

  const { data } = useQuery(
    ["claimableAmount", selectedWallet?.address],
    async () => {
      if (!selectedWallet?.address) return 0;

      const nonSigningClient = await getNonSigningCosmWasmClient();
      const distributorQueryClient = new TeritoriDistributorQueryClient(
        nonSigningClient,
        TERITORI_DISTRIBUTOR_CONTRACT_ADDRESS
      );
      return await distributorQueryClient.userClaimable({
        addr: selectedWallet.address,
      });
    },
    { staleTime: Infinity }
  );
  const claimableAmount = data || 0;

  const claimRewards = useCallback(
    async (user: string) => {
      setIsClaiming(true);
      try {
        const signingClient = await getSigningCosmWasmClient();
        const distributorClient = new TeritoriDistributorClient(
          signingClient,
          user,
          TERITORI_DISTRIBUTOR_CONTRACT_ADDRESS
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
    },
    [setToastError, setToastSuccess]
  );

  return { isClaiming, claimableAmount, claimRewards };
};
