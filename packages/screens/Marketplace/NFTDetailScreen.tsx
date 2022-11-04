import { ScrollView, Target } from "@nandorojo/anchor";
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { BackTo } from "../../components/navigation/BackTo";
import { NFTMainInfo } from "../../components/nftDetails/NFTMainInfo";
import { SpacerColumn } from "../../components/spacer";
import { Tabs } from "../../components/tabs/Tabs";
import {
  initialToastError,
  useFeedbacks,
} from "../../context/FeedbacksProvider";
import { TeritoriNftVaultClient } from "../../contracts-clients/teritori-nft-vault/TeritoriNftVault.client";
import { useCancelNFTListing } from "../../hooks/useCancelNFTListing";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useNFTInfo } from "../../hooks/useNFTInfo";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { useSellNFT } from "../../hooks/useSellNFT";
import { getSigningCosmWasmClient } from "../../utils/keplr";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { vaultContractAddress } from "../../utils/teritori";
import { NFTAttribute } from "../../utils/types/nft";

const screenTabItems = {
  main: {
    name: "Main info",
    scrollTo: "main-info",
  },
  price: {
    name: "Price history",
    scrollTo: "price-history",
  },
  activity: {
    name: "Activity",
    scrollTo: "activity",
  },
  more: {
    name: "More from collection",
  },
};

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
}

const Content: React.FC<{
  id: string;
  setCollectionInfo: (info: CollectionInfoSmall) => void;
}> = ({ id, setCollectionInfo }) => {
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof screenTabItems>("main");
  const { setToastError } = useFeedbacks();
  const wallet = useSelectedWallet();
  const { info, refresh, notFound } = useNFTInfo(id, wallet?.address);
  const { width } = useMaxResolution();

  // Query the Vault client to buy the NFT and returns the transaction reply
  const handleBuy = useCallback(async () => {
    if (!wallet?.connected || !wallet.address || !info?.nftAddress) {
      return;
    }
    setToastError(initialToastError);
    try {
      const signingCosmwasmClient = await getSigningCosmWasmClient();
      const signingVaultClient = new TeritoriNftVaultClient(
        signingCosmwasmClient,
        wallet.address,
        vaultContractAddress
      );
      const reply = await signingVaultClient.buy(
        { nftContractAddr: info.nftAddress, nftTokenId: info.tokenId },
        "auto",
        undefined,
        [
          {
            amount: info.price,
            denom: info.priceDenom,
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
    async (price: string, denom: string | undefined) => {
      if (!info) {
        return;
      }
      const reply = await sell(info.nftAddress, info.tokenId, price, denom);
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

  // Used to send Collection name and mintAddress to the parent ScreenContainer (BackTo)
  useEffect(() => {
    setCollectionInfo({
      name: info?.collectionName || "",
      mintAddress: info?.mintAddress || "",
    });
  }, [info?.mintAddress]);

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
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ width: "100%" }}
          stickyHeaderIndices={[0]}
          contentContainerStyle={{
            width: "100%",
            alignItems: "center",
          }}
        >
          <View style={{ backgroundColor: "black", width }}>
            <Tabs
              items={screenTabItems}
              selected={selectedTab}
              style={{
                height: 60,
                justifyContent: "flex-end",
                width: "100%",
              }}
              onSelect={setSelectedTab}
              hideSelector
            />
          </View>

          <Target name="main-info">
            <SpacerColumn size={6} />
          </Target>

          <NFTMainInfo
            nftId={id}
            nftInfo={info}
            buy={handleBuy}
            sell={handleSell}
            cancelListing={handleCancelListing}
          />
          <SpacerColumn size={6} />
        </ScrollView>
      </View>
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
      fullWidth
      footerChildren={<></>}
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
