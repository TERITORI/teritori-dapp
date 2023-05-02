import React, { ReactElement, useCallback } from "react";
import { FlatList, View } from "react-native";

import { NFTView } from "./NFTView";
import { NFT, NFTsRequest } from "../../api/marketplace/v1/marketplace";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useNFTs } from "../../hooks/useNFTs";
import { setSelectedNFT } from "../../store/slices/marketplaceReducer";
import { useAppDispatch } from "../../store/store";
import { layout, screenContentMaxWidthLarge } from "../../utils/style/layout";
import { SpacerColumn } from "../spacer";

const keyExtractor = (item: NFT) => item.id;

const RenderItem: React.FC<{
  nft: NFT;
  marginable: boolean;
  handleClick: (id: string) => void;
}> = ({ nft, marginable, handleClick }) => {
  return (
    <NFTView
      key={nft.mintAddress}
      data={nft}
      handleClick={handleClick}
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
  const dispatch = useAppDispatch();
  const { height } = useMaxResolution();

  const handleEndReached = useCallback(() => {
    fetchMore();
  }, [fetchMore]);

  const handleClick = (id: string) => {
    dispatch(setSelectedNFT(id));
  };

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
        columnWrapperStyle={{ flexWrap: "wrap", flex: 1, marginTop: 5 }}
        numColumns={99} // needed to deal with wrap via css
        ItemSeparatorComponent={() => (
          <View style={{ height: layout.padding_x1 }} />
        )}
        key={numColumns}
        data={nfts}
        onEndReached={handleEndReached}
        keyExtractor={keyExtractor}
        // onEndReachedThreshold={4}
        renderItem={(info) => {
          return (
            <RenderItem
              nft={info.item}
              marginable={!!((info.index + 1) % numColumns)}
              handleClick={handleClick}
            />
          );
        }}
        //ListHeaderComponent={ListHeaderComponent}
        //ListFooterComponent={ListFooterComponent}
        removeClippedSubviews
      />
    </View>
  );
};
