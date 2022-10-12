import React, { useCallback, useEffect, useState } from "react";
import {
  ListRenderItem,
  FlatList,
  LayoutChangeEvent,
  View,
  ViewStyle,
  Image,
} from "react-native";

import bannerCollection from "../../../assets/default-images/banner-collection.png";
import etherscanSVG from "../../../assets/icons/etherscan.svg";
import shareSVG from "../../../assets/icons/share.svg";
import { NFT } from "../../api/marketplace/v1/marketplace";
import { BrandText } from "../../components/BrandText";
import { NFTView } from "../../components/NFTView";
import { ScreenContainer } from "../../components/ScreenContainer";
import { PrimaryBox } from "../../components/boxes/PrimaryBox";
import { SocialButtonSecondary } from "../../components/buttons/SocialButtonSecondary";
import { CollectionSocialButtons } from "../../components/collections/CollectionSocialButtons";
import { RoundedGradientImage } from "../../components/images/RoundedGradientImage";
import { BackTo } from "../../components/navigation/BackTo";
import { SortButton } from "../../components/sorts/SortButton";
import { TabItem, Tabs, useTabs } from "../../components/tabs/Tabs";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import {
  CollectionInfo,
  useCollectionInfo,
} from "../../hooks/useCollectionInfo";
import { useCollectionNFTs } from "../../hooks/useCollectionNFTs";
import { prettyPrice } from "../../utils/coins";
import { ScreenFC } from "../../utils/navigation";
import { Network } from "../../utils/network";
import { neutral33 } from "../../utils/style/colors";
import { fontSemibold28 } from "../../utils/style/fonts";
import { layout, screenContentMaxWidth } from "../../utils/style/layout";
import { alignDown } from "../../utils/align";

const collectionScreenTabItems: TabItem[] = [
  {
    label: "Owned",
    isSelected: true,
    badgeCount: 87,
  },
  {
    label: "Collections",
    badgeCount: 5760,
  },
  {
    label: "Activity",
  },
  {
    label: "Offers",
  },
];

const keyExtractor = (item: NFT) => item.mintAddress;

// ====== Style =====
const gap = 20;
const nftWidth = 268 + gap * 2; // FIXME: ssot

const viewStyle: ViewStyle = {
  height: "100%",
  alignItems: "center",
};

// ====== Components =====
const ItemSeparator: React.FC = () => <View style={{ height: gap }} />;

const renderItem: ListRenderItem<NFT> = (info) => {
  const nft = info.item;
  return (
    <NFTView
      key={nft.mintAddress}
      data={{
        network: Network.Solana, // FIXME
        name: nft.name,
        owned: false,
        imageURI: nft.imageUri,
        collectionName: "Collection",
        collectionId: "TODO",
        collectionDiscriminator: "TODO",
        isCertified: true,
        floorPrice: nft.isListed ? prettyPrice(nft.price, nft.denom) : "",
        favoritesCount: 420,
        id: nft.id,
      }}
      style={{ marginHorizontal: gap / 2 }}
    />
  );
};

// All the screen content before the Flatlist used to display NFTs
const FlatListHeader: React.FC<{
  collectionInfo: CollectionInfo;
}> = ({ collectionInfo = {} }) => {
  const { onPressTabItem, tabItems } = useTabs(collectionScreenTabItems);
  return (
    <View style={{ maxWidth: screenContentMaxWidth }}>
      <Image
        source={bannerCollection}
        style={{
          height: 311,
          width: screenContentMaxWidth,
          marginBottom: 42,
          marginTop: 7,
        }}
      />

      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}
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
            <View
              style={{
                height: 24,
                width: 1,
                backgroundColor: neutral33,
                marginRight: 12,
              }}
            />
            <SocialButtonSecondary
              text="Etherscan"
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
          paddingHorizontal: 8,
        }}
        fullWidth
        height={64}
        style={{ marginBottom: 24 }}
      >
        <Tabs
          items={tabItems}
          onPressTabItem={onPressTabItem}
          style={{
            width: "fit-content",
            height: "100%",
            paddingTop: layout.padding_x2_5,
            borderBottomWidth: 0,
          }}
        />
        <SortButton />
      </PrimaryBox>
    </View>
  );
};

// All the screen content after the Flatlist used to display NFTs
const FlatListFooter: React.FC = () => <View style={{ height: 100 }} />;

const CollectionNFTs: React.FC<{ id: string; numColumns: number }> = ({
  id,
  numColumns,
}) => {
  const {
    info,
    // notFound,
    loading: loadingCollectionInfo,
  } = useCollectionInfo(id);
  const {
    nfts,
    fetchMore,
    firstLoading: firstLoadingNTFs,
  } = useCollectionNFTs({
    id,
    limit: alignDown(20, numColumns) || numColumns,
    offset: 0,
  });
  const { setLoadingFullScreen } = useFeedbacks();

  // Sync loadingFullScreen
  useEffect(() => {
    setLoadingFullScreen(loadingCollectionInfo && firstLoadingNTFs);
  }, [loadingCollectionInfo, firstLoadingNTFs]);

  // TODO: Uncomment this when the collection has info AND NFTs
  // if (notFound) {
  //   return (
  //     <View style={{alignItems: "center", width: "100%", marginTop: 40}}>
  //       <BrandText>Collection not found</BrandText>
  //     </View>
  //   )
  // } else
  return (
    <FlatList
      style={{ width: "100%" }}
      contentContainerStyle={{ alignItems: "center" }}
      key={numColumns}
      data={nfts}
      numColumns={numColumns}
      ItemSeparatorComponent={ItemSeparator}
      onEndReached={fetchMore}
      keyExtractor={keyExtractor}
      onEndReachedThreshold={4}
      renderItem={renderItem}
      ListHeaderComponent={<FlatListHeader collectionInfo={info} />}
      ListFooterComponent={<FlatListFooter />}
    />
  );
};

const Content: React.FC<{ id: string }> = React.memo(({ id }) => {
  const [viewWidth, setViewWidth] = useState(0);
  const numColumns = Math.floor(viewWidth / nftWidth);

  const handleViewLayout = useCallback(
    (event: LayoutChangeEvent) => setViewWidth(event.nativeEvent.layout.width),
    []
  );

  return (
    <View style={viewStyle} onLayout={handleViewLayout}>
      {viewWidth ? <CollectionNFTs id={id} numColumns={numColumns} /> : null}
    </View>
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
