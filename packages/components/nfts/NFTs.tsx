import React, { ReactElement, useCallback } from "react";
import { FlatList, View } from "react-native";
import { useSelector } from "react-redux";

import { NFTView } from "./NFTView";
import { NFT, NFTsRequest } from "../../api/marketplace/v1/marketplace";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useNFTs } from "../../hooks/useNFTs";
import { selectSelectedNFTIds } from "../../store/slices/marketplaceReducer";
import { layout, screenContentMaxWidthLarge } from "../../utils/style/layout";
import { SpacerColumn } from "../spacer";

const keyExtractor = (item: NFT) => item.id;

const RenderItem: React.FC<{
  nft: NFT;
}> = ({ nft }) => {
  return (
    <NFTView
      key={nft.mintAddress}
      data={nft}
      style={{
        marginRight: layout.padding_x2,
        marginBottom: layout.padding_x2,
      }}
    />
  );
};

export const NFTs: React.FC<{
  req: NFTsRequest;
  ListHeaderComponent?: ReactElement;
  ListFooterComponent?: ReactElement;
}> = ({ req, ListHeaderComponent, ListFooterComponent }) => {
  const { nfts, fetchMore } = useNFTs(req);
  const { height } = useMaxResolution();
  const selected = useSelector(selectSelectedNFTIds);

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
        style={{ width: "75%", marginLeft: selected.length ? 310 : 250 }}
        contentContainerStyle={{
          maxWidth: screenContentMaxWidthLarge,
          alignSelf: "center",
        }}
        columnWrapperStyle={{ flexWrap: "wrap", flex: 1, marginTop: 5 }}
        numColumns={99} // needed to deal with wrap via css
        ItemSeparatorComponent={() => <SpacerColumn size={2} />}
        key="nft-flat-list"
        data={nfts}
        onEndReached={handleEndReached}
        keyExtractor={keyExtractor}
        // onEndReachedThreshold={4}
        renderItem={(info) => {
          return <RenderItem nft={info.item} />;
        }}
        //ListHeaderComponent={ListHeaderComponent}
        //ListFooterComponent={ListFooterComponent}
        removeClippedSubviews
      />
    </View>
  );
};
