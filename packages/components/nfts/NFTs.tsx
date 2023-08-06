import React, { useCallback, useState } from "react";
import { FlatList, View } from "react-native";

import { NFTView } from "./NFTView";
import { NFT, NFTsRequest } from "../../api/marketplace/v1/marketplace";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useNFTs } from "../../hooks/useNFTs";
import {
  AppliedFilters,
  SideFilters,
} from "../../screens/Marketplace/SideFilters";
import { neutral00, neutral33 } from "../../utils/style/colors";
import { fontSemibold20 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SpacerColumn } from "../spacer";

const keyExtractor = (item: NFT) => item.id;

const halfGap = layout.padding_x1;

export const minNFTWidth = 250;

export const NFTs: React.FC<{
  req: NFTsRequest;
  hideFilters?: boolean;
}> = ({ req, hideFilters = false }) => {
  const { nfts, fetchMore } = useNFTs(req);

  const { height } = useMaxResolution({ isLarge: true });
  const [containerWidth, setContainerWidth] = useState(0);
  const elemsPerRow = Math.floor(containerWidth / minNFTWidth) || 1;
  const elemSize = elemsPerRow
    ? (containerWidth - halfGap * (elemsPerRow - 1) * 2) / elemsPerRow
    : nfts?.length || 0;

  let padded: NFT[] = nfts;
  if (nfts.length % elemsPerRow !== 0 && elemsPerRow > 1) {
    const padding = Array(elemsPerRow - (nfts.length % elemsPerRow))
      .fill(undefined)
      .map((_, i) => {
        const n: NFT = {
          id: `padded-${i}`,
          networkId: "",
          imageUri: "",
          name: "",
          mintAddress: "",
          price: "",
          denom: "",
          isListed: false,
          textInsert: "",
          collectionName: "",
          ownerId: "",
          nftContractAddress: "",
          lockedOn: "",
          attributes: [],
        };
        return n;
      });
    padded = nfts.concat(padding);
  }

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
              borderRadius: layout.padding_x2,
              borderColor: neutral33,
              borderWidth: 1,
              height,
              padding: layout.padding_x2,
              borderStyle: "solid",
              marginRight: layout.padding_x1_5,
            }}
          />
        )}
        <FlatList
          onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
          style={{ width: "100%" }}
          contentContainerStyle={{ maxHeight: height }}
          columnWrapperStyle={
            elemsPerRow < 2
              ? undefined
              : { flex: 1, justifyContent: "space-between" }
          }
          numColumns={elemsPerRow}
          ItemSeparatorComponent={() => <SpacerColumn size={2} />}
          key={`nft-flat-list-${elemsPerRow}`}
          data={padded}
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
                width: elemSize,
              }}
            />
          )}
        />
      </View>
    </View>
  );
};
