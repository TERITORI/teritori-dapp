import { useCallback } from "react";
import { useSelector } from "react-redux";
import { MerkleTree } from "merkletreejs";

import {
  Collection,
  NftLaunchpadClient,
  WhitelistMintInfo,
} from "@/contracts-clients/nft-launchpad";
import { PinataFileProps, useIpfs } from "@/hooks/useIpfs";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import {
  getNetworkFeature,
  mustGetCosmosNetwork,
  NetworkFeature,
} from "@/networks";
import { getKeplrSigningCosmWasmClient } from "@/networks/signer";
import { CollectionFormValues } from "@/screens/Launchpad/CreateCollection.type";
import { selectNFTStorageAPI } from "@/store/slices/settings";
import { generateIpfsKey } from "@/utils/ipfs";
import keccak256 from "keccak256";  // Tested and this lib is compatible with merkle tree libs from Rust and Go

export const useCreateCollection = () => {
  const selectedWallet = useSelectedWallet();

  const userIPFSKey = useSelector(selectNFTStorageAPI);
  const { pinataPinFileToIPFS, uploadFilesToPinata } = useIpfs();

  const createCollection = useCallback(
    async (collectionFormValues: CollectionFormValues) => {
      if (!selectedWallet) return;
      const network = mustGetCosmosNetwork(selectedWallet.networkId);
      const signingComswasmClient = await getKeplrSigningCosmWasmClient(
        network.id,
      );
      const cosmwasmLaunchpadFeature = getNetworkFeature(
        network.id,
        NetworkFeature.NFTLaunchpad,
      );
      if (!cosmwasmLaunchpadFeature) return;
      const client = new NftLaunchpadClient(
        signingComswasmClient,
        selectedWallet.address,
        cosmwasmLaunchpadFeature.launchpadContractAddress,
      );
      const pinataJWTKey =
        userIPFSKey ||
        (await generateIpfsKey(network.id, selectedWallet.userId));
      if (!pinataJWTKey) {
        console.error("upload file err : No Pinata JWT");
        // setToastError({
        //   title: "File upload failed",
        //   message: "No Pinata JWT",
        // });
        return;
      }

      try {
        // ========== Upload files to IPFS
        const coverImageIpfsHash = await pinataPinFileToIPFS({
          pinataJWTKey,
          file: collectionFormValues.coverImage,
        } as PinataFileProps);

        // TODO: whitelists addresses IPFS hash
        const remoteWhitelistAddressesFiles = await uploadFilesToPinata({
          pinataJWTKey,
          files: collectionFormValues.whitelistMintInfos.map(
            (whitelist) => whitelist.addressesFile!,
          ),
        });

        // ========== TODO: Generate merkle tree/root/path
        const whitelist_mint_infos: WhitelistMintInfo[] = collectionFormValues.whitelistMintInfos.map((whitelist, index) => {
          const addresses: string[] = [];  // TODO: read uploaded file and get contents
          const leaves = addresses.map(keccak256)
          const tree = new MerkleTree(leaves, keccak256);
          const merkleRoot = tree.getRoot().toString("hex");

          const info: WhitelistMintInfo = {
            addresses_count: addresses.length,
            addresses_ipfs: remoteWhitelistAddressesFiles[index].url,
            denom: "",  // TODO: Get from network package the denom related to selected network
            end_time: whitelist.endTime || 0,
            limit_per_address: whitelist.perAddressLimit || 0,
            merkle_root: merkleRoot,
            start_time: whitelist.startTime || 0,
            unit_price: whitelist.unitPrice || "0",
          }
          return info;
        });

        // ========== Build Collection from forms
        const collection: Collection = {
          name: collectionFormValues.name || "",
          desc: collectionFormValues.description || "",
          symbol: collectionFormValues.symbol || "",
          external_link: collectionFormValues.externalLink || "",
          website_link: collectionFormValues.websiteLink || "",
          twitter_profile: collectionFormValues.twitterProfileUrl || "",
          twitter_followers_count: collectionFormValues.nbTwitterFollowers || 0,
          contact_discord_name: collectionFormValues.discordName || "",
          contact_email: collectionFormValues.email || "",
          project_type: collectionFormValues.projectTypes?.join() || "",
          project_desc: collectionFormValues.projectDescription || "",
          tokens_count: collectionFormValues.nbTokens || 0,
          unit_price: collectionFormValues.unitPrice || "",
          limit_per_address: collectionFormValues.perAddressLimit || 0,
          start_time: 0,
          reveal_time: 0,
          team_desc: collectionFormValues.teamDescription || "",
          team_link: collectionFormValues.teamLink || "",
          partners: collectionFormValues.partnersDescription || "",
          investment_desc: collectionFormValues.investDescription || "",
          investment_link: collectionFormValues.investLink || "",
          roadmap_link: collectionFormValues.roadmapLink || "",
          artwork_desc: collectionFormValues.artworkDescription || "",
          expected_supply: collectionFormValues.expectedSupply || 0,
          expected_public_mint_price:
            collectionFormValues.expectedPublicMintPrice || 0,
          expected_mint_date: collectionFormValues.expectedMintDate || 0,
          // TODO:
          // nftApiKey: collectionFormValues.nftApiKey || "",

          cover_img_uri: coverImageIpfsHash || "",
          is_applied_previously:
            collectionFormValues.isPreviouslyApplied || false,
          is_project_derivative:
            collectionFormValues.isDerivativeProject || false,
          is_ready_for_mint: collectionFormValues.isReadyForMint || false,
          is_dox: collectionFormValues.isDox || false,
          escrow_mint_proceeds_period:
            collectionFormValues.escrowMintProceedsPeriod || 0,
          dao_whitelist_count: collectionFormValues.daoWhitelistCount || 0,

          whitelist_mint_infos,

          royalty_address: collectionFormValues.royaltyAddress || "",
          royalty_percentage: collectionFormValues.royaltyPercentage || 0,

          target_network: network.id,
          denom: cosmwasmLaunchpadFeature.defaultMintDenom,
          deployed_address: "None",
          merkle_root: "None",
          whitepaper_link: "None",
          base_token_uri: "None",
        };

        // ========== Submit the collection
        await client.submitCollection({
          collection,
        });
      } catch (e) {
        // if (e instanceof Error && e.message.includes("Token Name Invalid")) {
        //   return { denom: info.native_denom, amount: "0", invalid: true };
        // }
        // throw e;
        console.log("Error creating a NFT Collection in the Launchpad ", e);
      }
    },
    [pinataPinFileToIPFS, selectedWallet, userIPFSKey, uploadFilesToPinata],
  );

  return {
    createCollection,
  };
};
