import React, { memo, SetStateAction, useEffect, useState } from "react";
import { Image, ScrollView, TextStyle, View, ViewStyle } from "react-native";

import TrashSVG from "../../../assets/icons/trash.svg";
import { Collection, NFT } from "../../api/marketplace/v1/marketplace";
import { BrandText } from "../../components/BrandText";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { prettyPrice } from "../../utils/coins";
import {
  neutral33,
  neutral44,
  neutral77,
  primaryColor,
  errorColor,
} from "../../utils/style/colors";
import { NFTDropedAdjustmentType } from "../../utils/types/nft";
import Slider from "../Slider";
import { IconButton } from "../buttons/IconButton";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { CollectionInfoInline } from "../collections/CollectionInfoInline";
import { SpacerColumn } from "../spacer";

const NftAdjustments: React.FC<{
  nftDroped: NFT;
  setNftDroped: (nftDroped: NFT | undefined) => void;
  nftDropedAdjustment: NFTDropedAdjustmentType;
  setNftDropedAdjustment: (
    nftDropedAdjustment: SetStateAction<NFTDropedAdjustmentType | undefined>
  ) => void;
  price: number | undefined;
  setTransactionPaymentModalVisible: (visible: boolean) => void;
  currentCollection: Collection;
}> = memo(
  ({
    nftDroped,
    setNftDroped,
    nftDropedAdjustment,
    setNftDropedAdjustment,
    price,
    setTransactionPaymentModalVisible,
    currentCollection,
  }) => {
    const networkId = useSelectedNetworkId();

    const [sliderValue, setSliderValue] = useState(0);
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
      setNftDropedAdjustment(
        (nftDropedAdjustment) =>
          nftDropedAdjustment && {
            ...nftDropedAdjustment,
            borderRadius: percentage,
          }
      );
    }, [nftDropedAdjustment, percentage, setNftDropedAdjustment]);

    useEffect(() => {
      setPercentage((Math.round((sliderValue * 100) / 220) * 2) / 2);
    }, [sliderValue]);

    return (
      <ScrollView contentContainerStyle={containerStyle}>
        <BrandText style={textTitleStyle}>NFT info & adjustments</BrandText>
        <View style={separatorStyle} />
        <View>
          <BrandText style={textTitleStyle}>Collection</BrandText>
          <View style={{ marginTop: 12 }} />
          <CollectionInfoInline
            name={currentCollection.collectionName}
            imageSource={{ uri: currentCollection.imageUri }}
            id={currentCollection.id}
          />
        </View>
        <View style={separatorStyle} />
        <BrandText style={textTitleStyle}>NFT artwork</BrandText>
        <Image
          source={{ uri: nftDroped.imageUri }}
          style={{
            aspectRatio: 1,
            width: 220,
            marginVertical: 12,
            borderRadius: 12,
          }}
          resizeMode="contain"
        />
        <BrandText style={{ fontSize: 13 }}>{nftDroped.name}</BrandText>
        <View style={separatorStyle} />
        <View style={rowCenterStyle}>
          <BrandText style={textTitleStyle}>Corner radius</BrandText>
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
        <View style={separatorStyle} />
        <View style={rowCenterStyle}>
          <BrandText style={{ fontSize: 16 }}>Final Price</BrandText>
          <BrandText
            style={{ fontSize: 16, color: primaryColor, fontWeight: "700" }}
          >
            {prettyPrice(
              networkId,
              price?.toString() || "",
              "utori" // FIXME: don't hardcode
            )}
          </BrandText>
        </View>
        <SpacerColumn size={2} />
        <View style={{ justifyContent: "flex-end" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 2,
            }}
          >
            <IconButton
              iconSVG={TrashSVG}
              iconColor={errorColor}
              iconSize={12}
              onPress={() => {
                setNftDroped(undefined);
                setNftDropedAdjustment(undefined);
              }}
              width={56}
              size="M"
              backgroundColor="#F46F761A"
              style={{ borderWidth: 1, borderRadius: 6 }}
              borderColor={errorColor}
              squaresBorderColor={errorColor}
            />
            <PrimaryButton
              width={128}
              size="M"
              onPress={() => {
                setTransactionPaymentModalVisible(true);
              }}
              text="Submit"
            />
          </View>
        </View>
      </ScrollView>
    );
  }
);

export default NftAdjustments;

const containerStyle: ViewStyle = {
  width: 220,
  flex: 1,
};
const textTitleStyle: TextStyle = {
  fontSize: 14,
  color: neutral77,
};
const separatorStyle: ViewStyle = {
  height: 1,
  backgroundColor: neutral33,
  marginVertical: 20,
};
const rowCenterStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
};
