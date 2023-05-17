import React, { ReactElement, useCallback } from "react";
import { FlatList, View } from "react-native";

import { NFTView } from "./NFTView";
import { NFT, NFTsRequest } from "../../api/marketplace/v1/marketplace";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useNFTs } from "../../hooks/useNFTs";
import {
  AppliedFilters,
  useShowFilters,
} from "../../screens/Marketplace/SideFilters";
import { fontSemibold20 } from "../../utils/style/fonts";
import { layout, screenContentMaxWidthLarge } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
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
  const filterIsShown = useShowFilters();

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
      <AppliedFilters />
      <FlatList
        style={{
          width: filterIsShown ? "75%" : "100%",
          marginLeft: filterIsShown ? 310 : 0,
        }}
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
        ListEmptyComponent={
          <BrandText style={fontSemibold20}>No results found.</BrandText>
        }
        // onEndReachedThreshold={4}
        renderItem={(info) => {
          return <RenderItem nft={info.item} />;
        }}
        removeClippedSubviews
      />
    </View>
  );
};
