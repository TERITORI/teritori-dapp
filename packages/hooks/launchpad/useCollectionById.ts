import { useCallback } from "react";

import { useFeedbacks } from "@/context/FeedbacksProvider";
import { NftLaunchpadClient } from "@/contracts-clients/nft-launchpad";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { getNetworkFeature, NetworkFeature } from "@/networks";
import { getKeplrSigningCosmWasmClient } from "@/networks/signer";

export const useCollectionById = () => {
  const selectedNetworkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const { setToast } = useFeedbacks();

  const getCollectionById = useCallback(
    async (collectionId: string) => {
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
        return await nftLaunchpadContractClient.getCollectionById({
          collectionId,
        });
      } catch (e: any) {
        console.error("Error getting the NFT Collection: ", e);
        setToast({
          mode: "normal",
          type: "error",
          title: "Error getting the NFT Collection",
          message: e.message,
        });
      }
    },
    [selectedNetworkId, selectedWallet, setToast],
  );

  return { getCollectionById };
};
