import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { BackTo } from "../../components/navigation/BackTo";
import { NFTActivity } from "../../components/nftDetails/NFTActivity";
import { NFTMainInfo } from "../../components/nftDetails/NFTMainInfo";
import { NFTPriceHistory } from "../../components/nftDetails/NFTPriceHistory";
import { TabItem, Tabs, useTabs } from "../../components/tabs/Tabs";
import {
  initialToastError,
  useFeedbacks,
} from "../../context/FeedbacksProvider";
import {
  TeritoriNftVaultClient,
  TeritoriNftVaultQueryClient,
} from "../../contracts-clients/teritori-nft-vault/TeritoriNftVault.client";
import { useCancelNFTListing } from "../../hooks/useCancelNFTListing";
import { useNFTInfo } from "../../hooks/useNFTInfo";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { useSellNFT } from "../../hooks/useSellNFT";
import {
  getNonSigningCosmWasmClient,
  getSigningCosmWasmClient,
} from "../../utils/keplr";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { Network } from "../../utils/network";
import {
  layout,
  screenContainerContentMarginHorizontal,
  screenContentMaxWidth,
} from "../../utils/style/layout";
import { vaultContractAddress } from "../../utils/teritori";
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
    label: "Activity",
    isSelected: false,
  },
  {
    label: "More from collection",
    isSelected: false,
  },
];

export interface NFTInfo {
  name: string;
  description: string;
  attributes: NFTAttribute[];
  nftAddress: string;
  imageURL: string;
  tokenId: string;
  mintAddress: string;
  ownerAddress: string;
  isSeller: boolean;
  isListed: boolean;
  isOwner: boolean;
  canSell: boolean;
  price: string;
  priceDenom: string;
  collectionName: string;
  textInsert?: string;
}

const Content: React.FC<{
  id: string;
  setCollectionInfo: (info: CollectionInfoSmall) => void;
}> = ({ id, setCollectionInfo }) => {
  const { onPressTabItem, tabItems, selectedTabItem } = useTabs(screenTabItems);
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
      const vaultInfo = await vaultClient.nftInfo({
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
            amount: vaultInfo.amount,
            denom: vaultInfo.denom,
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

  const sell = useSellNFT();

  const handleSell = useCallback(
    async (price: string) => {
      if (!info) {
        return;
      }
      const reply = await sell(info.nftAddress, info.tokenId, price);
      console.log(reply);
      refresh();
      return reply;
    },
    [info, sell, refresh]
  );

  const cancelListing = useCancelNFTListing(
    info?.nftAddress || "",
    info?.tokenId || ""
  );

  const handleCancelListing = useCallback(async () => {
    const reply = await cancelListing();
    console.log(reply);
    refresh();
    return reply;
  }, [cancelListing, refresh]);

  let tabContent;
  switch (selectedTabItem.label) {
    case "Main info":
      tabContent = (
        <NFTMainInfo
          nftInfo={info}
          buy={buy}
          sell={handleSell}
          cancelListing={handleCancelListing}
        />
      );
      break;
    case "Price history":
      tabContent = (
        <NFTPriceHistory id={id} style={{ height: 200, width: 400 }} />
      );
      break;
    case "Activity":
      tabContent = <NFTActivity id={id} />;
      break;
  }

  // Used to send Collection name and mintAddress to the parent ScreenContainer (BackTo)
  useEffect(() => {
    setCollectionInfo({
      name: info?.collectionName || "",
      mintAddress: info?.mintAddress || "",
    });
  }, [info?.mintAddress]);

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
            style={{
              height: 40,
              justifyContent: "flex-end",
              marginTop: layout.padding_x2_5,
            }}
            onPressTabItem={onPressTabItem}
          />

          {tabContent}

          {/*====== More from this collection */}
          {/*TODO: Fetch 4 firsts NFTs from this NFT collection*/}
        </View>
      </ScrollView>
    );
  }
};

// Just name and mintAddress
type CollectionInfoSmall = {
  name: string;
  mintAddress: string;
};

export const NFTDetailScreen: ScreenFC<"NFTDetail"> = ({
  route: {
    params: { id },
  },
}) => {
  const navigation = useAppNavigation();

  const [collectionInfo, setCollectionInfo] = useState<CollectionInfoSmall>();

  return (
    <ScreenContainer
      noScroll
      noMargin
      headerChildren={
        collectionInfo?.mintAddress ? (
          <BackTo
            label={collectionInfo.name}
            onPress={() =>
              navigation.navigate("Collection", {
                id: id.split("-").slice(0, -1).join("-"),
              })
            }
          />
        ) : undefined
      }
    >
      <Content key={id} id={id} setCollectionInfo={setCollectionInfo} />
    </ScreenContainer>
  );
};
