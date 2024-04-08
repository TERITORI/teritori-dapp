import keccak256 from "keccak256"; // Tested and this lib is compatible with merkle tree libs from Rust and Go
import { MerkleTree } from "merkletreejs";
import { useCallback } from "react";
import { useSelector } from "react-redux";

import {
  Collection,
  MintPeriod,
  NftLaunchpadClient,
} from "@/contracts-clients/nft-launchpad";
import { PinataFileProps, useIpfs } from "@/hooks/useIpfs";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import {
  getNetworkFeature,
  mustGetCosmosNetwork,
  NetworkFeature,
} from "@/networks";
import { getKeplrSigningCosmWasmClient } from "@/networks/signer";
import { selectNFTStorageAPI } from "@/store/slices/settings";
import { generateIpfsKey } from "@/utils/ipfs";
import { CollectionFormValues } from "@/utils/types/launchpad";

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
      const denom = cosmwasmLaunchpadFeature.defaultMintDenom;

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
              denom,
              // TODO: Remove all parseInt(String()) usages, it's just for tests.
              //  We could : Get true numbers (and not strings even if the type is number), or get only strings and parse. First choice is better IMO
              end_time: parseInt(String(whitelist.endTime), 10) || 0,
              max_tokens: parseInt(String(whitelist.maxTokens), 10) || 0,
              limit_per_address:
                parseInt(String(whitelist.perAddressLimit), 10) || 0,
              start_time: parseInt(String(whitelist.startTime), 10) || 0,
              unit_price: whitelist.unitPrice || "0",
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
        //TODO: Upload images on IPFS, fill Metadata form with text
        //TODO: UpdateTokensMetadatas, fill Collection form with merkleRoot

        // ========== Final collection
        const collection: Collection = {
          name: collectionFormValues.name || "",
          desc: collectionFormValues.description || "",
          symbol: collectionFormValues.symbol || "",
          external_link: collectionFormValues.externalLink || "",
          website_link: collectionFormValues.websiteLink || "",
          twitter_profile: collectionFormValues.twitterProfileUrl || "",
          twitter_followers_count:
            parseInt(String(collectionFormValues.nbTwitterFollowers), 10) || 0,
          contact_discord_name: collectionFormValues.discordName || "",
          contact_email: collectionFormValues.email || "",
          project_type: collectionFormValues.projectTypes?.join() || "",
          project_desc: collectionFormValues.projectDescription || "",
          tokens_count:
            parseInt(String(collectionFormValues.tokensCount), 10) || 0,
          reveal_time:
            parseInt(String(collectionFormValues.revealTime), 10) || 0,
          team_desc: collectionFormValues.teamDescription || "",
          team_link: collectionFormValues.teamLink || "",
          partners: collectionFormValues.partnersDescription || "",
          investment_desc: collectionFormValues.investDescription || "",
          investment_link: collectionFormValues.investLink || "",
          roadmap_link: collectionFormValues.roadmapLink || "",
          artwork_desc: collectionFormValues.artworkDescription || "",
          expected_supply:
            parseInt(String(collectionFormValues.expectedSupply), 10) || 0,
          expected_public_mint_price:
            parseInt(
              String(collectionFormValues.expectedPublicMintPrice),
              10,
            ) || 0,
          expected_mint_date:
            parseInt(String(collectionFormValues.expectedMintDate), 10) || 0,

          cover_img_uri: coverImageIpfsHash || "",
          is_applied_previously:
            collectionFormValues.isPreviouslyApplied || false,
          is_project_derivative:
            collectionFormValues.isDerivativeProject || false,
          is_ready_for_mint: collectionFormValues.isReadyForMint || false,
          is_dox: collectionFormValues.isDox || false,
          escrow_mint_proceeds_period:
            parseInt(
              String(collectionFormValues.escrowMintProceedsPeriod),
              10,
            ) || 0,
          dao_whitelist_count:
            parseInt(String(collectionFormValues.daoWhitelistCount), 10) || 0,

          mint_periods,
          metadatas_merkle_root: "TODO",

          royalty_address: collectionFormValues.royaltyAddress || "",
          royalty_percentage:
            parseInt(String(collectionFormValues.royaltyPercentage), 10) || 0,

          target_network: network.id,
          deployed_address: "None",
          whitepaper_link: "None",
          base_token_uri: "None",
        };

        // ========== Submit the collection
        const result = await client.submitCollection({
          collection,
        });
        console.log("======== createCollection result", result);
        return result;
      } catch (e) {
        // if (e instanceof Error && e.message.includes("Token Name Invalid")) {
        //   return { denom: info.native_denom, amount: "0", invalid: true };
        // }
        // throw e;
        console.error("Error creating a NFT Collection in the Launchpad ", e);
      }
    },
    [pinataPinFileToIPFS, selectedWallet, userIPFSKey, uploadFilesToPinata],
  );

  return {
    createCollection,
  };
};
