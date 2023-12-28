import { Target } from "@nandorojo/anchor";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { Suspense, useEffect, useState } from "react";
import { View, ViewStyle } from "react-native";

import { NFTAttributes } from "./NFTAttributes";
import starSVG from "../../../assets/icons/star.svg";
import {
  AttributeRarityFloor,
  NFTCollectionAttributesRequest,
} from "../../api/marketplace/v1/marketplace";
import { useTransactionModals } from "../../context/TransactionModalsProvider";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { parseNetworkObjectId } from "../../networks";
import { getMarketplaceClient } from "../../utils/backend";
import { RootStackParamList } from "../../utils/navigation";
import { neutral77, primaryColor } from "../../utils/style/colors";
import {
  fontMedium14,
  fontSemibold12,
  fontSemibold14,
  fontSemibold28,
} from "../../utils/style/fonts";
import { layout, screenContentMaxWidth } from "../../utils/style/layout";
import { NFTInfo } from "../../utils/types/nft";
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

const mainInfoTabItems: {
  about: {
    name: string;
  };
  attributes: {
    name: string;
  };
  details?: {
    name: string;
  };
} = {
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
  buy: () => Promise<string | undefined>;
  showMarketplace: boolean;
  sell: (
    price: string,
    denom: string | undefined,
  ) => Promise<string | undefined>;
  cancelListing: () => Promise<string | undefined>;
}> = ({ nftId, nftInfo, buy, sell, cancelListing, showMarketplace }) => {
  const isMobile = useIsMobile();
  const { width } = useMaxResolution({ responsive: true, noMargin: true });
  if (isMobile) {
    delete mainInfoTabItems["details"];
    sectionContainerStyles.width = width < 600 ? width : 600;
  }
  const { openTransactionModals } = useTransactionModals();
  const { params } = useRoute<RouteProp<RootStackParamList, "NFTDetail">>();

  const [selectedTab, setSelectedTab] =
    useState<keyof typeof mainInfoTabItems>("attributes");
  const [network] = parseNetworkObjectId(nftInfo?.collectionId);
  const [attributes, setAttributes] = useState<AttributeRarityFloor[]>([]);

  // FIXME: transform this in a react-query hook
  useEffect(() => {
    try {
      setAttributes([]);
      const backendClient = getMarketplaceClient(network?.id);
      if (!backendClient) {
        return;
      }
      const allAtributes: AttributeRarityFloor[] = [];
      const stream = backendClient.NFTCollectionAttributes({
        collectionId: nftInfo?.collectionId,
        whereAttributes: nftInfo?.attributes.map((attr) => {
          return {
            traitType: attr.trait_type,
            value: attr.value,
          };
        }),
      } as NFTCollectionAttributesRequest);
      stream.subscribe(
        ({ attributes }) => {
          if (attributes) {
            allAtributes.push(attributes);
          }
        },
        (e) => {
          console.error(e);
        },
        () => {
          if (allAtributes) {
            setAttributes(allAtributes);
          }
        },
      );
    } catch (err) {
      console.error(err);
    }
  }, [network?.id, nftInfo]);

  const SelectedTabItemRendering: React.FC = () => {
    switch (selectedTab) {
      case "about":
        return (
          <View style={sectionContainerStyles}>
            <BrandText
              style={[fontSemibold14, { marginBottom: 24, width: "100%" }]}
            >
              {nftInfo?.description}
            </BrandText>
          </View>
        );
      case "attributes":
        return (
          <View style={sectionContainerStyles}>
            {nftInfo && (
              <NFTAttributes nftAttributes={attributes} nftInfo={nftInfo} />
            )}
          </View>
        );
      case "details":
        return (
          <View style={sectionContainerStyles}>
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
            {nftInfo?.breedingsAvailable !== undefined && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 6,
                }}
              >
                <BrandText style={[fontSemibold12, { color: neutral77 }]}>
                  Breedings available
                </BrandText>
                <BrandText style={fontMedium14} numberOfLines={1}>
                  {nftInfo.breedingsAvailable}
                </BrandText>
              </View>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (params.openBuy) openTransactionModals();
  }, [openTransactionModals, params.openBuy]);

  const CollapsablePriceHistory = React.lazy(() =>
    import("./components/CollapsablePriceHistory").then((module) => ({
      default: module.CollapsablePriceHistory,
    })),
  );

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          width: isMobile && width < 600 ? width : "100%",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {/*---- Image NFT */}
        <TertiaryBox
          style={{
            width: isMobile && width < 464 ? width : 464,
            height: isMobile && width < 464 ? width : 464,
            marginRight: isMobile && width < 464 ? 0 : 28,
            marginBottom: 40,
          }}
        >
          <ImageWithTextInsert
            imageURL={nftInfo?.imageURL}
            textInsert={nftInfo?.textInsert}
            size={isMobile && width < 464 ? width : 462}
            style={{ borderRadius: 8 }}
          />
        </TertiaryBox>
        {/*---- Info NFT */}
        <View style={{ maxWidth: isMobile && width < 600 ? width : 600 }}>
          <BrandText style={[fontSemibold28, { marginBottom: 12 }]}>
            {nftInfo?.name}
          </BrandText>

          <CollectionInfoInline
            imageSource={{ uri: nftInfo?.collectionImageURL || "" }}
            name={nftInfo?.collectionName}
            id={nftInfo?.collectionId}
          />
          {showMarketplace ? (
            <>
              {nftInfo?.canSell && (
                <NFTSellCard
                  style={{ marginTop: 24, marginBottom: 40 }}
                  onPressSell={sell}
                  nftInfo={nftInfo}
                />
              )}
              {nftInfo?.isListed && !nftInfo.isOwner && (
                <NFTPriceBuyCard
                  nftInfo={nftInfo}
                  style={{ marginTop: 24, marginBottom: 40 }}
                  onPressBuy={openTransactionModals}
                />
              )}
              {nftInfo?.isListed && nftInfo.isOwner && (
                <NFTCancelListingCard
                  nftInfo={nftInfo}
                  style={{ marginTop: 24, marginBottom: 40 }}
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
            <>
              <SpacerColumn size={2} />
              <BrandText style={{ color: neutral77 }}>
                Marketplace Not Opened Yet
              </BrandText>
              <SpacerColumn size={2} />
            </>
          )}
          <Tabs
            onSelect={setSelectedTab}
            items={mainInfoTabItems}
            selected={selectedTab}
            borderColorTabSelected={primaryColor}
            style={{ height: 40 }}
          />
          {/*TODO: 3 View to display depending on the nftMainInfoTabItems isSelected item*/}
          {/*TODO: About  = Big text*/}
          <SelectedTabItemRendering />
        </View>
      </View>

      {!isMobile && (
        <>
          {showMarketplace && (
            <Target style={collapsableContainerStyles} name="price-history">
              <Suspense fallback={<></>}>
                <CollapsablePriceHistory nftId={nftId} />
              </Suspense>
            </Target>
          )}
          <Target name="activity" style={collapsableContainerStyles}>
            <CollapsableSection
              icon={starSVG}
              title="Activity"
              isExpandedByDefault
            >
              <ActivityTable nftId={nftId} />
            </CollapsableSection>
          </Target>
        </>
      )}
      {/* ====== "Buy this NFT" three modals*/}
      <TransactionModals
        startTransaction={buy}
        nftId={nftId}
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

const sectionContainerStyles: ViewStyle = {
  width: 600,
  paddingVertical: layout.spacing_x3,
};
const collapsableContainerStyles: ViewStyle = {
  width: "100%",
  maxWidth: screenContentMaxWidth,
  marginBottom: layout.spacing_x2,
};
