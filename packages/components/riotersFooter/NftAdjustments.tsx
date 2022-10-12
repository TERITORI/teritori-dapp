import React, { memo, useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";

import { Collection, NFT } from "../../api/marketplace/v1/marketplace";
import { BrandText } from "../../components/BrandText";
import { prettyPrice } from "../../utils/coins";
import {
  neutral33,
  neutral44,
  neutral77,
  primaryColor,
  errorColor,
} from "../../utils/style/colors";
import { toriCurrency } from "../../utils/teritori";
import { nftDropedAdjustmentType } from "../../utils/types/nft";
import Slider from "../Slider";
import { IconButton } from "../buttons/IconButton";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { CollectionInfoInline } from "../collections/CollectionInfoInline";

const NftAdjustments: React.FC<{
  nftDroped: NFT;
  setNftDroped: (nftDroped: NFT | undefined) => void;
  nftDropedAdjustment: nftDropedAdjustmentType;
  setNftDropedAdjustment: (
    nftDropedAdjustment: nftDropedAdjustmentType | undefined
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
    const [sliderValue, setSliderValue] = useState(0);
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
      setNftDropedAdjustment({
        ...nftDropedAdjustment,
        borderRadius: percentage,
      });
    }, [percentage]);

    useEffect(() => {
      setPercentage((Math.round((sliderValue * 100) / 220) * 2) / 2);
    }, [sliderValue]);

    return (
      <View style={styles.container}>
        <BrandText style={styles.textTitle}>NFT info & adjustments</BrandText>
        <View style={styles.separator} />
        <View>
          <BrandText style={styles.textTitle}>Collection</BrandText>
          <View style={{ marginTop: 12 }} />
          <CollectionInfoInline
            name={currentCollection.collectionName}
            imageSource={{ uri: currentCollection.imageUri }}
          />
        </View>
        <View style={styles.separator} />
        <BrandText style={styles.textTitle}>NFT artwork</BrandText>
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
        <View style={styles.separator} />
        <View style={styles.rowCenter}>
          <BrandText style={styles.textTitle}>Corner radius</BrandText>
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
        <View style={styles.separator} />
        <View style={styles.rowCenter}>
          <BrandText style={{ fontSize: 16 }}>Final Price</BrandText>
          <BrandText
            style={{ fontSize: 16, color: primaryColor, fontWeight: "700" }}
          >
            {prettyPrice(
              price?.toString() || "",
              toriCurrency.coinMinimalDenom
            )}
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
              iconSVG={require("../../../assets/icons/trash.svg")}
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
      </View>
    );
  }
);

export default NftAdjustments;

const styles = StyleSheet.create({
  container: {
    width: 220,
    flex: 1,
  },
  textTitle: {
    fontSize: 14,
    color: neutral77,
  },
  separator: {
    height: 1,
    backgroundColor: neutral33,
    marginVertical: 20,
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
