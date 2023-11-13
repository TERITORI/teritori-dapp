import React, { memo, useCallback } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { DraxList, DraxView } from "react-native-drax";

import shapeSvg from "../../../assets/icons/shape.svg";
import {
  Collection,
  NFT,
  Sort,
  SortDirection,
} from "../../api/marketplace/v1/marketplace";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { useNFTs } from "../../hooks/useNFTs";
import { alignDown } from "../../utils/align";
import { neutral33, neutral77 } from "../../utils/style/colors";
import { CollectionInfoInline } from "../collections/CollectionInfoInline";
import { TextInputCustomBorder } from "../inputs/TextInputCustomBorder";

const SelectNewNft: React.FC<{
  nftCollectionId: string;
  setNftCollectionId: (text: string) => void;
  searchNft: string;
  setSearchNft: (text: string) => void;
  currentCollection: Collection;
}> = memo(
  ({
    nftCollectionId,
    setNftCollectionId,
    searchNft,
    setSearchNft,
    currentCollection,
  }) => {
    const { nfts, fetchMore } = useNFTs({
      collectionId: nftCollectionId,
      ownerId: "",
      limit: alignDown(20, 2) || 2,
      offset: 0,
      sort: Sort.SORT_PRICE,
      sortDirection: SortDirection.SORT_DIRECTION_ASCENDING,
      attributes: [],
      isListed: false,
      priceRange: undefined,
    });

    const RenderItem: React.FC<{ item: NFT }> = useCallback(
      ({ item }) => (
        <View style={{ width: 104, marginTop: 12 }}>
          <DraxView
            onDragStart={() => {
              console.log("start drag id", JSON.stringify(item));
            }}
            animateSnapback={false}
            dragPayload={JSON.stringify(item)}
            draggingStyle={{ opacity: 0.5 }}
          >
            <Image
              style={{ width: 104, height: 104, borderRadius: 12 }}
              source={{ uri: item.imageUri }}
            />
          </DraxView>
          <BrandText
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ fontSize: 13, marginTop: 8 }}
          >
            {item.name}
          </BrandText>
        </View>
      ),
      [],
    );

    const keyExtractor = useCallback(({ name }: NFT) => name, []);

    const getItemLayout = useCallback(
      (_: any, index: number) => ({
        length: 130,
        offset: (130 + 12) * index,
        index,
      }),
      [],
    );

    return (
      <View style={{ height: "100%" }}>
        <View style={{ width: 220 }}>
          <BrandText style={{ fontSize: 14, color: neutral77 }}>
            Collection
          </BrandText>
          <View style={{ marginTop: 12 }} />
          <CollectionInfoInline
            imageSource={{ uri: currentCollection.imageUri }}
            name={currentCollection.collectionName}
            id={currentCollection.id}
          />
          <View style={styles.separator} />
        </View>
        <DraxList
          data={nfts}
          renderItemContent={RenderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={
            <>
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 12,
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setNftCollectionId("");
                  }}
                >
                  <SVG
                    width={7}
                    height={11}
                    source={shapeSvg}
                    style={{ marginRight: 33, marginLeft: 5 }}
                  />
                </TouchableOpacity>
                <BrandText style={{ fontSize: 14 }}>
                  Choose NFT Artwork
                </BrandText>
              </View>
              <TextInputCustomBorder
                style={{
                  minWidth: 20,
                  width: 220,
                  minHeight: 40,
                  borderRadius: 8,
                  backgroundColor: "black",
                }}
                placeHolder="Search"
                value={searchNft}
                onChangeText={setSearchNft}
              />
            </>
          }
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          getItemLayout={getItemLayout}
          contentContainerStyle={{ width: 220, paddingTop: 20 }}
          style={{ flex: 1 }}
          onEndReached={() => fetchMore()}
          scrollEventThrottle={16}
        />
      </View>
    );
  },
);

export default SelectNewNft;

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: neutral33,
    marginTop: 20,
  },
});
