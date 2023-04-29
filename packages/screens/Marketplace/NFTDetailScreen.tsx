import { ScrollView, Target } from "@nandorojo/anchor";
import React, { useCallback, useState } from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { NFTMainInfo } from "../../components/nftDetails/NFTMainInfo";
import { SpacerColumn } from "../../components/spacer";
import { Tabs } from "../../components/tabs/Tabs";
import { useBuyNFT } from "../../hooks/nfts/useBuyNFT";
import { useCancelNFTListing } from "../../hooks/nfts/useCancelNFTListing";
import { useNFTInfo } from "../../hooks/nfts/useNFTInfo";
import { useSellNFT } from "../../hooks/nfts/useSellNFT";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useMintEnded } from "../../hooks/useMintEnded";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { NetworkKind, getCollectionId, parseNftId } from "../../networks";
import { ScreenFC } from "../../utils/navigation";
import { setDocumentTitle } from "../../utils/setDocumentTitle";
import { NFTAttribute } from "../../utils/types/nft";

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
  collectionImageURL: string;
  mintDenom: string;
  royalty: number;
  breedingsAvailable?: number;
  networkId: string;
  collectionId: string;
}

const Content: React.FC<{
  id: string;
}> = ({ id }) => {
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof screenTabItems>("main");
  const wallet = useSelectedWallet();
  const { info, refresh, notFound } = useNFTInfo(id, wallet?.userId);
  setDocumentTitle(`NFT: ${info?.name}`);
  const { width } = useMaxResolution({ noMargin: true });

  const [network, collectionAddress] = parseNftId(id);

  const collectionId = getCollectionId(network?.id, collectionAddress);
  const mintEnded = useMintEnded(collectionId);
  const showMarketplace =
    (network?.secondaryDuringMintList || []).includes(collectionAddress) ||
    (mintEnded !== undefined && mintEnded);

  const screenTabItems = {
    main: {
      name: "Main info",
      scrollTo: "main-info",
    },
    price: {
      name: "Price history",
      scrollTo: "price-history",
      disabled: !showMarketplace,
    },
    activity: {
      name: "Activity",
      scrollTo: "activity",
    },
    more: {
      name: "More from collection",
      disabled: true,
    },
  };

  const buy = useBuyNFT(wallet?.id);
  const handleBuy = useCallback(async () => {
    if (!info) {
      return;
    }
    const txHash = await buy(info);
    refresh();
    return txHash;
  }, [buy, info, refresh]);

  const sell = useSellNFT(wallet?.id);
  const handleSell = useCallback(
    async (price: string, denom: string | undefined) => {
      if (!info) {
        return;
      }
      const txHash = await sell(info.nftAddress, info.tokenId, price, denom);
      refresh();
      return txHash;
    },
    [info, sell, refresh]
  );

  const cancelListing = useCancelNFTListing(
    network?.id,
    info?.nftAddress || "",
    info?.tokenId || ""
  );

  const handleCancelListing = useCallback(async () => {
    const txHash = await cancelListing();
    console.log("txHash:", txHash);
    refresh();
    return txHash;
  }, [cancelListing, refresh]);

  if (
    ![NetworkKind.Cosmos, NetworkKind.Ethereum].includes(
      network?.kind || NetworkKind.Unknown
    )
  ) {
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
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ width: "100%" }}
          stickyHeaderIndices={[0]}
          contentContainerStyle={{
            width: "100%",
            alignItems: "center",
          }}
        >
          <Tabs
            items={screenTabItems}
            selected={selectedTab}
            style={{
              height: 60,
              width,
              alignItems: "flex-end",
              backgroundColor: "black",
            }}
            onSelect={setSelectedTab}
          />

          <Target name="main-info">
            <SpacerColumn size={6} />
          </Target>

          <NFTMainInfo
            nftId={id}
            nftInfo={info || undefined}
            buy={handleBuy}
            sell={handleSell}
            cancelListing={handleCancelListing}
            showMarketplace={showMarketplace}
          />
          <SpacerColumn size={6} />
        </ScrollView>
      </View>
    );
  }
};

export const NFTDetailScreen: ScreenFC<"NFTDetail"> = ({
  route: {
    params: { id },
  },
}) => {
  // needed for emoji
  id = decodeURIComponent(id);

  const [network] = parseNftId(id);

  return (
    <ScreenContainer
      forceNetworkIds={[network?.id || ""]}
      fullWidth
      footerChildren={<></>}
      noScroll
      noMargin
    >
      <Content key={id} id={id} />
    </ScreenContainer>
  );
};
