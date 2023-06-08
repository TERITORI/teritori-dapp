import React, { useCallback } from "react";
import { FlatList, View } from "react-native";

import { NFTView } from "./NFTView";
import { NFT, NFTsRequest } from "../../api/marketplace/v1/marketplace";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useNFTs } from "../../hooks/useNFTs";
import {
  AppliedFilters,
  SideFilters,
  useShowFilters,
} from "../../screens/Marketplace/SideFilters";
import { neutral00, neutral33 } from "../../utils/style/colors";
import { fontSemibold20 } from "../../utils/style/fonts";
import { layout, screenContentMaxWidthLarge } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SpacerColumn } from "../spacer";

const keyExtractor = (item: NFT) => item.id;

export const NFTs: React.FC<{
  req: NFTsRequest;
  hideFilters?: boolean;
}> = ({ req, hideFilters = false }) => {
  const { nfts, fetchMore } = useNFTs(req);

  const { height } = useMaxResolution({ isLarge: true });
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
      {!hideFilters && <AppliedFilters collectionId={req.collectionId} />}
      <View style={{ flexDirection: "row", width: "100%" }}>
        {!hideFilters && (
          <SideFilters
            collectionId={req.collectionId}
            style={{
              left: 0,
              flexDirection: "column",
              width: 245,
              marginBottom: layout.padding_x2_5,
              backgroundColor: neutral00,
              borderRadius: layout.padding_x2,
              borderColor: neutral33,
              borderWidth: 1,
              height,
              padding: layout.padding_x2,
              borderStyle: "solid",
            }}
          />
        )}
        <FlatList
          style={{
            width: "100%",
            marginLeft: filterIsShown ? layout.padding_x1_5 : 0,
          }}
          contentContainerStyle={{
            maxWidth: screenContentMaxWidthLarge,
            maxHeight: height,
          }}
          showsHorizontalScrollIndicator={false}
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
          renderItem={(info) => (
            <NFTView
              key={info.item.mintAddress}
              data={info.item}
              style={{
                marginRight: layout.padding_x2,
                marginBottom: layout.padding_x2,
              }}
            />
          )}
          removeClippedSubviews
        />
      </View>
    </View>
  );
};
