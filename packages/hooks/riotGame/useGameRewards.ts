import { useEffect, useState } from "react";

import { useFeedbacks } from "../../context/FeedbacksProvider";
import {
  TeritoriDistributorClient,
  TeritoriDistributorQueryClient,
} from "../../contracts-clients/teritori-distributor/TeritoriDistributor.client";
import { TERITORI_DISTRIBUTOR_CONTRACT_ADDRESS } from "../../screens/RiotGame/settings";
import {
  getNonSigningCosmWasmClient,
  getSigningCosmWasmClient,
} from "../../utils/keplr";
import useSelectedWallet from "../useSelectedWallet";

export const useGameRewards = () => {
  const selectedWallet = useSelectedWallet();
  const { setToastSuccess, setToastError } = useFeedbacks();
  const [claimableAmount, setClaimableAmount] = useState(0);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    if (!selectedWallet?.address) return;
    const effect = async () => {
      const claimableAmount = await fetchClaimableAmount(
        selectedWallet.address
      );
      setClaimableAmount(+claimableAmount);
    };
    effect();
  }, [selectedWallet?.address]);

  const claimRewards = async (user: string) => {
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
      setClaimableAmount(0);
    } catch (e: any) {
      setToastError({ title: "Error", message: e.message });
    } finally {
      setIsClaiming(false);
    }
  };

  const fetchClaimableAmount = async (user: string) => {
    const nonSigningClient = await getNonSigningCosmWasmClient();
    const distributorQueryClient = new TeritoriDistributorQueryClient(
      nonSigningClient,
      TERITORI_DISTRIBUTOR_CONTRACT_ADDRESS
    );
    return await distributorQueryClient.userClaimable({
      addr: user,
    });
  };

  return { isClaiming, claimableAmount, claimRewards };
};
