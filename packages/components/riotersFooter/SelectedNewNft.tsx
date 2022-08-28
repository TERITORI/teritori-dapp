import React from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

import badgeSvg from "../../../assets/icons/badge.svg";
import nftSvg from "../../../assets/icons/nft.svg";
import shapeSvg from "../../../assets/icons/shape.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { TextInputCustom } from "../../components/inputs/TextInputCustom";
import { neutral33, neutral77 } from "../../utils/style/colors";

const fakeNft = [
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
  nftId: string;
  setNftId: (text: string) => void;
  searchNft: string;
  setSearchNft: (text: string) => void;
  newNftCollections: any[];
}> = ({ nftId, setNftId, searchNft, setSearchNft, newNftCollections }) => {
  const currentCollection = newNftCollections.find(
    (collection) => collection.id === nftId
  );

  return (
    <>
      <View style={{ width: 220 }}>
        <BrandText style={{ fontSize: 14, color: neutral77 }}>
          Collection
        </BrandText>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 12,
          }}
        >
          <SVG
            width={32}
            height={32}
            source={currentCollection.avatar}
            style={{ marginRight: 12 }}
          />
          <BrandText style={{ fontSize: 14, marginRight: 8 }}>
            {currentCollection.name}
          </BrandText>
          {currentCollection.badge && (
            <SVG width={16} height={16} source={badgeSvg} />
          )}
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: neutral33,
            marginTop: 16,
          }}
        />
      </View>
      <FlatList
        data={fakeNft}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <ListHeaderComponent
            setNftId={setNftId}
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
    <SVG width={104} height={104} source={item.svg} />
    <BrandText
      numberOfLines={1}
      ellipsizeMode="tail"
      style={{ fontSize: 14, marginTop: 8 }}
    >
      {item.name}
    </BrandText>
  </View>
);

const keyExtractor = ({ id }) => id;

const ListHeaderComponent: React.FC<{
  setNftId: (text: string) => void;
  searchNft: string;
  setSearchNft: (text: string) => void;
}> = ({ setNftId, searchNft, setSearchNft }) => {
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          marginTop: 20,
          marginBottom: 12,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setNftId("");
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
