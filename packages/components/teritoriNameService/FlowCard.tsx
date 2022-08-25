import React from "react";
import { ViewStyle, View } from "react-native";
import { SvgProps } from "react-native-svg";

import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { PrimaryBox } from "../boxes/PrimaryBox";

export const FlowCard: React.FC<{
  label: string;
  description: string;
  iconSVG: React.FC<SvgProps>;
  style?: ViewStyle;
  onPress: () => void;
  disabled?: boolean;
}> = ({ label, description, iconSVG, style, disabled, onPress }) => {
  return (
    <PrimaryBox
      width={392}
      height={100}
      paddingHorizontal={20}
      paddingVertical={20}
      mainContainerStyle={{
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
      onPress={onPress}
      disabled={disabled}
      style={style}
    >
      <SVG width={24} height={24} source={iconSVG} style={{ marginRight: 8 }} />
      <View style={{ justifyContent: "space-between", height: "100%" }}>
        <BrandText>{label}</BrandText>
        <BrandText
          style={{
            color: "#A3A3A3",
            fontSize: 14,
          }}
        >
          {description}
        </BrandText>
      </View>
    </PrimaryBox>
  );
};
