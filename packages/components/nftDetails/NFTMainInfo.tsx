import { ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import React, { useState } from "react";
import { Image, View } from "react-native";
import styled, { useTheme } from "styled-components/native";

import guardian1PNG from "../../../assets/default-images/guardian_1.png";
import { NFTInfo } from "../../screens/Marketplace/NFTDetailScreen";
import { neutral77, primaryColor } from "../../utils/style/colors";
import {
  fontMedium14,
  fontSemibold12,
  fontSemibold14,
  fontSemibold28,
} from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { NFTCancelListingCard } from "../cards/NFTCancelListingCard";
import { NFTPriceBuyCard } from "../cards/NFTPriceBuyCard";
import { NFTSellCard } from "../cards/NFTSellCard";
import { CollectionInfoInline } from "../collections/CollectionInfoInline";
import { TransactionPaymentModal } from "../modals/transaction/TransactionPaymentModal";
import { TransactionPendingModal } from "../modals/transaction/TransactionPendingModal";
import { TransactionSuccessModal } from "../modals/transaction/TransactionSuccessModal";
import { TabItem, Tabs, useTabs } from "../tabs/Tabs";
import { NFTAttributes } from "./NFTAttributes";
import { CollapsableActivities } from "./components/CollapsableActivities";

const mainInfoTabItems: TabItem[] = [
  {
    label: "About",
    isSelected: false,
  },
  {
    label: "Attributes",
    isSelected: true,
  },
  {
    label: "Details",
    isSelected: false,
  },
];

// Displays NFT metadata and handle buying
export const NFTMainInfo: React.FC<{
  nftInfo?: NFTInfo;
  buy: () => Promise<ExecuteResult | undefined>;
  sell: (price: string) => Promise<ExecuteResult | undefined>;
  cancelListing: () => Promise<ExecuteResult | undefined>;
}> = ({ nftInfo, buy, sell, cancelListing }) => {
  // variables
  const { layout } = useTheme();

  const [transactionPaymentModalVisible, setTransactionPaymentModalVisible] =
    useState(false);
  const [transactionPendingModalVisible, setTransactionPendingModalVisible] =
    useState(false);
  const [transactionSuccessModalVisible, setTransactionSuccessModalVisible] =
    useState(false);
  const [transactionHash, setTransactionHash] = useState("");

  const handleBuy = async () => {
    setTransactionPaymentModalVisible(false);
    setTransactionPendingModalVisible(true);
    buy().then((reply) => {
      if (!reply) {
        setTransactionPendingModalVisible(false);
      } else {
        setTransactionHash(reply?.transactionHash || "");
        setTransactionPendingModalVisible(false);
        setTransactionSuccessModalVisible(true);
      }
    });
  };

  const { onPressTabItem, selectedTabItem, tabItems } =
    useTabs(mainInfoTabItems);

  const SelectedTabItemRendering: React.FC = () => {
    switch (selectedTabItem.label) {
      case "About":
        return (
          <SectionContainer>
            <BrandText
              style={[fontSemibold14, { marginBottom: 24, width: "100%" }]}
            >
              {nftInfo?.description}
            </BrandText>
          </SectionContainer>
        );
      case "Attributes":
        return (
          <SectionContainer>
            <NFTAttributes nftAttributes={nftInfo?.attributes} />
          </SectionContainer>
        );
      case "Details":
        return (
          <SectionContainer>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <BrandText style={[fontSemibold12, { color: neutral77 }]}>
                Mint contract address
              </BrandText>
              <BrandText style={fontMedium14} numberOfLines={1}>
                {nftInfo?.mintAddress}
              </BrandText>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <BrandText style={[fontSemibold12, { color: neutral77 }]}>
                Token contract address
              </BrandText>
              <BrandText style={fontMedium14} numberOfLines={1}>
                {nftInfo?.nftAddress}
              </BrandText>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <BrandText style={[fontSemibold12, { color: neutral77 }]}>
                Owner address
              </BrandText>
              <BrandText style={fontMedium14} numberOfLines={1}>
                {nftInfo?.ownerAddress}
              </BrandText>
            </View>
          </SectionContainer>
        );
      default:
        return null;
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        marginTop: 48,
        width: "100%",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {/*---- Image NFT */}
      <TertiaryBox
        width={464}
        height={464}
        style={{ marginRight: 28, marginBottom: 40 }}
      >
        <Image
          source={{ uri: nftInfo?.imageURL }}
          style={{ width: 462, height: 462, borderRadius: 8 }}
        />
      </TertiaryBox>
      {/*---- Info NFT */}
      <View style={{ maxWidth: 600 }}>
        <BrandText style={[fontSemibold28, { marginBottom: 12 }]}>
          {nftInfo?.name}
        </BrandText>

        <CollectionInfoInline
          imageSource={guardian1PNG}
          name={nftInfo?.collectionName}
        />

        {nftInfo?.canSell && (
          <NFTSellCard
            style={{ marginTop: 24, marginBottom: 40 }}
            onPressSell={sell}
          />
        )}
        {nftInfo?.isListed && !nftInfo?.isOwner && (
          <NFTPriceBuyCard
            style={{ marginTop: 24, marginBottom: 40 }}
            onPressBuy={() => setTransactionPaymentModalVisible(true)}
            price={nftInfo.price}
            priceDenom={nftInfo.priceDenom}
          />
        )}
        {nftInfo?.isListed && nftInfo?.isOwner && (
          <NFTCancelListingCard
            style={{ marginTop: 24, marginBottom: 40 }}
            price={nftInfo.price}
            priceDenom={nftInfo.priceDenom}
            onPressCancel={cancelListing}
          />
        )}
        {!nftInfo?.isListed && !nftInfo?.isOwner && (
          <View style={{ marginTop: 24, marginBottom: 40 }}>
            <BrandText style={{ color: neutral77 }}>Not listed</BrandText>
          </View>
        )}

        <Tabs
          onPressTabItem={onPressTabItem}
          items={tabItems}
          borderColorTabSelected={primaryColor}
          tabStyle={{ paddingBottom: layout.padding_x2 }}
        />
        {/*TODO: 3 View to display depending on the nftMainInfoTabItems isSelected item*/}
        {/*TODO: About  = Big text*/}
        <SelectedTabItemRendering />
      </View>
      <CollapsableActivities />

      {/* ====== "Buy this NFT" three modals*/}
      {/*TODO: Handle these 3 modales with a component, or a hook*/}

      {/* ----- Modal to process payment*/}
      <TransactionPaymentModal
        onPressProceed={handleBuy}
        onClose={() => setTransactionPaymentModalVisible(false)}
        visible={transactionPaymentModalVisible}
        price={nftInfo?.price}
        priceDenom={nftInfo?.priceDenom}
        label="Checkout"
        textComponent={
          <BrandText style={fontSemibold14}>
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              You are about to purchase a{" "}
            </BrandText>
            {nftInfo?.name}
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              {" "}
              from{" "}
            </BrandText>
            {nftInfo?.collectionName}
          </BrandText>
        }
      />

      {/* ----- Modal with loader, witing for wallet approbation*/}
      <TransactionPendingModal
        operationLabel="Purchase"
        visible={transactionPendingModalVisible}
        onClose={() => setTransactionPendingModalVisible(false)}
      />

      {/* ----- Success modal*/}
      <TransactionSuccessModal
        transactionHash={transactionHash}
        visible={transactionSuccessModalVisible}
        textComponent={
          <BrandText style={fontSemibold14}>
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              You successfully purchased{" "}
            </BrandText>
            {nftInfo?.name}
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              {" "}
              from{" "}
            </BrandText>
            {nftInfo?.collectionName}
          </BrandText>
        }
        onClose={() => setTransactionSuccessModalVisible(false)}
      />
    </View>
  );
};

const SectionContainer = styled.View(({ theme: { layout } }) => ({
  width: 600,
  paddingVertical: layout.padding_x3,
}));
