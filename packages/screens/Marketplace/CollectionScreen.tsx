import React, { useEffect, useState } from "react";
import { View, Image } from "react-native";

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
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof collectionScreenTabItems>("allNFTs");
  const { width: maxWidth } = useMaxResolution();
  const { width, height } = useImageResizer({
    image: bannerCollection,
    maxSize: { width: maxWidth },
  });

  return (
    <View style={{ maxWidth: width, alignSelf: "center" }}>
      <Image
        source={bannerCollection}
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
        <View>
          <BrandText style={fontSemibold28}>{collectionInfo.name}</BrandText>
          <View
            style={{
              flexDirection: "row",
              marginTop: 16,
              alignItems: "center",
            }}
          >
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
            <SocialButtonSecondary text="Share" iconSvg={shareSVG} />
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
  });
  const { setLoadingFullScreen } = useFeedbacks();

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
