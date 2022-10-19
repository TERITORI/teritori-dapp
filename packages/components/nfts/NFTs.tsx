import React, { ReactElement, useEffect } from "react";
import { FlatList, View, ViewStyle } from "react-native";

import { NFT, NFTsRequest } from "../../api/marketplace/v1/marketplace";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useNFTs } from "../../hooks/useNFTs";
import { layout } from "../../utils/style/layout";
import { SpacerColumn } from "../spacer";
import { NFTView } from "./NFTView";

const keyExtractor = (item: NFT) => item.mintAddress;

const RenderItem: React.FC<{
  nft: NFT;
  marginable: boolean;
}> = ({ nft, marginable }) => {
  return (
    <NFTView
      key={nft.mintAddress}
      data={nft}
      style={{ marginRight: marginable ? layout.padding_x2 : 0 }}
    />
  );
};

export const NFTs: React.FC<{
  req: NFTsRequest;
  numColumns: number;
  ListHeaderComponent?: ReactElement;
  ListFooterComponent?: ReactElement;
}> = ({ req, numColumns, ListHeaderComponent, ListFooterComponent }) => {
  const { nfts, fetchMore, firstLoading: firstLoadingNTFs } = useNFTs(req);

  const { setLoadingFullScreen } = useFeedbacks();

  const viewStyle: ViewStyle = {
    height: "100%",
    alignItems: "center",
    flex: 1,
  };

  // Sync loadingFullScreen
  useEffect(() => {
    setLoadingFullScreen(firstLoadingNTFs);
  }, [firstLoadingNTFs]);

  return (
    <View style={viewStyle}>
      <FlatList
        key={numColumns}
        data={nfts}
        numColumns={numColumns}
        onEndReached={fetchMore}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={4}
        renderItem={(info) => (
          <RenderItem
            nft={info.item}
            marginable={!!((info.index + 1) % numColumns)}
          />
        )}
        ItemSeparatorComponent={() => <SpacerColumn size={2} />}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
      />
    </View>
  );
};
