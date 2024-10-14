import { useCallback } from "react";

import { useFeedbacks } from "@/context/FeedbacksProvider";
import { NftLaunchpadClient } from "@/contracts-clients/nft-launchpad";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { getNetworkFeature, NetworkFeature } from "@/networks";
import { getKeplrSigningCosmWasmClient } from "@/networks/signer";

export const useDeployCollection = () => {
  const selectedNetworkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const { setToast } = useFeedbacks();

  const deployCollection = useCallback(
    async (
      collectionId: string,
    ) => {
      if (!selectedWallet) return;
      const walletAddress = selectedWallet.address;

      const signingComswasmClient =
        await getKeplrSigningCosmWasmClient(selectedNetworkId);
      const cosmwasmLaunchpadFeature = getNetworkFeature(
        selectedNetworkId,
        NetworkFeature.NFTLaunchpad,
      );
      if (!cosmwasmLaunchpadFeature) return;

      const nftLaunchpadContractClient = new NftLaunchpadClient(
        signingComswasmClient,
        walletAddress,
        cosmwasmLaunchpadFeature.launchpadContractAddress,
      );

      try {
        await nftLaunchpadContractClient.deployCollection({
          collectionId,
        });

        setToast({
          mode: "normal",
          type: "success",
          title: "Collection deployed",
        });
      } catch (e: any) {
        console.error(
          "Error deploying a NFT Collection in the Launchpad: ",
          e,
        );
        setToast({
          mode: "normal",
          type: "error",
          title: "Error deploying a NFT Collection in the Launchpad",
          message: e.message,
        });
      }
    },
    [
      selectedNetworkId,
      selectedWallet,
      setToast,
    ],
  );

  return { deployCollection };
};
