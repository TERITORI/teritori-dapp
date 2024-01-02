import React, { useCallback } from "react";
import { View } from "react-native";

import { NFTView } from "./NFTView";
import { NFT, NFTsRequest } from "../../api/marketplace/v1/marketplace";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useNFTs } from "../../hooks/useNFTs";
import {
  AppliedFilters,
  SideFilters,
} from "../../screens/Marketplace/SideFilters";
import { neutral00, neutral33 } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { GridList } from "../layout/GridList";

const keyExtractor = (item: NFT) => item.id;

export const NFTs: React.FC<{
  req: NFTsRequest;
  hideFilters?: boolean;
}> = ({ req, hideFilters = false }) => {
  const { nfts, fetchMore } = useNFTs(req);

  const { height } = useMaxResolution({ isLarge: true });

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
              backgroundColor: neutral00,
              borderRadius: layout.spacing_x2,
              borderColor: neutral33,
              borderWidth: 1,
              height,
              padding: layout.spacing_x2,
              borderStyle: "solid",
              marginRight: layout.spacing_x1_5,
            }}
          />
        )}
        <GridList<NFT>
          data={nfts}
          onEndReached={handleEndReached}
          keyExtractor={keyExtractor}
          renderItem={(info, elemWidth) => (
            <NFTView
              key={info.item.id}
              data={info.item}
              style={{ width: elemWidth }}
            />
          )}
          minElemWidth={250}
          gap={layout.spacing_x2}
        />
      </View>
    </View>
  );
};
