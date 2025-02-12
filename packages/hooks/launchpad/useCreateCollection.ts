import keccak256 from "keccak256"; // Tested and this lib is compatible with merkle tree libs from Rust and Go
import { MerkleTree } from "merkletreejs";
import { useCallback } from "react";
import { useSelector } from "react-redux";

import { useFeedbacks } from "@/context/FeedbacksProvider";
import {
  Coin,
  MintPeriod,
  NftLaunchpadClient,
  WhitelistInfo,
} from "@/contracts-clients/nft-launchpad";
import { PinataFileProps, useIpfs } from "@/hooks/useIpfs";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { getNetworkFeature, NetworkFeature } from "@/networks";
import { getKeplrSigningCosmWasmClient } from "@/networks/signer";
import { selectNFTStorageAPI } from "@/store/slices/settings";
import { generateIpfsKey } from "@/utils/ipfs";
import { LocalFileData } from "@/utils/types/files";
import {
  CollectionAssetsMetadatasFormValues,
  CollectionFormValues,
  CollectionMintPeriodFormValues,
  CollectionToSubmit,
} from "@/utils/types/launchpad";

export const useCreateCollection = () => {
  // Since the Collection network is the selected network, we use useSelectedNetworkId (See LaunchpadBasic.tsx)
  const selectedNetworkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const { setToast } = useFeedbacks();
  const userIPFSKey = useSelector(selectNFTStorageAPI);
  const { pinataPinFileToIPFS, uploadFilesToPinata } = useIpfs();

  // TODO: Uncomment when the NFT Launchpad MyCollections frontend and useCompleteCollection are merged
  // const { completeCollection } = useCompleteCollection();

  const createCollection = useCallback(
    async (collectionFormValues: CollectionFormValues) => {
      if (!selectedWallet) return false;
      const userId = selectedWallet.userId;
      const walletAddress = selectedWallet.address;

      try {
        const signingComswasmClient =
          await getKeplrSigningCosmWasmClient(selectedNetworkId);
        const cosmwasmNftLaunchpadFeature = getNetworkFeature(
          selectedNetworkId,
          NetworkFeature.CosmWasmNFTLaunchpad,
        );
        if (!cosmwasmNftLaunchpadFeature) return false;

        const nftLaunchpadContractClient = new NftLaunchpadClient(
          signingComswasmClient,
          walletAddress,
          cosmwasmNftLaunchpadFeature.launchpadContractAddress,
        );
        const pinataJWTKey =
          collectionFormValues.assetsMetadatas?.nftApiKey ||
          userIPFSKey ||
          (await generateIpfsKey(selectedNetworkId, userId));
        if (!pinataJWTKey) {
          throw new Error("No Pinata JWT");
        }

        // ========== Cover image
        const fileIpfsHash = await pinataPinFileToIPFS({
          pinataJWTKey,
          file: collectionFormValues.coverImage,
        } as PinataFileProps);
        if (!fileIpfsHash) {
          throw new Error("Pin to Pinata failed");
        }

        // ========== Whitelists
        const whitelistAddressesFilesToUpload: LocalFileData[] = [];
        collectionFormValues.mintPeriods.forEach((mintPeriod) => {
          if (mintPeriod.whitelistAddressesFile)
            whitelistAddressesFilesToUpload.push(
              mintPeriod.whitelistAddressesFile,
            );
        });
        const remoteWhitelistAddressesFiles = await uploadFilesToPinata({
          pinataJWTKey,
          files: whitelistAddressesFilesToUpload,
        });
        const mintPeriods: MintPeriod[] = collectionFormValues.mintPeriods.map(
          (mintPeriod: CollectionMintPeriodFormValues, index) => {
            let whitelistInfo: WhitelistInfo | null = null;
            if (
              mintPeriod.whitelistAddresses?.length &&
              remoteWhitelistAddressesFiles[index].url
            ) {
              const addresses: string[] = mintPeriod.whitelistAddresses;
              const leaves = addresses.map(keccak256);
              const tree = new MerkleTree(leaves, keccak256);
              const merkleRoot = tree.getRoot().toString("hex");
              whitelistInfo = {
                addresses_count: addresses.length,
                addresses_ipfs: remoteWhitelistAddressesFiles[index].url,
                addresses_merkle_root: merkleRoot,
              };
            }
            const price: Coin | null = mintPeriod.price
              ? {
                  amount: mintPeriod.price.amount || "0",
                  denom: mintPeriod.price.denom,
                }
              : null;
            return {
              price,
              end_time: mintPeriod.endTime,
              max_tokens: mintPeriod.maxTokens
                ? parseInt(mintPeriod.maxTokens, 10)
                : 0,
              limit_per_address: mintPeriod.perAddressLimit
                ? parseInt(mintPeriod.perAddressLimit, 10)
                : 0,
              start_time: mintPeriod.startTime,
              whitelist_info: whitelistInfo,
            };
          },
        );

        const assetsMetadataFormsValues:
          | CollectionAssetsMetadatasFormValues
          | undefined
          | null = collectionFormValues.assetsMetadatas;

        // ========== Final collection
        const collection: CollectionToSubmit = {
          name: collectionFormValues.name,
          desc: collectionFormValues.description,
          symbol: collectionFormValues.symbol,
          website_link: collectionFormValues.websiteLink,
          contact_email: collectionFormValues.email,
          project_type: collectionFormValues.projectTypes.join(),
          tokens_count: assetsMetadataFormsValues?.assetsMetadatas?.length || 0,
          reveal_time: collectionFormValues.revealTime,
          team_desc: collectionFormValues.teamDescription,
          partners: collectionFormValues.partnersDescription,
          investment_desc: collectionFormValues.investDescription,
          investment_link: collectionFormValues.investLink,
          artwork_desc: collectionFormValues.artworkDescription,
          cover_img_uri: "ipfs://" + fileIpfsHash,
          mint_periods: mintPeriods,
          royalty_address: collectionFormValues.royaltyAddress,
          royalty_percentage: collectionFormValues.royaltyPercentage
            ? parseInt(collectionFormValues.royaltyPercentage, 10)
            : null,
          target_network: selectedNetworkId,
        };
        // TODO: Uncomment when the NFT Launchpad MyCollections frontend and useCompleteCollection are merged
        // const collectionId = collectionFormValues.symbol;

        // ========== Submit the collection through the contract
        await nftLaunchpadContractClient.submitCollection({
          collection,
        });

        // ========== Handle assets metadata
        if (!assetsMetadataFormsValues?.assetsMetadatas?.length) {
          setToast({
            mode: "normal",
            type: "success",
            title: "Project submitted (Incomplete)",
            message: "You will need to Complete the Project",
          });
        } else {
          const isCompleteSuccess = false;
          // TODO: Uncomment when the NFT Launchpad MyCollections frontend and useCompleteCollection are merged
          //   await completeCollection(
          //   collectionId,
          //   assetsMetadataFormsValues,
          // );

          if (!isCompleteSuccess) {
            setToast({
              mode: "normal",
              type: "warning",
              title: "Project submitted (Incomplete)",
              message:
                "Error during uploading the Assets.\nYou will need to Complete the Project",
            });
          } else {
            setToast({
              mode: "normal",
              type: "success",
              title: "Project submitted",
            });
          }
        }

        return true;
      } catch (e: any) {
        console.error("Error creating a NFT Collection in the Launchpad: ", e);
        setToast({
          mode: "normal",
          type: "error",
          title: "Error creating a NFT Collection in the Launchpad",
          message: e.message,
        });
        return false;
      }
    },
    [
      pinataPinFileToIPFS,
      selectedWallet,
      userIPFSKey,
      uploadFilesToPinata,
      selectedNetworkId,
      setToast,
      // TODO: Uncomment when the NFT Launchpad MyCollections frontend and useCompleteCollection are merged
      // completeCollection,
    ],
  );

  return {
    createCollection,
  };
};
