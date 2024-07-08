import { useQuery } from "@tanstack/react-query";

import { useFeedbacks } from "@/context/FeedbacksProvider";
import {
  Collection,
  NftLaunchpadClient,
} from "@/contracts-clients/nft-launchpad";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { getNetworkFeature, NetworkFeature } from "@/networks";
import { getKeplrSigningCosmWasmClient } from "@/networks/signer";

export const useCollectionById = ({
  collectionId,
}: {
  collectionId: string;
}) => {
  const selectedNetworkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const { setToast } = useFeedbacks();

  return useQuery(
    ["launchpadCollectionById", collectionId, selectedNetworkId],
    async () => {
      let collection: Collection | undefined;

      try {
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
        collection = await nftLaunchpadContractClient.getCollectionById({
          collectionId,
        });
      } catch (e: any) {
        console.error("Error getting launchpad NFT Collection: ", e);
        setToast({
          mode: "normal",
          type: "error",
          title: "Error getting launchpad NFT Collection",
          message: e.message,
        });
      }
      return collection;
    },
  );
};
