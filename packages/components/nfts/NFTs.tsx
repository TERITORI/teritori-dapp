import React, { ReactElement, useCallback } from "react";
import { FlatList, View } from "react-native";

import { NFT, NFTsRequest } from "../../api/marketplace/v1/marketplace";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useNFTs } from "../../hooks/useNFTs";
import { layout, screenContentMaxWidthLarge } from "../../utils/style/layout";
import { SpacerColumn } from "../spacer";
import { NFTView } from "./NFTView";

const keyExtractor = (item: NFT) => item.id;

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
  const { nfts, fetchMore } = useNFTs(req);

  const { height } = useMaxResolution();

  const handleEndReached = useCallback(() => {
    fetchMore();
  }, [fetchMore]);

  return (
    <View
      style={{
        alignItems: "center",
        width: "100%",
        height,
      }}
    >
      <FlatList
        style={{ width: "100%" }}
        contentContainerStyle={{
          maxWidth: screenContentMaxWidthLarge,
          alignSelf: "center",
        }}
        key={numColumns}
        data={nfts}
        numColumns={numColumns}
        onEndReached={handleEndReached}
        keyExtractor={keyExtractor}
        // onEndReachedThreshold={4}
        renderItem={(info) => (
          <RenderItem
            nft={info.item}
            marginable={!!((info.index + 1) % numColumns)}
          />
        )}
        ItemSeparatorComponent={() => <SpacerColumn size={2} />}
        //ListHeaderComponent={ListHeaderComponent}
        //ListFooterComponent={ListFooterComponent}
        removeClippedSubviews
      />
    </View>
  );
};
