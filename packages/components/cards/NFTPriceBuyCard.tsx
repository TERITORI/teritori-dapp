import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import solanaCircleSVG from "../../../assets/icons/solana-circle.svg";
import { fontSemibold12, fontSemibold28 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { PrimaryButton } from "../buttons/PrimaryButton";

// TODO: Dynamic data + props

export const NFTPriceBuyCard: React.FC<{
  onPressBuy: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ onPressBuy, style }) => {
  return (
    <TertiaryBox
      fullWidth
      height={88}
      style={style}
      mainContainerStyle={{
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View>
        <BrandText style={[fontSemibold12, { marginBottom: 6 }]}>
          Current Price
        </BrandText>
        <View style={{ flexDirection: "row" }}>
          {/*TODO: Text gradient pink*/}
          <BrandText
            style={[fontSemibold28, { color: "#DBAEFF", marginRight: 12 }]}
          >
            7.1 SOL
          </BrandText>
          <SVG source={solanaCircleSVG} />
        </View>
      </View>
      <PrimaryButton size="XL" text="Buy this NFT" onPress={onPressBuy} />
    </TertiaryBox>
  );
};
