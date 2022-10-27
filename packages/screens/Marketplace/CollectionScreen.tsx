import Clipboard from "@react-native-clipboard/clipboard";
import React, { useEffect, useState } from "react";
import { View, Image, Platform, StyleSheet } from "react-native";

import bannerCollection from "../../../assets/default-images/banner-collection.png";
import etherscanSVG from "../../../assets/icons/etherscan.svg";
import shareSVG from "../../../assets/icons/share.svg";
import { NFTsRequest } from "../../api/marketplace/v1/marketplace";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { PrimaryBox } from "../../components/boxes/PrimaryBox";
import { SocialButtonSecondary } from "../../components/buttons/SocialButtonSecondary";
import { CollectionSocialButtons } from "../../components/collections/CollectionSocialButtons";
import { RoundedGradientImage } from "../../components/images/RoundedGradientImage";
import { BackTo } from "../../components/navigation/BackTo";
import { NFTs } from "../../components/nfts/NFTs";
import { SortButton } from "../../components/sorts/SortButton";
import { SpacerRow } from "../../components/spacer";
import { Tabs } from "../../components/tabs/Tabs";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import {
  CollectionInfo,
  useCollectionInfo,
} from "../../hooks/useCollectionInfo";
import { useImageResizer } from "../../hooks/useImageResizer";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { alignDown } from "../../utils/align";
import { ScreenFC } from "../../utils/navigation";
import { neutral33 } from "../../utils/style/colors";
import { fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { CollectionStat } from "./components/CollectionStat";

const collectionScreenTabItems = {
  allNFTs: {
    name: "All NFTs",
    badgeCount: 5760,
  },
  owned: {
    name: "Owned",
    badgeCount: 87,
  },
  activity: {
    name: "Activity",
  },
  offers: {
    name: "Offers",
  },
};

const nftWidth = 268; // FIXME: ssot

// All the screen content before the Flatlist used to display NFTs
const FlatListHeader: React.FC<{
  collectionInfo: CollectionInfo;
}> = ({ collectionInfo = {} }) => {
  // variables
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof collectionScreenTabItems>("allNFTs");
  const { width: maxWidth } = useMaxResolution();
  const { width, height } = useImageResizer({
    image: collectionInfo.bannerImage || bannerCollection,
    maxSize: { width: maxWidth },
  });
  const { setToastSuccess } = useFeedbacks();

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
          collectionInfo?.bannerImage
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
            <CollectionStat label="Floor" value="7.48" addLogo />
            <SpacerRow size={1.5} />
            <CollectionStat label="Total Volume" value="51803.25" addLogo />
            <SpacerRow size={1.5} />
            <CollectionStat label="Owners" value="2,583" />
            <SpacerRow size={1.5} />
            <CollectionStat label="Listed" value="850" />
            <SpacerRow size={1.5} />
            <CollectionStat label="Avg Sale (24hr)" value="17.20" addLogo />
            <SpacerRow size={1.5} />
            <CollectionStat label="Total Supply" value="7.5K" addLogo />
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
              text="Contract Address"
              iconSvg={etherscanSVG}
              style={{ marginRight: 12 }}
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
          onSelect={setSelectedTab}
          selected={selectedTab}
          style={{
            width: "fit-content",
            height: "100%",
            borderBottomWidth: 0,
          }}
        />
        <SortButton />
      </PrimaryBox>
    </View>
  );
};

const Content: React.FC<{ id: string }> = React.memo(({ id }) => {
  const {
    info,
    // notFound,
    loading: loadingCollectionInfo,
  } = useCollectionInfo(id);

  const { setLoadingFullScreen } = useFeedbacks();

  const { width } = useMaxResolution();
  const numColumns = Math.floor(width / nftWidth);

  const nftsRequest: NFTsRequest = {
    collectionId: id,
    ownerId: "",
    limit: alignDown(20, numColumns) || numColumns,
    offset: 0,
  };

  useEffect(() => {
    setLoadingFullScreen(loadingCollectionInfo);
  }, [loadingCollectionInfo]);

  return (
    <NFTs
      req={nftsRequest}
      numColumns={numColumns}
      ListHeaderComponent={<FlatListHeader collectionInfo={info} />}
      ListFooterComponent={<View style={{ height: layout.contentPadding }} />}
    />
  );
});

export const CollectionScreen: ScreenFC<"Collection"> = ({ route }) => {
  return (
    <ScreenContainer
      noMargin
      noScroll
      headerChildren={<BackTo label="Collection Profile" />}
    >
      <Content key={route.params.id} id={route.params.id} />
    </ScreenContainer>
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
