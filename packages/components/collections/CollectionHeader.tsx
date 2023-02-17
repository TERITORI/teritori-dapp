import { Decimal } from "@cosmjs/math";
import Clipboard from "@react-native-clipboard/clipboard";
import React, { useMemo } from "react";
import { View, Image, Platform, StyleSheet, Linking } from "react-native";

import bannerCollection from "../../../../assets/default-images/banner-collection.png";
import etherscanSVG from "../../../../assets/icons/etherscan.svg";
import shareSVG from "../../../../assets/icons/share.svg";
import {
  NFTsRequest,
  Sort,
  SortDirection,
} from "../../api/marketplace/v1/marketplace";
import { BrandText } from "../../components/BrandText";
import { ActivityTable } from "../../components/activity/ActivityTable";
import { PrimaryBox } from "../../components/boxes/PrimaryBox";
import { SocialButtonSecondary } from "../../components/buttons/SocialButtonSecondary";
import { CollectionSocialButtons } from "../../components/collections/CollectionSocialButtons";
import { Footer } from "../../components/footers/Footer";
import { RoundedGradientImage } from "../../components/images/RoundedGradientImage";
import { NFTs } from "../../components/nfts/NFTs";
import { SortButton } from "../../components/sorts/SortButton";
import { SpacerRow } from "../../components/spacer";
import { Tabs } from "../../components/tabs/Tabs";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useCoingeckoPrices } from "../../hooks/useCoingeckoPrices";
import { CollectionInfo } from "../../hooks/useCollectionInfo";
import { useCollectionStats } from "../../hooks/useCollectionStats";
import { useImageResizer } from "../../hooks/useImageResizer";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getNativeCurrency } from "../../networks";
import { alignDown } from "../../utils/align";
import { neutral33 } from "../../utils/style/colors";
import { fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { CollectionStat } from "./CollectionStat";
import { TabsListType } from "./types";
const nftWidth = 268; // FIXME: ssot

export const Content: React.FC<{
  id: string;
  selectedTab: TabsListType;
  sortDirection: SortDirection;
}> = React.memo(({ id, selectedTab, sortDirection }) => {
  const wallet = useSelectedWallet();
  const selectedNetworkId = useSelectedNetworkId();

  const { width } = useMaxResolution();
  const numColumns = Math.floor(width / nftWidth);

  const nftsRequest: NFTsRequest = {
    networkId: selectedNetworkId,
    collectionId: id,
    ownerId:
      selectedTab === "owned" && wallet?.address
        ? `tori-${wallet.address}`
        : "",
    limit: alignDown(20, numColumns) || numColumns,
    offset: 0,
    sort: Sort.SORTING_PRICE,
    sortDirection,
  };

  switch (selectedTab) {
    case "allNFTs":
    case "owned":
      return (
        <NFTs
          key={selectedTab}
          req={nftsRequest}
          numColumns={numColumns}
          ListFooterComponent={<Footer />}
        />
      );
    case "activity":
      return <ActivityTable collectionId={id} />;
  }
});

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
  const wallet = useSelectedWallet();
  // variables
  const stats = useCollectionStats(collectionId, wallet?.address);
  const { width: maxWidth } = useMaxResolution();
  const { width, height } = useImageResizer({
    image: collectionInfo.bannerImage || bannerCollection,
    maxSize: { width: maxWidth },
  });
  const { setToastSuccess } = useFeedbacks();
  const networkId = useSelectedNetworkId();

  const coins = useMemo(() => {
    if (!stats?.floorPrice) {
      return [];
    }
    return stats.floorPrice.map((fp) => ({
      networkId,
      denom: fp.denom,
    }));
  }, [networkId, stats?.floorPrice]);

  const { prices } = useCoingeckoPrices(coins);

  const collectionScreenTabItems = {
    allNFTs: {
      name: "All NFTs",
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
  };

  const usdFloorPrice = useMemo(() => {
    if (!stats?.floorPrice || stats.floorPrice.length < 1) {
      return Infinity;
    }
    return [...stats.floorPrice]
      .map((fp) => {
        const currency = getNativeCurrency(networkId, fp.denom);
        if (!currency) {
          return Infinity;
        }
        const id = currency.coingeckoId;
        const usdValue = id && prices[id]?.usd;
        if (!usdValue) {
          return Infinity;
        }

        return (
          usdValue *
          Decimal.fromAtomics(
            fp.quantity,
            currency.decimals
          ).toFloatApproximation()
        );
      })
      .sort((a, b) => {
        return b - a;
      })[0];
  }, [prices, stats?.floorPrice, networkId]);

  // functions
  const onShare = () => {
    let currentUrl;
    if (Platform.OS === "web") {
      currentUrl = window.location.href;
    }

    try {
      Clipboard.setString(currentUrl || "");
      setToastSuccess({
        title: "URL Copied!",
        message: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  // returns
  return (
    <View style={{ maxWidth: width, alignSelf: "center" }}>
      <Image
        source={
          collectionInfo.bannerImage
            ? { uri: collectionInfo.bannerImage }
            : bannerCollection
        }
        style={{
          height,
          width,
          marginBottom: layout.contentPadding,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          marginBottom: 24,
        }}
      >
        <RoundedGradientImage
          imageSource={{ uri: collectionInfo.image }}
          style={{ marginRight: 24 }}
        />
        <View style={{ flex: 1 }}>
          <BrandText style={fontSemibold28}>{collectionInfo.name}</BrandText>
          <View style={styles.statRow}>
            <CollectionStat
              label="Floor"
              value={
                usdFloorPrice === Infinity
                  ? "-"
                  : `$${usdFloorPrice.toFixed(2)}`
              }
            />
            <SpacerRow size={1.5} />
            <CollectionStat
              label="Total Volume"
              value={
                stats?.totalVolume
                  ? "$" + parseFloat(stats.totalVolume).toFixed(2)
                  : "$0"
              }
            />
            <SpacerRow size={1.5} />
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
              label="Total Supply"
              value={(stats?.totalSupply || 0).toString()}
            />
          </View>
          <View style={styles.statRow}>
            <CollectionSocialButtons collectionInfo={collectionInfo} />
            {collectionInfo.discord ||
            collectionInfo.twitter ||
            collectionInfo.website ? (
              <View
                style={{
                  height: 24,
                  width: 1,
                  backgroundColor: neutral33,
                  marginRight: 12,
                }}
              />
            ) : null}
            <SocialButtonSecondary
              text="Explorer"
              iconSvg={etherscanSVG}
              style={{ marginRight: 12 }}
              onPress={() => {
                const url = (
                  process.env.TERITORI_CONTRACT_EXPLORER_URL || ""
                ).replace("$address", collectionId.replace("tori-", ""));
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

      <PrimaryBox
        mainContainerStyle={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingRight: 8,
          paddingLeft: 20,
        }}
        fullWidth
        height={64}
        style={{ marginBottom: 24 }}
      >
        <Tabs
          items={collectionScreenTabItems}
          onSelect={onSelectTab}
          selected={selectedTab}
          style={{
            width: "fit-content",
            height: "100%",
            borderBottomWidth: 0,
          }}
        />
        <SortButton
          sortDirection={sortDirection}
          onChangeSortDirection={onChangeSortDirection}
        />
      </PrimaryBox>
    </View>
  );
};

const styles = StyleSheet.create({
  statRow: {
    flexDirection: "row",
    marginTop: layout.padding_x2_5,
    alignItems: "center",
    flex: 1,
  },
});
