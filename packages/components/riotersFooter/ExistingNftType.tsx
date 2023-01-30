import React, { memo } from "react";
import { TouchableOpacity, View } from "react-native";

import addSvg from "../../../assets/icons/add-circle.svg";
import nftSvg from "../../../assets/icons/nft.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
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
          <SVG
            width={220}
            height={220}
            source={nft.svg}
            style={{ marginTop: 16 }}
          />
        </View>
      ))}
    </>
  );
});

export default ExistingNftType;
