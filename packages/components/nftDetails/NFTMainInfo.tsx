import { ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import React from "react";
import { StyleSheet, View } from "react-native";

import guardian1PNG from "../../../assets/default-images/guardian_1.png";
import { NFTInfo } from "../../screens/Marketplace/NFTDetailScreen";
import { neutral77, primaryColor } from "../../utils/style/colors";
import {
  fontMedium14,
  fontSemibold12,
  fontSemibold14,
  fontSemibold28,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { ImageWithTextInsert } from "../ImageWithTextInsert";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { NFTCancelListingCard } from "../cards/NFTCancelListingCard";
import { NFTPriceBuyCard } from "../cards/NFTPriceBuyCard";
import { NFTSellCard } from "../cards/NFTSellCard";
import { CollectionInfoInline } from "../collections/CollectionInfoInline";
import {
  TransactionModals,
  useTransactionModals,
} from "../modals/transaction/TransactionModals";
import { TabItem, Tabs, useTabs } from "../tabs/Tabs";
import { NFTAttributes } from "./NFTAttributes";
import { CollapsableActivities } from "./components/CollapsableActivities";
import { CollapsablePiceHistory } from "./components/CollapsablePriceHistory";

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
  const { openTransactionModals } = useTransactionModals();

  const { onPressTabItem, selectedTabItem, tabItems } =
    useTabs(mainInfoTabItems);

  const SelectedTabItemRendering: React.FC = () => {
    switch (selectedTabItem.label) {
      case "About":
        return (
          <View style={styles.sectionContainer}>
            <BrandText
              style={[fontSemibold14, { marginBottom: 24, width: "100%" }]}
            >
              {nftInfo?.description}
            </BrandText>
          </View>
        );
      case "Attributes":
        return (
          <View style={styles.sectionContainer}>
            <NFTAttributes nftAttributes={nftInfo?.attributes} />
          </View>
        );
      case "Details":
        return (
          <View style={styles.sectionContainer}>
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
          </View>
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
        <ImageWithTextInsert
          imageURL={nftInfo?.imageURL}
          textInsert={nftInfo?.textInsert}
          size={462}
          style={{ borderRadius: 8 }}
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
            onPressBuy={openTransactionModals}
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
          tabStyle={{ paddingBottom: layout.padding_x1, height: 24 }}
        />
        {/*TODO: 3 View to display depending on the nftMainInfoTabItems isSelected item*/}
        {/*TODO: About  = Big text*/}
        <SelectedTabItemRendering />
      </View>
      <View style={styles.collapsableContainer}>
        <CollapsablePiceHistory />
      </View>
      <View style={styles.collapsableContainer}>
        <CollapsableActivities />
      </View>

      {/* ====== "Buy this NFT" three modals*/}
      <TransactionModals
        startTransaction={buy}
        nftInfo={nftInfo}
        textComponentPayment={
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
        textComponentSuccess={
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    width: 600,
    paddingVertical: layout.padding_x3,
  },
  collapsableContainer: {
    width: "100%",
    marginBottom: layout.padding_x2,
  },
});
