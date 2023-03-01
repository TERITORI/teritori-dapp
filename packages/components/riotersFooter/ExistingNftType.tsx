import React, { memo } from "react";
import { Image, TouchableOpacity, View } from "react-native";

import addSvg from "../../../assets/icons/add-circle.svg";
import nftPlaceholderImg from "../../../assets/icons/nft.png";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { neutral33, neutral77 } from "../../utils/style/colors";

const fakeNft = [
  {
    id: "0",
    name: "NFT name #4554",
    image: nftPlaceholderImg,
  },
  {
    id: "1",
    name: "NFT name #4554",
    image: nftPlaceholderImg,
  },
  {
    id: "2",
    name: "NFT name #4554",
    image: nftPlaceholderImg,
  },
  {
    id: "3",
    name: "NFT name #4554",
    image: nftPlaceholderImg,
  },
  {
    id: "4",
    name: "NFT name #4554",
    image: nftPlaceholderImg,
  },
  {
    id: "5",
    name: "NFT name #4554",
    image: nftPlaceholderImg,
  },
  {
    id: "6",
    name: "NFT name #4554",
    image: nftPlaceholderImg,
  },
  {
    id: "7",
    name: "NFT name #4554",
    image: nftPlaceholderImg,
  },
  {
    id: "8",
    name: "NFT name #4554",
    image: nftPlaceholderImg,
  },
  {
    id: "9",
    name: "NFT name #4554",
    image: nftPlaceholderImg,
  },
  {
    id: "10",
    name: "NFT name #4554",
    image: nftPlaceholderImg,
  },
];

const ExistingNftType: React.FC = memo(() => {
  return !fakeNft || fakeNft.length === 0 ? (
    <>
      <BrandText style={{ fontSize: 14, marginTop: 20, color: neutral77 }}>
        You don’t have any added NFT yet
      </BrandText>

      <TouchableOpacity
        style={{
          marginTop: 20,
          alignItems: "center",
          flexDirection: "row",
        }}
        onPress={() => {
          console.log("add nft");
        }}
      >
        <SVG
          width={32}
          height={32}
          source={addSvg}
          style={{ marginRight: 12 }}
        />
        <BrandText style={{ fontSize: 14 }}>Add NFT</BrandText>
      </TouchableOpacity>
    </>
  ) : (
    <>
      {fakeNft.map((nft, index) => (
        <View style={{ marginTop: 16 }}>
          {index !== 0 && (
            <View
              style={{
                height: 1,
                backgroundColor: neutral33,
                marginTop: 16,
                marginBottom: 20,
              }}
            />
          )}
          <BrandText style={{ fontSize: 14 }}>{nft.name}</BrandText>
          <Image
            source={nft.image}
            style={{
              height: 220,
              width: 220,
              marginTop: 16,
            }}
          />
        </View>
      ))}
    </>
  );
});

export default ExistingNftType;
