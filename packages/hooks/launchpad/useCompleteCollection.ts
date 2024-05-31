import { useCallback } from "react";
import { useSelector } from "react-redux";

import { Metadata } from "@/api/launchpad/v1/launchpad";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { NftLaunchpadClient } from "@/contracts-clients/nft-launchpad";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { getNetworkFeature, NetworkFeature } from "@/networks";
import { getKeplrSigningCosmWasmClient } from "@/networks/signer";
import { selectNFTStorageAPI } from "@/store/slices/settings";
import { mustGetLaunchpadClient } from "@/utils/backend";
import { generateIpfsKey } from "@/utils/ipfs";
import { CollectionAssetsMetadataFormValues } from "@/utils/types/launchpad";

export const useCompleteCollection = () => {
  const selectedNetworkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const { setToast } = useFeedbacks();
  const userIPFSKey = useSelector(selectNFTStorageAPI);

  const completeCollection = useCallback(
    async (
      collectionId: string,
      assetsMetadataFormsValues: CollectionAssetsMetadataFormValues[],
    ) => {
      if (!selectedWallet) return;
      const userId = selectedWallet.userId;
      const walletAddress = selectedWallet.address;
      const networkId = selectedWallet.networkId;

      const signingComswasmClient =
        await getKeplrSigningCosmWasmClient(selectedNetworkId);
      const cosmwasmLaunchpadFeature = getNetworkFeature(
        selectedNetworkId,
        NetworkFeature.NFTLaunchpad,
      );
      if (!cosmwasmLaunchpadFeature) return;

      const launchpadBackendClient = mustGetLaunchpadClient(networkId);

      const nftLaunchpadContractClient = new NftLaunchpadClient(
        signingComswasmClient,
        walletAddress,
        cosmwasmLaunchpadFeature.launchpadContractAddress,
      );
      const pinataJWTKey =
        userIPFSKey || (await generateIpfsKey(selectedNetworkId, userId));
      if (!pinataJWTKey) {
        console.error("upload file err : No Pinata JWT");
        setToast({
          mode: "normal",
          type: "error",
          title: "Files upload failed",
        });
        return;
      }

      try {
        const metadatas: Metadata[] = [];
        if (assetsMetadataFormsValues.length) {
          assetsMetadataFormsValues.forEach((assetMetadata) => {
            metadatas.push({
              // image: "", //TODO: Why string ?
              // imageData: "", //TODO: What is this ?
              externalUrl: assetMetadata.externalUrl,
              description: assetMetadata.description,
              name: assetMetadata.name,
              youtubeUrl: assetMetadata.youtubeUrl,
              attributes: [],
              backgroundColor: "",
              animationUrl: "",
              royaltyPercentage: 5,
              royaltyPaymentAddress: "",
            });
          });
        }
        // ========== Send Metadata of this collection to the backend
        const { merkleRoot } = await launchpadBackendClient.UploadMetadatas({
          sender: walletAddress,
          projectId: collectionId,
          pinataJwt: pinataJWTKey,
          networkId: selectedNetworkId,
          metadatas,
        });

        // ========== Provide the merkle root through the contract
        await nftLaunchpadContractClient.updateMerkleRoot({
          collectionId,
          merkleRoot,
        });
      } catch (e: any) {
        console.error("Error creating a NFT Collection in the Launchpad: ", e);
        setToast({
          mode: "normal",
          type: "error",
          title: "Error creating a NFT Collection in the Launchpad",
          message: e.message,
        });
      }
    },
    [selectedNetworkId, selectedWallet, setToast, userIPFSKey],
  );

  return { completeCollection };
};
