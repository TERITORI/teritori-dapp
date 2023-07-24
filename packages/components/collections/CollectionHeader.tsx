import * as Clipboard from "expo-clipboard";
import React from "react";
import { View, Platform, Linking } from "react-native";

import { CollectionSocialButtons } from "./CollectionSocialButtons";
import { CollectionStat } from "./CollectionStat";
import { TabsListType } from "./types";
import etherscanSVG from "../../../assets/icons/etherscan.svg";
import shareSVG from "../../../assets/icons/share.svg";
import { SortDirection } from "../../api/marketplace/v1/marketplace";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useCollectionStats } from "../../hooks/useCollectionStats";
import { useIsMobile } from "../../hooks/useIsMobile";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { contractExplorerLink, parseCollectionId } from "../../networks";
import { prettyPrice } from "../../utils/coins";
import { CollectionInfo } from "../../utils/collection";
import { codGrayColor, neutral33 } from "../../utils/style/colors";
import { fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SocialButtonSecondary } from "../buttons/SocialButtonSecondary";
import { RoundedGradientImage } from "../images/RoundedGradientImage";
import { FilterButton } from "../sorts/FilterButton";
import { SortButton } from "../sorts/SortButton";
import { SpacerRow } from "../spacer";
import { Tabs } from "../tabs/Tabs";

// All the screen content before the Flatlist used to display NFTs
export const CollectionHeader: React.FC<{
  collectionId: string;
  collectionInfo?: CollectionInfo;
  selectedTab: TabsListType;
  onSelectTab: (tab: TabsListType) => void;
  sortDirection: SortDirection;
  onChangeSortDirection: (val: SortDirection) => void;
}> = ({
  collectionInfo = { mintPhases: [] },
  selectedTab,
  onSelectTab,
  collectionId,
  sortDirection,
  onChangeSortDirection,
}) => {
  const isMobile = useIsMobile();
  const wallet = useSelectedWallet();
  const stats = useCollectionStats(collectionId, wallet?.userId);
  const [network, collectionMintAddress] = parseCollectionId(collectionId);
  const { setToastSuccess } = useFeedbacks();

  const collectionScreenTabItems = {
    collections: {
      name: "Collection",
      badgeCount: stats?.totalSupply || 0,
    },
    ...(stats?.owned
      ? {
          owned: {
            name: "Owned",
            badgeCount: stats.owned,
          },
        }
      : {}),
    activity: {
      name: "Activity",
    },
    // this will be later for a "bid" system
    // offers: {
    //   name: "Offers",
    // },
  };

  // functions
  const onShare = () => {
    let currentUrl;
    if (Platform.OS === "web") {
      currentUrl = window?.location.href;
    }

    try {
      Clipboard.setStringAsync(currentUrl || "");
      setToastSuccess({
        title: "URL Copied!",
        message: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View
      style={{
        width: "100%",
        alignSelf: "center",
        marginTop: layout.spacing_x4,
      }}
    >
      <View
        style={{
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          width: "100%",
          marginBottom: layout.spacing_x4,
          borderRadius: layout.spacing_x2,
          borderColor: neutral33,
          borderWidth: 1,
          padding: layout.spacing_x4,
          borderStyle: "solid",
        }}
      >
        <RoundedGradientImage
          sourceURI={collectionInfo.image}
          style={{ marginRight: isMobile ? 0 : 24 }}
        />
        <View style={{ flex: 1 }}>
          <BrandText
            style={[
              fontSemibold28,
              isMobile
                ? {
                    marginTop: layout.spacing_x1,
                    textAlign: "center",
                  }
                : {},
            ]}
          >
            {collectionInfo.name || "Loading..."}
          </BrandText>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: isMobile ? "center" : "flex-start",
              marginTop: layout.spacing_x2_5,
              alignItems: "center",
              flex: 1,
            }}
          >
            <CollectionStat
              label="Floor"
              value={
                stats?.floorPrice?.length && network
                  ? prettyPrice(
                      network.id,
                      stats.floorPrice[0].quantity,
                      stats.floorPrice[0].denom,
                      true
                    )
                  : "-"
              }
              currencyIcon={
                stats?.floorPrice?.length && network
                  ? {
                      networkId: network.id,
                      value: 0,
                      denom: stats.floorPrice[0].denom,
                    }
                  : undefined
              }
            />
            <SpacerRow size={1.5} />
            <CollectionStat
              label="Total Volume"
              value={
                stats?.floorPrice?.length && network
                  ? prettyPrice(
                      network.id,
                      parseFloat(stats.totalVolume).toFixed(0),
                      stats.floorPrice[0].denom,
                      true
                    )
                  : "-"
              }
              currencyIcon={
                stats?.floorPrice?.length && network
                  ? {
                      networkId: network.id,
                      value: parseFloat(stats.totalVolume),
                      denom: stats.floorPrice[0].denom,
                    }
                  : undefined
              }
            />
            <SpacerRow size={1.5} />
            {!isMobile && (
              <>
                <CollectionStat
                  label="Owners"
                  value={(stats?.owners || 0).toString()}
                />
                <SpacerRow size={1.5} />

                <CollectionStat
                  label="Listed"
                  value={(stats?.listed || 0).toString()}
                />
                <SpacerRow size={1.5} />
                <CollectionStat
                  label="Avg Sale (24hr)"
                  value={
                    stats?.floorPrice?.length && network
                      ? prettyPrice(
                          network.id,
                          stats.avgPricePeriod.toFixed(0),
                          stats.floorPrice[0].denom,
                          true
                        )
                      : "-"
                  }
                  currencyIcon={
                    stats?.floorPrice?.length && network
                      ? {
                          networkId: network.id,
                          value: stats.avgPricePeriod,
                          denom: stats.floorPrice[0].denom,
                        }
                      : undefined
                  }
                />
              </>
            )}
            <SpacerRow size={1.5} />
            <CollectionStat
              label="Total Supply"
              value={(stats?.totalSupply || 0).toString()}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: isMobile ? "center" : "flex-start",
              margin: layout.spacing_x2_5,
              alignItems: "center",
              flex: 1,
            }}
          >
            <CollectionSocialButtons collectionInfo={collectionInfo} />
            <View
              style={{
                marginTop: isMobile ? layout.spacing_x1 : 0,
                flexWrap: "nowrap",
                flexDirection: "row",
              }}
            >
              <SocialButtonSecondary
                text="Explorer"
                iconSvg={etherscanSVG}
                style={{ marginRight: 12 }}
                onPress={() => {
                  const url = contractExplorerLink(
                    network?.id,
                    collectionMintAddress
                  );
                  Linking.openURL(url);
                }}
              />
              <SocialButtonSecondary
                text="Share"
                iconSvg={shareSVG}
                onPress={onShare}
              />
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: layout.spacing_x2_5,
          flex: 10,
        }}
      >
        {selectedTab !== "activity" && (
          <FilterButton
            style={{ marginRight: 16 }}
            mainContainerStyle={{ backgroundColor: neutral33 }}
          />
        )}
        <Tabs
          items={collectionScreenTabItems}
          onSelect={onSelectTab}
          selected={selectedTab}
          style={{
            flex: 8,
            height: 48,
            paddingLeft: layout.spacing_x2,
            borderRadius: 8,
            backgroundColor: codGrayColor,
          }}
          noUnderline
        />

        {!isMobile && selectedTab !== "activity" && (
          <SortButton
            style={{ marginLeft: 16 }}
            mainContainerStyle={{ backgroundColor: neutral33 }}
            sortDirection={sortDirection}
            onChangeSortDirection={onChangeSortDirection}
          />
        )}
      </View>
    </View>
  );
};
