import keccak256 from "keccak256"; // Tested and this lib is compatible with merkle tree libs from Rust and Go
import { MerkleTree } from "merkletreejs";
import { useCallback } from "react";
import { useSelector } from "react-redux";

import {
  Metadata,
  UpdateTokensMetadatasResponse,
} from "@/api/launchpad/v1/launchpad";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import {
  Collection,
  MintPeriod,
  NftLaunchpadClient,
} from "@/contracts-clients/nft-launchpad";
import { PinataFileProps, useIpfs } from "@/hooks/useIpfs";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { getNetworkFeature, NetworkFeature } from "@/networks";
import { getKeplrSigningCosmWasmClient } from "@/networks/signer";
import { selectNFTStorageAPI } from "@/store/slices/settings";
import { mustGetLauchpadClient } from "@/utils/backend";
import { generateIpfsKey } from "@/utils/ipfs";
import { CollectionFormValues } from "@/utils/types/launchpad";

export const useCreateCollection = () => {
  // Since the Collection network is the selected network, we use useSelectedNetworkId (See LaunchpadBasic.tsx)
  const selectedNetworkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const { setToast } = useFeedbacks();
  const userIPFSKey = useSelector(selectNFTStorageAPI);
  const { pinataPinFileToIPFS, uploadFilesToPinata } = useIpfs();

  const createCollection = useCallback(
    async (collectionFormValues: CollectionFormValues) => {
      if (!selectedWallet) return;
      const signingComswasmClient =
        await getKeplrSigningCosmWasmClient(selectedNetworkId);
      const cosmwasmLaunchpadFeature = getNetworkFeature(
        selectedNetworkId,
        NetworkFeature.NFTLaunchpad,
      );
      if (!cosmwasmLaunchpadFeature) return;
      // const defaultMintDenom = cosmwasmLaunchpadFeature.defaultMintDenom;

      const launchpadClient = mustGetLauchpadClient(selectedWallet.networkId);

      const nftLaunchpadClient = new NftLaunchpadClient(
        signingComswasmClient,
        selectedWallet.address,
        cosmwasmLaunchpadFeature.launchpadContractAddress,
      );
      const pinataJWTKey =
        userIPFSKey ||
        (await generateIpfsKey(selectedNetworkId, selectedWallet.userId));
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
        const coverImageIpfsHash = await pinataPinFileToIPFS({
          pinataJWTKey,
          file: collectionFormValues.coverImage,
        } as PinataFileProps);

        // ========== Whitelists
        const remoteWhitelistAddressesFiles = await uploadFilesToPinata({
          pinataJWTKey,
          files: collectionFormValues.mintPeriods.map(
            (mintPeriod) => mintPeriod.whitelistAddressesFile!,
          ),
        });
        const mint_periods: MintPeriod[] = collectionFormValues.mintPeriods.map(
          (whitelist, index) => {
            const addresses: string[] = whitelist.whitelistAddresses || [];
            const leaves = addresses.map(keccak256);
            const tree = new MerkleTree(leaves, keccak256);
            const merkleRoot = tree.getRoot().toString("hex");

            const mintPeriod: MintPeriod = {
              price: whitelist.price,
              end_time: whitelist.endTime ? parseInt(whitelist.endTime, 10) : 0,
              max_tokens: whitelist.maxTokens
                ? parseInt(whitelist.maxTokens, 10)
                : 0,
              limit_per_address: whitelist.perAddressLimit
                ? parseInt(whitelist.perAddressLimit, 10)
                : 0,
              start_time: whitelist.startTime
                ? parseInt(whitelist.startTime, 10)
                : 0,
              whitelist_info: {
                addresses_count: addresses.length,
                addresses_ipfs: remoteWhitelistAddressesFiles[index].url,
                addresses_merkle_root: merkleRoot,
              },
            };
            return mintPeriod;
          },
        );

        // ========== Metadata
        const metadatas: Metadata[] = collectionFormValues.assetsMetadatas.map(
          (metadata) => {
            return {
              image: "", //TODO:
              imageData: "",
              externalUrl: metadata.externalUrl,
              description: metadata.description,
              name: metadata.name,
              youtubeUrl: metadata.youtubeUrl,
              attributes: [],
              backgroundColor: "",
              animationUrl: "",
              royaltyPercentage: 5,
              royaltyPaymentAddress: "",
            };
          },
        );
        const { merkleRoot }: UpdateTokensMetadatasResponse =
          await launchpadClient.UpdateTokensMetadatas({
            sender: selectedWallet.address,
            projectId: 1, //TODO:
            networkId: selectedNetworkId,
            metadatas,
          });

        // ========== Final collection
        const collection: Collection = {
          name: collectionFormValues.name || "",
          desc: collectionFormValues.description || "",
          symbol: collectionFormValues.symbol || "",
          external_link: collectionFormValues.externalLink || "",
          website_link: collectionFormValues.websiteLink || "",
          twitter_profile: collectionFormValues.twitterProfileUrl || "",
          twitter_followers_count: collectionFormValues.nbTwitterFollowers
            ? parseInt(collectionFormValues.nbTwitterFollowers, 10)
            : 0,
          contact_discord_name: collectionFormValues.discordName || "",
          contact_email: collectionFormValues.email || "",
          project_type: collectionFormValues.projectTypes?.join() || "",
          project_desc: collectionFormValues.projectDescription || "",
          tokens_count: collectionFormValues.tokensCount
            ? parseInt(collectionFormValues.tokensCount, 10)
            : 0,
          reveal_time: collectionFormValues.revealTime
            ? parseInt(collectionFormValues.revealTime, 10)
            : 0,
          team_desc: collectionFormValues.teamDescription || "",
          team_link: collectionFormValues.teamLink || "",
          partners: collectionFormValues.partnersDescription || "",
          investment_desc: collectionFormValues.investDescription || "",
          investment_link: collectionFormValues.investLink || "",
          roadmap_link: collectionFormValues.roadmapLink || "",
          artwork_desc: collectionFormValues.artworkDescription || "",
          expected_supply: collectionFormValues.expectedSupply
            ? parseInt(collectionFormValues.expectedSupply, 10)
            : 0,
          expected_public_mint_price:
            collectionFormValues.expectedPublicMintPrice
              ? parseInt(collectionFormValues.expectedPublicMintPrice, 10)
              : 0,
          expected_mint_date: collectionFormValues.expectedMintDate
            ? parseInt(collectionFormValues.expectedMintDate, 10)
            : 0,

          cover_img_uri: coverImageIpfsHash || "",
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
          metadatas_merkle_root: merkleRoot,

          royalty_address: collectionFormValues.royaltyAddress || "",
          royalty_percentage: collectionFormValues.royaltyPercentage
            ? parseInt(collectionFormValues.royaltyPercentage, 10)
            : 0,

          target_network: selectedNetworkId,
          deployed_address: "None",
          whitepaper_link: "None",
          base_token_uri: "None",
        };

        // ========== Submit the collection
        const result = await nftLaunchpadClient.submitCollection({
          collection,
        });
        console.log("======== createCollection result", result);
        return result;
      } catch (e) {
        console.error("Error creating a NFT Collection in the Launchpad ", e);
        setToast({
          mode: "normal",
          type: "error",
          title: "Error creating a NFT Collection in the Launchpad",
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
    ],
  );

  return {
    createCollection,
  };
};
