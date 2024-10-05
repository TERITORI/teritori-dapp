import keccak256 from "keccak256"; // Tested and this lib is compatible with merkle tree libs from Rust and Go
import { MerkleTree } from "merkletreejs";
import { useCallback } from "react";
import { useSelector } from "react-redux";

import { useFeedbacks } from "@/context/FeedbacksProvider";
import {
  Collection,
  MintPeriod,
  NftLaunchpadClient,
  WhitelistInfo,
} from "@/contracts-clients/nft-launchpad";
import { useCompleteCollection } from "@/hooks/launchpad/useCompleteCollection";
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
} from "@/utils/types/launchpad";

export const useCreateCollection = () => {
  // Since the Collection network is the selected network, we use useSelectedNetworkId (See LaunchpadBasic.tsx)
  const selectedNetworkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const { setToast } = useFeedbacks();
  const userIPFSKey = useSelector(selectNFTStorageAPI);
  const { pinataPinFileToIPFS, uploadFilesToPinata } = useIpfs();
  const { completeCollection } = useCompleteCollection();

  const createCollection = useCallback(
    async (collectionFormValues: CollectionFormValues) => {
      if (!selectedWallet) return;
      const userId = selectedWallet.userId;
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
      const pinataJWTKey = collectionFormValues.assetsMetadatas?.nftApiKey || (await generateIpfsKey(selectedNetworkId, userId));
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
        // ========== Cover image
        const pinFileToIPFSResult = await pinataPinFileToIPFS({
          pinataJWTKey,
          file: collectionFormValues.coverImage,
        } as PinataFileProps);

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
        const mint_periods: MintPeriod[] = collectionFormValues.mintPeriods.map(
          (mintPeriod: CollectionMintPeriodFormValues, index) => {
            let whitelist_info: WhitelistInfo | null = null;
            if (
              mintPeriod.whitelistAddresses?.length &&
              remoteWhitelistAddressesFiles[index].url
            ) {
              const addresses: string[] = mintPeriod.whitelistAddresses;
              const leaves = addresses.map(keccak256);
              const tree = new MerkleTree(leaves, keccak256);
              const merkleRoot = tree.getRoot().toString("hex");
              whitelist_info = {
                addresses_count: addresses.length,
                addresses_ipfs: remoteWhitelistAddressesFiles[index].url,
                addresses_merkle_root: merkleRoot,
              };
            }
            return {
              price: mintPeriod.price,
              end_time: mintPeriod.endTime,
              max_tokens: mintPeriod.maxTokens
                ? parseInt(mintPeriod.maxTokens, 10)
                : 0,
              limit_per_address: mintPeriod.perAddressLimit
                ? parseInt(mintPeriod.perAddressLimit, 10)
                : 0,
              start_time: mintPeriod.startTime,
              whitelist_info,
            };
          },
        );

        // ========== Final collection
        const collection: Collection = {
          name: collectionFormValues.name || "",
          desc: collectionFormValues.description || "",
          symbol: collectionFormValues.symbol || "",
          // external_link: collectionFormValues.externalLink || "",
          website_link: collectionFormValues.websiteLink || "",
          // twitter_profile: collectionFormValues.twitterProfileUrl || "",
          // twitter_followers_count: collectionFormValues.nbTwitterFollowers
          //   ? parseInt(collectionFormValues.nbTwitterFollowers, 10)
          //   : 0,
          // contact_discord_name: collectionFormValues.discordName || "",
          contact_email: collectionFormValues.email || "",
          project_type: collectionFormValues.projectTypes?.join() || "",
          project_desc: collectionFormValues.projectDescription || "",
          tokens_count: collectionFormValues.tokensCount
            ? parseInt(collectionFormValues.tokensCount, 10)
            : 0,
          reveal_time: collectionFormValues.revealTime,
          team_desc: collectionFormValues.teamDescription || "",
          // team_link: collectionFormValues.teamLink || "",
          partners: collectionFormValues.partnersDescription || "",
          investment_desc: collectionFormValues.investDescription || "",
          investment_link: collectionFormValues.investLink || "",
          // roadmap_link: collectionFormValues.roadmapLink || "",
          artwork_desc: collectionFormValues.artworkDescription || "",
          expected_supply: collectionFormValues.expectedSupply
            ? parseInt(collectionFormValues.expectedSupply, 10)
            : 0,
          expected_public_mint_price:
            collectionFormValues.expectedPublicMintPrice
              ? parseInt(collectionFormValues.expectedPublicMintPrice, 10)
              : 0,
          expected_mint_date: collectionFormValues.expectedMintDate,

          cover_img_uri: pinFileToIPFSResult?.ipfsCid || "",
          is_applied_previously:
            collectionFormValues.isPreviouslyApplied || false,
          is_project_derivative:
            collectionFormValues.isDerivativeProject || false,
          is_ready_for_mint: collectionFormValues.isReadyForMint || false,
          is_dox: collectionFormValues.isDox || false,
          escrow_mint_proceeds_period:
            collectionFormValues.escrowMintProceedsPeriod
              ? parseInt(collectionFormValues.escrowMintProceedsPeriod, 10)
              : 0,
          dao_whitelist_count: collectionFormValues.daoWhitelistCount
            ? parseInt(collectionFormValues.daoWhitelistCount, 10)
            : 0,

          mint_periods,

          royalty_address: collectionFormValues.royaltyAddress || "",
          royalty_percentage: collectionFormValues.royaltyPercentage
            ? parseInt(collectionFormValues.royaltyPercentage, 10)
            : 0,

          target_network: selectedNetworkId,
          // deployed_address: "None",
          // whitepaper_link: "None",
          base_token_uri: "None",
        };
        const collectionId = collectionFormValues.symbol;

        // ========== Submit the collection through the contract
        const submitCollectionResult =
          await nftLaunchpadContractClient.submitCollection({
            collection,
          });

        // ========== Handle assets metadata
        const assetsMetadataFormsValues:
          | CollectionAssetsMetadatasFormValues
          | undefined = collectionFormValues.assetsMetadatas;

        if (!assetsMetadataFormsValues?.assetsMetadatas?.length) {
          setToast({
            mode: "normal",
            type: "success",
            title: "Project submitted (Incomplete)",
            message: "You will need to add Assets & Metadata",
          });
        } 
        else {
          await completeCollection(
            collectionId,
            assetsMetadataFormsValues,
          );
          
          setToast({
            mode: "normal",
            type: "success",
            title: "Project submitted",
          });
        }

        return { submitCollectionResult };
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
    [
      pinataPinFileToIPFS,
      selectedWallet,
      userIPFSKey,
      uploadFilesToPinata,
      selectedNetworkId,
      setToast,
      completeCollection,
    ],
  );

  return {
    createCollection,
  };
};
