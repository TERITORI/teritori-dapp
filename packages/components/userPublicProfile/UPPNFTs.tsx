import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  LayoutChangeEvent,
  ListRenderItem,
  View,
  ViewStyle,
} from "react-native";

import { NFT } from "../../api/marketplace/v1/marketplace";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useNFTs } from "../../hooks/useNFTs";
import { alignDown } from "../../utils/align";
import { layout } from "../../utils/style/layout";
import { NFTView } from "../NFTView";
import { TabItem, Tabs, useTabs } from "../tabs/Tabs";

const tabItemsNFTs: TabItem[] = [
  { label: "Collected", isSelected: true, isDisabled: false },
  { label: "Created", isSelected: false, isDisabled: true },
  { label: "Favorited", isSelected: false, isDisabled: true },
];

const gap = 20;
const nftWidth = 268 + gap * 2; // FIXME: ssot
const viewStyle: ViewStyle = {
  height: "100%",
  alignItems: "center",
};

const keyExtractor = (item: NFT) => item.mintAddress;

const ItemSeparator: React.FC = () => <View style={{ height: gap }} />;

const renderItem: ListRenderItem<NFT> = (info) => {
  const nft = info.item;
  return (
    <NFTView
      key={nft.mintAddress}
      data={nft}
      style={{ marginHorizontal: gap / 2 }}
    />
  );
};

const UserNFTs: React.FC<{ id: string; numColumns: number }> = ({
  id,
  numColumns,
}) => {
  const {
    nfts,
    fetchMore,
    firstLoading: firstLoadingNTFs,
  } = useNFTs({
    collectionId: "",
    ownerId: `tori-${id}`,
    limit: alignDown(20, numColumns) || numColumns,
    offset: 0,
  });
  const { setLoadingFullScreen } = useFeedbacks();

  // Sync loadingFullScreen
  useEffect(() => {
    setLoadingFullScreen(firstLoadingNTFs);
  }, [firstLoadingNTFs]);

  return (
    <FlatList
      key={numColumns}
      data={nfts}
      numColumns={numColumns}
      ItemSeparatorComponent={ItemSeparator}
      onEndReached={fetchMore}
      keyExtractor={keyExtractor}
      onEndReachedThreshold={4}
      renderItem={renderItem}
      ListHeaderComponentStyle={{ alignItems: "center" }}
      ListHeaderComponent={<ItemSeparator />}
    />
  );
};

const SelectedTabContent: React.FC<{
  userAddress: string;
  selectedTabItemLabel: string;
}> = React.memo(({ userAddress, selectedTabItemLabel }) => {
  const [viewWidth, setViewWidth] = useState(0);
  const numColumns = Math.floor(viewWidth / nftWidth);

  const handleViewLayout = useCallback(
    (event: LayoutChangeEvent) => setViewWidth(event.nativeEvent.layout.width),
    []
  );

  switch (selectedTabItemLabel) {
    case "Collected":
      return (
        <View style={viewStyle} onLayout={handleViewLayout}>
          {viewWidth ? (
            <UserNFTs id={userAddress} numColumns={numColumns} />
          ) : null}
        </View>
      );
    case "Created":
      return <></>;
    case "Favorited":
      return <></>;
    default:
      return null;
  }
});

export const UPPNFTs: React.FC<{ userAddress: string }> = ({ userAddress }) => {
  const { onPressTabItem, tabItems, selectedTabItem } = useTabs(tabItemsNFTs);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 64,
          marginTop: layout.padding_x2_5 / 2,
        }}
      >
        <Tabs
          items={tabItems}
          onPressTabItem={onPressTabItem}
          style={{ width: 436, height: 44, alignSelf: "flex-end" }}
        />
      </View>

      {userAddress && (
        <SelectedTabContent
          selectedTabItemLabel={selectedTabItem.label}
          userAddress={userAddress}
          key={userAddress}
        />
      )}
    </>
  );
};
