import { RouteProp } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { BackTo } from "../../components/navigation/BackTo";
import { NFTMainInfo } from "../../components/nftDetails/NFTMainInfo";
import { TabItem, Tabs, useTabs } from "../../components/tabs/Tabs";
import {
  initialToastError,
  useFeedbacks,
} from "../../context/FeedbacksProvider";
import { TeritoriNftMinterQueryClient } from "../../contracts-clients/teritori-nft-minter/TeritoriNftMinter.client";
import {
  TeritoriNftVaultClient,
  TeritoriNftVaultQueryClient,
} from "../../contracts-clients/teritori-nft-vault/TeritoriNftVault.client";
import { TeritoriNftQueryClient } from "../../contracts-clients/teritori-nft/TeritoriNft.client";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import {
  getNonSigningCosmWasmClient,
  getSigningCosmWasmClient,
} from "../../utils/keplr";
import { RootStackParamList } from "../../utils/navigation";
import { Network } from "../../utils/network";
import {
  screenContainerContentMarginHorizontal,
  screenContentMaxWidth,
} from "../../utils/style/layout";
import { NFTAttribute } from "../../utils/types/nft";

const screenTabItems: TabItem[] = [
  {
    label: "Main info",
    isSelected: true,
  },
  {
    label: "Price history",
    isSelected: false,
  },
  {
    label: "Offers",
    isSelected: false,
  },
  {
    label: "Activities",
    isSelected: false,
  },
  {
    label: "More from collection",
    isSelected: false,
  },
];

const vaultContractAddress =
  "tori17ww32dvhrxa9ga57vk65dzu8746nm0cqlqxq06zfrkd0wffpkleslfmjtq";

export interface NFTInfo {
  name: string;
  description: string;
  attributes: NFTAttribute[];
  nftAddress: string;
  imageURL: string;
  tokenId: string;
  tokenAddress: string;
  ownerAddress: string;
  isSeller: boolean;
  isListed: boolean;
  isOwner: boolean;
  canSell: boolean;
  price: string;
  priceDenom: string;
  collectionName: string;
}

const Content: React.FC<{ id: string }> = ({ id }) => {
  const { onPressTabItem, tabItems } = useTabs(screenTabItems);
  const { setToastError } = useFeedbacks();
  const { setLoadingFullScreen } = useFeedbacks();
  const wallet = useSelectedWallet();
  const { info, refresh, notFound, loading } = useNFTInfo(
    id,
    wallet?.publicKey
  );

  // Query the Vault client to buy the NFT and returns the transaction reply
  const buy = useCallback(async () => {
    if (
      !wallet ||
      wallet.network !== Network.Teritori ||
      !wallet.connected ||
      !wallet.publicKey ||
      !info?.nftAddress
    ) {
      return;
    }
    setToastError(initialToastError);
    try {
      const cosmwasmClient = await getNonSigningCosmWasmClient();
      const vaultClient = new TeritoriNftVaultQueryClient(
        cosmwasmClient,
        vaultContractAddress
      );
      const ownerAddress = await vaultClient.nftOwnerInfo({
        nftContractAddr: info.nftAddress,
        nftTokenId: info.tokenId,
      });
      const vaultInfo = vaultClient.nftInfo({
        nftContractAddr: info.nftAddress,
        nftTokenId: info.tokenId,
        wallet: ownerAddress,
      });
      const signingCosmwasmClient = await getSigningCosmWasmClient();
      const signingVaultClient = new TeritoriNftVaultClient(
        signingCosmwasmClient,
        wallet.publicKey,
        vaultContractAddress
      );
      const reply = await signingVaultClient.buy(
        { nftContractAddr: info.nftAddress, nftTokenId: info.tokenId },
        "auto",
        undefined,
        [
          {
            amount: (await vaultInfo).amount,
            denom: (await vaultInfo).denom,
          },
        ]
      );
      console.log("buy", reply);
      refresh();
      return reply;
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setToastError({
          title: "Failed to buy NFT",
          message: err.message,
        });
        return undefined;
      }
    }
  }, [wallet, info]);

  // Sync loadingFullScreen
  useEffect(() => {
    setLoadingFullScreen(loading);
  }, [loading]);

  if (!id.startsWith("tori-")) {
    return (
      <View style={{ alignItems: "center", width: "100%", marginTop: 40 }}>
        <BrandText>Network not supported</BrandText>
      </View>
    );
  } else if (notFound) {
    return (
      <View style={{ alignItems: "center", width: "100%", marginTop: 40 }}>
        <BrandText>NFT not found</BrandText>
      </View>
    );
  }
  // TODO: Reuse this ScrollView pattern (ScrollView + View just bellow) in other Screens to provide a ScreenView (One per screen) width centered scrolling content with fixed max width. And remove it from ScreenContainer
  else {
    return (
      <ScrollView
        contentContainerStyle={{
          width: "100%",
          alignItems: "center",
          paddingHorizontal: screenContainerContentMarginHorizontal,
        }}
      >
        <View
          style={{
            alignItems: "center",
            width: "100%",
            maxWidth: screenContentMaxWidth,
          }}
        >
          {/*====== Tabs Menu for whole screen */}
          <Tabs
            items={tabItems}
            style={{ marginTop: 24, justifyContent: "flex-end" }}
            onPressTabItem={onPressTabItem}
          />

          {/*====== Main info NFT */}
          <NFTMainInfo nftInfo={info} buy={buy} />

          {/*====== More from this collection */}
          {/*TODO: Fetch 4 firsts NFTs from this NFT collection*/}
        </View>
      </ScrollView>
    );
  }
};

const useNFTInfo = (id: string, wallet: string | undefined) => {
  const [info, setInfo] = useState<NFTInfo>();
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(() => {
    setRefreshIndex((i) => i + 1);
  }, []);

  useEffect(() => {
    const effect = async () => {
      setLoading(true);
      try {
        // Getting the correct contract address by removing the prefix
        const idParts = id.substring(5).split("-");
        const minterContractAddress = idParts[0];
        // Getting the token ID (suffix)
        const tokenId = idParts[1];
        // We use a CosmWasm non signing Client
        const cosmwasmClient = await getNonSigningCosmWasmClient();

        // ======== Getting minter client
        const minterClient = new TeritoriNftMinterQueryClient(
          cosmwasmClient,
          minterContractAddress
        );
        const minterConfig = await minterClient.config();
        // ======== Getting NFT client
        const nftClient = new TeritoriNftQueryClient(
          cosmwasmClient,
          minterConfig.nft_addr
        );
        // ======== Getting contract info (For collection name)
        const contractInfo = await nftClient.contractInfo();
        // ======== Getting NFT info
        const nftInfo = await nftClient.nftInfo({ tokenId });
        if (!nftInfo.token_uri) {
          return;
        }
        // ======== Getting NFT owner
        const { owner } = await nftClient.ownerOf({ tokenId });
        // ======== Getting NFT metadata
        const nftMetadata = await (
          await fetch(ipfsURLToHTTPURL(nftInfo.token_uri))
        ).json();
        console.log("contractInfocontractInfocontractInfo", contractInfo);
        console.log("nftInfonftInfonftInfo", nftInfo);
        console.log("nftMetadatanftMetadatanftMetadata", nftMetadata);
        console.log("ownerownerowner", owner);
        // ======== Getting vault stuff (For selling)
        const vaultClient = new TeritoriNftVaultQueryClient(
          cosmwasmClient,
          vaultContractAddress
        );
        let vaultOwnerAddress;
        let vaultInfo;
        let isListed = false;

        try {
          vaultOwnerAddress = await vaultClient.nftOwnerInfo({
            nftContractAddr: minterConfig.nft_addr,
            nftTokenId: tokenId,
          });
          vaultInfo = await vaultClient.nftInfo({
            nftContractAddr: minterConfig.nft_addr,
            nftTokenId: tokenId,
            wallet: vaultOwnerAddress,
          });
          isListed = true;
        } catch {
          // ======== The NFT is not on sale
        }
        const isOwner =
          !!wallet &&
          ((!!owner && owner === wallet) ||
            (!!vaultOwnerAddress && vaultOwnerAddress === wallet));

        // NFT base info
        const nfo: NFTInfo = {
          name: nftMetadata.name,
          description: nftMetadata.description,
          attributes: nftMetadata.attributes,
          nftAddress: minterConfig.nft_addr,
          imageURL: ipfsURLToHTTPURL(nftMetadata.image),
          tokenId,
          tokenAddress: id,
          ownerAddress: owner,
          isSeller: isListed && isOwner,
          isListed,
          isOwner,
          canSell: isOwner && !isListed,
          price: vaultInfo?.amount || "",
          priceDenom: vaultInfo?.denom || "",
          collectionName: contractInfo.name,
        };
        setInfo(nfo);
        setNotFound(false);
        setLoading(false);
      } catch (err) {
        setNotFound(true);
        setLoading(false);
        console.error(err);
      }
    };
    effect();
  }, [id, wallet, refreshIndex]);

  return { info, refresh, notFound, loading };
};

export const NFTDetailScreen: React.FC<{
  route: RouteProp<RootStackParamList, "NFTDetail">;
}> = ({
  route: {
    params: { id },
  },
}) => {
  //TODO: Get collection mintaddress and name from the NFT and pass it to <BackTo/>

  return (
    <ScreenContainer
      noScroll
      noMargin
      headerChildren={
        <BackTo
          label="Collection"
          navItem="Collection"
          navParams={{ mintAddress: "collection_mintaddress" }}
        />
      }
    >
      <Content key={id} id={id} />
    </ScreenContainer>
  );
};
