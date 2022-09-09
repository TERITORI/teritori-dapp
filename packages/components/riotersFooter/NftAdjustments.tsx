import React, { useEffect, useState } from "react";
import { Image, View } from "react-native";

import { BrandText } from "../../components/BrandText";
import {
  neutral33,
  neutral44,
  neutral77,
  primaryColor,
  errorColor,
  neutral22,
} from "../../utils/style/colors";
import Slider from "../Slider";
import { IconButton } from "../buttons/IconButton";
import { PrimaryButton } from "../buttons/PrimaryButton";
import CollectionItem from "./CollectionItem";

const NftAdjustments: React.FC<{
  nftCollectionId: string;
  newNftCollections: any[];
  nftDrop: any;
  setNftDrop: (nftDrop: any) => void;
  nftPositions: any;
  setNftPositions: (nftPositions: any) => void;
  price: number;
  setPrice: (price: number) => void;
}> = ({
  nftCollectionId,
  newNftCollections,
  nftDrop,
  setNftDrop,
  nftPositions,
  setNftPositions,
  price,
  setPrice,
}) => {
  const [sliderValue, setSliderValue] = useState(0);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    setNftPositions({ ...nftPositions, borderRadius: percentage });
  }, [percentage]);

  useEffect(() => {
    setPercentage((Math.round((sliderValue * 100) / 220) * 2) / 2);
  }, [sliderValue]);

  const currentCollection = newNftCollections.find(
    (collection) => collection.id === nftCollectionId
  );

  return (
    <View style={{ width: 220, flex: 1 }}>
      <BrandText style={{ fontSize: 14, color: neutral77 }}>
        NFT info & adjustments
      </BrandText>
      <View
        style={{
          height: 1,
          backgroundColor: neutral33,
          marginVertical: 20,
        }}
      />
      <View>
        <BrandText style={{ fontSize: 14, color: neutral77 }}>
          Collection
        </BrandText>

        <CollectionItem collection={currentCollection} />
      </View>
      <View
        style={{
          height: 1,
          backgroundColor: neutral33,
          marginVertical: 20,
        }}
      />
      <BrandText style={{ fontSize: 14, color: neutral77 }}>
        NFT artwork
      </BrandText>
      <Image
        source={nftDrop.svg}
        style={{ aspectRatio: 1, width: 220, marginVertical: 12 }}
        resizeMode="contain"
      />
      <BrandText style={{ fontSize: 13 }}>{nftDrop.name}</BrandText>
      <View
        style={{
          height: 1,
          backgroundColor: neutral33,
          marginVertical: 20,
        }}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <BrandText style={{ fontSize: 14, color: neutral77 }}>
          Corner radius
        </BrandText>
        <BrandText style={{ fontSize: 14, color: primaryColor }}>
          {percentage}%
        </BrandText>
      </View>
      <Slider
        style={{ marginTop: 18 }}
        thumbStyle={{
          backgroundColor: "black",
          borderRadius: 1000,
          borderColor: primaryColor,
          borderWidth: 3,
        }}
        width={220}
        height={3}
        widthThumb={15}
        heightThumb={15}
        minimumTrackTintColor={primaryColor}
        maximumTrackTintColor={neutral44}
        onValueChange={(index: number) => {
          setSliderValue(index);
        }}
        value={sliderValue}
      />
      <View
        style={{
          height: 1,
          backgroundColor: neutral33,
          marginVertical: 20,
        }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <BrandText style={{ fontSize: 16 }}>Final Price</BrandText>
        <BrandText
          style={{ fontSize: 16, color: primaryColor, fontWeight: "700" }}
        >
          {price} $TORI
        </BrandText>
      </View>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 2,
          }}
        >
          <IconButton
            icon={require("../../../assets/icons/trash.svg")}
            iconColor={errorColor}
            iconHeight={12}
            iconWidth={12}
            onPress={() => {
              setNftDrop(undefined);
              setNftPositions(undefined);
            }}
            width={56}
            height={48}
            backgroundColor="#F46F761A"
            style={{ borderWidth: 1, borderRadius: 6 }}
            borderColor={errorColor}
          />
          <PrimaryButton
            width={128}
            height={48}
            onPress={() => {}}
            text="Submit"
          />
        </View>
      </View>
    </View>
  );
};

export default NftAdjustments;
