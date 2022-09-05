import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { DraxList, DraxView } from "react-native-drax";

import nftSvg from "../../../assets/icons/nft.svg";
import shapeSvg from "../../../assets/icons/shape.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { TextInputCustom } from "../../components/inputs/TextInputCustom";
import { neutral33, neutral77 } from "../../utils/style/colors";
import CollectionItem from "./CollectionItem";

export const fakeNft = [
  {
    id: "0",
    name: "NFT name #4554",
    svg: nftSvg,
  },
  {
    id: "1",
    name: "NFT name #4554",
    svg: nftSvg,
  },
  {
    id: "2",
    name: "NFT name #4554",
    svg: nftSvg,
  },
  {
    id: "3",
    name: "NFT name #4554",
    svg: nftSvg,
  },
  {
    id: "4",
    name: "NFT name #4554",
    svg: nftSvg,
  },
  {
    id: "5",
    name: "NFT name #4554",
    svg: nftSvg,
  },
  {
    id: "6",
    name: "NFT name #4554",
    svg: nftSvg,
  },
  {
    id: "7",
    name: "NFT name #4554",
    svg: nftSvg,
  },
  {
    id: "8",
    name: "NFT name #4554",
    svg: nftSvg,
  },
  {
    id: "9",
    name: "NFT name #4554",
    svg: nftSvg,
  },
  {
    id: "10",
    name: "NFT name #4554",
    svg: nftSvg,
  },
];

const SelectNewNft: React.FC<{
  nftCollectionId: string;
  setNftCollectionId: (text: string) => void;
  searchNft: string;
  setSearchNft: (text: string) => void;
  newNftCollections: any[];
}> = ({
  nftCollectionId,
  setNftCollectionId,
  searchNft,
  setSearchNft,
  newNftCollections,
}) => {
  const currentCollection = newNftCollections.find(
    (collection) => collection.id === nftCollectionId
  );

  return (
    <>
      <View style={{ width: 220 }}>
        <BrandText style={{ fontSize: 14, color: neutral77 }}>
          Collection
        </BrandText>
        <CollectionItem collection={currentCollection} />
        <View
          style={{
            height: 1,
            backgroundColor: neutral33,
            marginVertical: 20,
          }}
        />
      </View>
      <DraxList
        data={fakeNft}
        renderItemContent={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <ListHeaderComponent
            setNftCollectionId={setNftCollectionId}
            searchNft={searchNft}
            setSearchNft={setSearchNft}
          />
        }
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        getItemLayout={getItemLayout}
        contentContainerStyle={{ height: 716, width: 220 }}
      />
    </>
  );
};

const renderItem = ({ item }) => (
  <View style={{ width: 104, marginTop: 12 }}>
    <DraxView
      onDragStart={() => {
        console.log("start drag id", item.id);
      }}
      animateSnapback={false}
      dragPayload={item.id}
      draggingStyle={{ opacity: 0.5 }}
    >
      <Image style={{ width: 104, height: 104 }} source={item.svg} />
    </DraxView>
    <BrandText
      numberOfLines={1}
      ellipsizeMode="tail"
      style={{ fontSize: 13, marginTop: 8 }}
    >
      {item.name}
    </BrandText>
  </View>
);

const keyExtractor = ({ id }) => id;

const ListHeaderComponent: React.FC<{
  setNftCollectionId: (text: string) => void;
  searchNft: string;
  setSearchNft: (text: string) => void;
}> = ({ setNftCollectionId, searchNft, setSearchNft }) => {
  return (
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
        <BrandText style={{ fontSize: 14 }}>Choose NFT Artwork</BrandText>
      </View>
      <TextInputCustom
        style={{ minWidth: 220, minHeight: 40 }}
        label=""
        placeHolder="Search"
        value={searchNft}
        onChangeText={setSearchNft}
      />
    </>
  );
};

const getItemLayout = (_: any, index: number) => ({
  length: 130,
  offset: (130 + 12) * index,
  index,
});

export default SelectNewNft;
