import { ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { Target } from "@nandorojo/anchor";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

import starSVG from "../../../assets/icons/star.svg";
import { useTransactionModals } from "../../context/TransactionModalsProvider";
import { NFTInfo } from "../../screens/Marketplace/NFTDetailScreen";
import { selectSelectedNetworkId } from "../../store/slices/settings";
import { RootStackParamList } from "../../utils/navigation";
import { neutral77, primaryColor } from "../../utils/style/colors";
import {
  fontMedium14,
  fontSemibold12,
  fontSemibold14,
  fontSemibold28,
} from "../../utils/style/fonts";
import { layout, screenContentMaxWidth } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { ImageWithTextInsert } from "../ImageWithTextInsert";
import { ActivityTable } from "../activity/ActivityTable";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { NFTCancelListingCard } from "../cards/NFTCancelListingCard";
import { NFTPriceBuyCard } from "../cards/NFTPriceBuyCard";
import { NFTSellCard } from "../cards/NFTSellCard";
import { CollapsableSection } from "../collapsable/CollapsableSection";
import { CollectionInfoInline } from "../collections/CollectionInfoInline";
import { TransactionModals } from "../modals/transaction/TransactionModals";
import { SpacerColumn } from "../spacer";
import { Tabs } from "../tabs/Tabs";
import { NFTAttributes } from "./NFTAttributes";
import { CollapsablePiceHistory } from "./components/CollapsablePriceHistory";

const mainInfoTabItems = {
  about: {
    name: "About",
  },
  attributes: {
    name: "Attributes",
  },
  details: {
    name: "Details",
  },
};

// Displays NFT metadata and handle buying
export const NFTMainInfo: React.FC<{
  nftId: string;
  nftInfo?: NFTInfo;
  buy: () => Promise<ExecuteResult | undefined>;
  showMarketplace: boolean;
  sell: (
    price: string,
    denom: string | undefined
  ) => Promise<ExecuteResult | undefined>;
  cancelListing: () => Promise<ExecuteResult | undefined>;
}> = ({ nftId, nftInfo, buy, sell, cancelListing, showMarketplace }) => {
  const { openTransactionModals } = useTransactionModals();
  const { params } = useRoute<RouteProp<RootStackParamList, "NFTDetail">>();
  const selectedNetworkId = useSelector(selectSelectedNetworkId);

  const [selectedTab, setSelectedTab] =
    useState<keyof typeof mainInfoTabItems>("about");

  const SelectedTabItemRendering: React.FC = () => {
    switch (selectedTab) {
      case "about":
        return (
          <View style={styles.sectionContainer}>
            <BrandText
              style={[fontSemibold14, { marginBottom: 24, width: "100%" }]}
            >
              {nftInfo?.description}
            </BrandText>
          </View>
        );
      case "attributes":
        return (
          <View style={styles.sectionContainer}>
            <NFTAttributes nftAttributes={nftInfo?.attributes} />
          </View>
        );
      case "details":
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

  useEffect(() => {
    if (params.openBuy) openTransactionModals();
  }, []);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
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
            imageSource={{ uri: nftInfo?.collectionImageURL || "" }}
            name={nftInfo?.collectionName}
            id={`tori-${nftInfo?.mintAddress}`}
          />
          {showMarketplace ? (
            <>
              {nftInfo?.canSell && (
                <NFTSellCard
                  style={{ marginTop: 24, marginBottom: 40 }}
                  onPressSell={sell}
                  nftInfo={nftInfo}
                  networkId={selectedNetworkId}
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
            </>
          ) : (
            <SpacerColumn size={2} />
          )}
          <Tabs
            onSelect={setSelectedTab}
            items={mainInfoTabItems}
            selected={selectedTab}
            borderColorTabSelected={primaryColor}
          />
          {/*TODO: 3 View to display depending on the nftMainInfoTabItems isSelected item*/}
          {/*TODO: About  = Big text*/}
          <SelectedTabItemRendering />
        </View>
      </View>

      {showMarketplace && (
        <Target style={styles.collapsableContainer} name="price-history">
          <CollapsablePiceHistory nftId={nftId} />
        </Target>
      )}
      <Target name="activity" style={styles.collapsableContainer}>
        <CollapsableSection icon={starSVG} title="Activity" isExpandedByDefault>
          <ActivityTable nftId={nftId} />
        </CollapsableSection>
      </Target>

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
    </>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    width: 600,
    paddingVertical: layout.padding_x3,
  },
  collapsableContainer: {
    width: "100%",
    maxWidth: screenContentMaxWidth,
    marginBottom: layout.padding_x2,
  },
});
