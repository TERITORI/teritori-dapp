import { useCallback } from "react";
import { useSelector } from "react-redux";

import { NftLaunchpadClient } from "@/contracts-clients/nft-launchpad";
import { useIpfs } from "@/hooks/useIpfs";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import {
  getNetworkFeature,
  mustGetCosmosNetwork,
  NetworkFeature,
} from "@/networks";
import { getKeplrSigningCosmWasmClient } from "@/networks/signer";
import { CollectionFormValues } from "@/screens/Launchpad/CreateCollection.type";
import { selectNFTStorageAPI } from "@/store/slices/settings";

export const useCreateCollection = () => {
  const selectedWallet = useSelectedWallet();
  console.log("sssss", selectedWallet);

  const userIPFSKey = useSelector(selectNFTStorageAPI);
  const { pinataPinFileToIPFS } = useIpfs();

  const createCollection = useCallback(
    async (collectionFormValues: CollectionFormValues) => {
      console.log('ddddd"');

      if (!selectedWallet) return;
      console.log("ccccc", selectedWallet);
      const network = mustGetCosmosNetwork(selectedWallet.networkId);

      const signingComswasmClient = await getKeplrSigningCosmWasmClient(
        network.id,
      );
      const cosmwasmLaunchpadFeature = getNetworkFeature(
        network.id,
        NetworkFeature.NFTLaunchpad,
      );

      console.log(
        "cosmwasmLaunchpadFeaturecosmwasmLaunchpadFeature",
        cosmwasmLaunchpadFeature,
      );
      console.log(
        "signingComswasmClientsigningComswasmClient",
        signingComswasmClient,
      );

      console.log("selectedWallet.address", selectedWallet.address);

      if (!cosmwasmLaunchpadFeature) return;

      const client = new NftLaunchpadClient(
        signingComswasmClient,
        selectedWallet.address,
        cosmwasmLaunchpadFeature.launchpadContractAddress,
      );
      console.log("clientclientclient", client);
      try {
        // const pinataJWTKey =
        //   userIPFSKey ||
        //   (await generateIpfsKey(network.id, selectedWallet.userId));
        // if (!pinataJWTKey) {
        //   console.error("upload file err : No Pinata JWT");
        //   // setToastError({
        //   //   title: "File upload failed",
        //   //   message: "No Pinata JWT",
        //   // });
        //   return;
        // }
        // const fileIpfsHash = await pinataPinFileToIPFS({
        //   pinataJWTKey,
        //   file: collectionFormValues.coverImage,
        // } as PinataFileProps);

        await client.submitCollection({
          collection: {
            name: "name",
            desc: "desc",
            symbol: "SYMBOL",
            cover_img_uri: "img",
            target_network: "network",
            external_link: null,
            website_link: null,
            twitter_profile: "twitter_profile",
            twitter_followers_count: 1,
            contact_discord_name: "contact_discord_name",
            contact_email: "contact_email",
            is_project_derivative: true,
            project_type: "project_type",
            project_desc: "project_desc",
            is_applied_previously: false,
            team_desc: "team_desc",
            team_link: "team_link",
            partners: "partners",
            investment_desc: "investment_desc",
            investment_link: "investment_link",
            whitepaper_link: "whitepaper_link",
            roadmap_link: "roadmap_link",
            artwork_desc: "artwork_desc",
            is_ready_for_mint: true,
            expected_supply: 1000,
            expected_public_mint_price: 100,
            expected_mint_date: 0,
            escrow_mint_proceeds_period: 0,
            is_dox: true,
            dao_whitelist_count: 10,
            tokens_count: 1000,
            denom: "denom",
            unit_price: "100",
            limit_per_address: 2,
            start_time: 0,
            whitelist_mint_infos: [],
            royalty_address: "royalty_address",
            royalty_percentage: 50,
            base_token_uri: null,
            merkle_root: null,
            deployed_address: null,
            // name: collectionFormValues.name || "",
            // desc: collectionFormValues.description || "",
            // symbol: collectionFormValues.symbol || "",
            // external_link: collectionFormValues.externalLink || "",
            //
            // website_link: collectionFormValues.websiteLink || "",
            // twitter_profile: collectionFormValues.twitterProfileUrl || "",
            // twitter_followers_count:
            //   collectionFormValues.nbTwitterFollowers || 0,
            // contact_discord_name: collectionFormValues.discordName || "",
            // contact_email: collectionFormValues.email || "",
            // project_type: collectionFormValues.projectTypes?.join() || "",
            // project_desc: collectionFormValues.projectDescription || "",
            //
            // tokens_count: collectionFormValues.nbTokens || 0,
            // unit_price: collectionFormValues.unitPrice || "",
            // limit_per_address: collectionFormValues.perAddressLimit || 0,
            // start_time: collectionFormValues.startTime || 0,
            //
            // team_desc: collectionFormValues.teamDescription || "",
            // team_link: collectionFormValues.teamLink || "",
            // partners: collectionFormValues.partnersDescription || "",
            //
            // investment_desc: collectionFormValues.investDescription || "",
            // investment_link: collectionFormValues.investLink || "",
            // roadmap_link: collectionFormValues.roadmapLink || "",
            //
            // artwork_desc: collectionFormValues.artworkDescription || "",
            // expected_supply: collectionFormValues.expectedSupply || 0,
            // expected_public_mint_price:
            //   collectionFormValues.expectedPublicMintPrice || 0,
            // expected_mint_date: collectionFormValues.expectedMintDate || 0,
            //
            // // TODO:
            // // nftApiKey: collectionFormValues.nftApiKey || "",
            //
            // cover_img_uri: fileIpfsHash || "",
            // is_applied_previously:
            //   collectionFormValues.isPreviouslyApplied || false,
            // is_project_derivative:
            //   collectionFormValues.isDerivativeProject || false,
            // is_ready_for_mint: collectionFormValues.isReadyForMint || false,
            // is_dox: collectionFormValues.isDox || false,
            // escrow_mint_proceeds_period:
            //   collectionFormValues.escrowMintProceedsPeriod || 0,
            // dao_whitelist_count: collectionFormValues.daoWhitelistCount || 0,
            //
            // // TODO: collection of whitelists
            //
            // whitelist_mint_infos: [],
            //
            // royalty_address: collectionFormValues.royaltyAddress || "",
            // royalty_percentage: collectionFormValues.royaltyPercentage || 0,
            //
            // target_network: network.id,
            // denom: cosmwasmLaunchpadFeature.defaultMintDenom,
            // deployed_address: "None",
            // merkle_root: "None",
            // whitepaper_link: "None",
            // base_token_uri: "None",
          },
        });

        // const amount = await tnsClient.mintPrice({ tokenId });
        // return {
        // denom: info.native_denom,
        // amount: amount?.toString() || "0",
        // invalid: false,
        // };
      } catch (e) {
        // if (e instanceof Error && e.message.includes("Token Name Invalid")) {
        //   return { denom: info.native_denom, amount: "0", invalid: true };
        // }
        // throw e;
        console.log("eeeeeeeerrroooooorr", e);
      }
    },
    [],
  );

  return {
    createCollection,
  };
};
