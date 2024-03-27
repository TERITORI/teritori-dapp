import { useCallback } from "react";
import { useSelector } from "react-redux";

import { NftLaunchpadClient } from "@/contracts-clients/nft-launchpad";
import { PinataFileProps, useIpfs } from "@/hooks/useIpfs";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import {
  getNetworkFeature,
  mustGetCosmosNetwork,
  NetworkFeature,
} from "@/networks";
import { getKeplrSigningCosmWasmClient } from "@/networks/signer";
import { CreateCollectionFormValues } from "@/screens/Launchpad/CreateCollection.type";
import { selectNFTStorageAPI } from "@/store/slices/settings";
import { generateIpfsKey } from "@/utils/ipfs";

export const useCreateCollection = () => {
  const selectedWallet = useSelectedWallet();
  const userIPFSKey = useSelector(selectNFTStorageAPI);
  const { pinataPinFileToIPFS } = useIpfs();

  return useCallback(
    async (collectionFormValues: CreateCollectionFormValues) => {
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

      try {
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
        const fileIpfsHash = await pinataPinFileToIPFS({
          pinataJWTKey,
          file: collectionFormValues.coverImage,
        } as PinataFileProps);

        client.submitCollection({
          collection: {
            name: collectionFormValues.name || "",
            desc: collectionFormValues.description || "",
            symbol: collectionFormValues.symbol || "",
            external_link: collectionFormValues.externalLink || "",

            website_link: collectionFormValues.websiteLink || "",
            twitter_profile: collectionFormValues.twitterProfileUrl || "",
            twitter_followers_count:
              collectionFormValues.nbTwitterFollowers || 0,
            contact_discord_name: collectionFormValues.discordName || "",
            contact_email: collectionFormValues.email || "",
            project_type: collectionFormValues.projectTypes?.join() || "",
            project_desc: collectionFormValues.projectDescription || "",

            tokens_count: collectionFormValues.nbTokens || 0,
            unit_price: collectionFormValues.unitPrice || "",
            limit_per_address: collectionFormValues.perAddressLimit || 0,
            start_time: collectionFormValues.startTime || 0,

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

            cover_img_uri: fileIpfsHash || "",
            is_applied_previously:
              collectionFormValues.isPreviouslyApplied || false,
            is_project_derivative:
              collectionFormValues.isDerivativeProject || false,
            is_ready_for_mint: collectionFormValues.isReadyForMint || false,
            is_dox: collectionFormValues.isDox || false,
            escrow_mint_proceeds_period:
              collectionFormValues.escrowMintProceedsPeriod || 0,
            dao_whitelist_count: collectionFormValues.daoWhitelistCount || 0,

            // TODO: collection of whitelists

            whitelist_mint_infos: [],

            royalty_address: collectionFormValues.royaltyAddress || "",
            royalty_percentage: collectionFormValues.royaltyPercentage || 0,

            target_network: network.id,
            denom: cosmwasmLaunchpadFeature.defaultMintDenom,
            deployed_address: "None",
            merkle_root: "None",
            whitepaper_link: "None",
            base_token_uri: "None",
          },
        });

        // const amount = await tnsClient.mintPrice({ tokenId });
        // return {
        //   denom: info.native_denom,
        //   amount: amount?.toString() || "0",
        //   invalid: false,
        // };
      } catch (e) {
        // if (e instanceof Error && e.message.includes("Token Name Invalid")) {
        //   return { denom: info.native_denom, amount: "0", invalid: true };
        // }
        // throw e;
      }
    },
    [],
  );
};
