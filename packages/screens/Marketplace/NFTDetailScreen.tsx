import { ScrollView, Target } from "@nandorojo/anchor";
import React, { useCallback, useState } from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
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
import { useMintEnded } from "../../hooks/useMintEnded";
import { useNFTInfo } from "../../hooks/useNFTInfo";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { useSellNFT } from "../../hooks/useSellNFT";
import { secondaryDuringMintList } from "../../utils/collections";
import { getSigningCosmWasmClient } from "../../utils/keplr";
import { ScreenFC } from "../../utils/navigation";
import { vaultContractAddress } from "../../utils/teritori";
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
}

const Content: React.FC<{
  id: string;
}> = ({ id }) => {
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof screenTabItems>("main");
  const { setToastError } = useFeedbacks();
  const wallet = useSelectedWallet();
  const { info, refresh, notFound } = useNFTInfo(id, wallet?.address);
  const { width } = useMaxResolution({ noMargin: true });

  const collectionAddress = id.split("-")[1];
  const collectionId = `tori-${collectionAddress}`;
  const mintEnded = useMintEnded(collectionId);
  const showMarketplace =
    secondaryDuringMintList.includes(collectionId) ||
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

  return (
    <ScreenContainer fullWidth footerChildren={<></>} noScroll noMargin>
      <Content key={id} id={id} />
    </ScreenContainer>
  );
};
