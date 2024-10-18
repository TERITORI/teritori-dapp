import { useCallback } from "react";
import { useSelector } from "react-redux";

import { Metadata, Trait } from "@/api/launchpad/v1/launchpad";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { NftLaunchpadClient } from "@/contracts-clients/nft-launchpad";
import { useIpfs } from "@/hooks/useIpfs";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { getNetworkFeature, NetworkFeature } from "@/networks";
import { getKeplrSigningCosmWasmClient } from "@/networks/signer";
import { selectNFTStorageAPI } from "@/store/slices/settings";
import { mustGetLaunchpadClient } from "@/utils/backend";
import { generateIpfsKey, isIpfsPathValid } from "@/utils/ipfs";
import { LocalFileData, RemoteFileData } from "@/utils/types/files";
import { CollectionAssetsMetadatasFormValues } from "@/utils/types/launchpad";

export const useCompleteCollection = () => {
  const selectedNetworkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const { setToast } = useFeedbacks();
  const userIPFSKey = useSelector(selectNFTStorageAPI);
  const { uploadFilesToPinata } = useIpfs();

  const completeCollection = useCallback(
    async (
      collectionId: string,
      assetsMetadatasFormsValues: CollectionAssetsMetadatasFormValues,
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
        assetsMetadatasFormsValues.nftApiKey ||
        userIPFSKey ||
        (await generateIpfsKey(selectedNetworkId, userId));
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
        if (!assetsMetadatasFormsValues.assetsMetadatas?.length) return;

        // IMPORTANT TODO:
        // For now, for simplicity, we upload images to ipfs from client side then this backend will
        // only check if images have been pinnned correctly.
        // ===> Please, see go/pkg/launchpad/service.go
        const assetsMetadataImages: LocalFileData[] =
          assetsMetadatasFormsValues.assetsMetadatas.map(
            (assetMetadata) => assetMetadata.image,
          );
        const remoteAssetsMetadataImages: RemoteFileData[] =
          await uploadFilesToPinata({
            files: assetsMetadataImages,
            pinataJWTKey,
          });

        if (!assetsMetadataImages?.length) {
          console.error("Error: Seems to be no image uploaded to IPFS");
          setToast({
            title: "Seems to be no image uploaded to IPFS",
            message: "Please try again",
            type: "error",
            mode: "normal",
          });
          return;
        }

        assetsMetadatasFormsValues.assetsMetadatas.forEach(
          (assetMetadata, index) => {
            const image = remoteAssetsMetadataImages[index];
            if (!isIpfsPathValid(image.url)) {
              setToast({
                title: "At least one uploaded image have an invalid IPFS hash",
                message: "Please try again",
                type: "warning",
                mode: "normal",
              });
              return;
            }
            if (!assetMetadata.attributes.length) return;
            const attributes: Trait[] = assetMetadata.attributes.map(
              (attribute) => {
                return {
                  value: attribute.value,
                  traitType: attribute.type,
                };
              },
            );

            metadatas.push({
              image: image.hash,
              // imageData: "", //TODO: What is this ? Needed ?
              externalUrl: assetMetadata.externalUrl,
              description: assetMetadata.description,
              name: assetMetadata.name,
              youtubeUrl: assetMetadata.youtubeUrl,
              attributes,
              backgroundColor: "",
              animationUrl: "",
              royaltyPercentage: 5,
              royaltyPaymentAddress: "",
            });
          },
        );

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

        setToast({
          mode: "normal",
          type: "success",
          title: "Collection completed",
        });
      } catch (e: any) {
        console.error(
          "Error completing a NFT Collection in the Launchpad: ",
          e,
        );
        setToast({
          mode: "normal",
          type: "error",
          title: "Error completing a NFT Collection in the Launchpad",
          message: e.message,
        });
      }
    },
    [
      selectedNetworkId,
      selectedWallet,
      setToast,
      userIPFSKey,
      uploadFilesToPinata,
    ],
  );

  return { completeCollection };
};
