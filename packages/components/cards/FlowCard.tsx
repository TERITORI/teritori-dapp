import React from "react";
import { ViewStyle, View, TouchableOpacity } from "react-native";
import { SvgProps } from "react-native-svg";

import flowCardSVG from "../../../assets/cards/flow-card.svg";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";

export const FlowCard: React.FC<{
  label: string;
  description: string;
  iconSVG: React.FC<SvgProps>;
  style?: ViewStyle;
  onPress: () => void;
  disabled?: boolean;
}> = ({ label, description, iconSVG, style, disabled, onPress }) => {
  const width = 392;
  const height = 100;

  return (
    <TouchableOpacity
      style={[disabled && { opacity: 0.5 }, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <SVG width={width} height={height} source={flowCardSVG} />
      <View
        style={{
          flexDirection: "row",
          padding: 20,
          width,
          height,
          minWidth: width,
          minHeight: height,
          position: "absolute",
        }}
      >
        <SVG width={24} height={24} source={iconSVG} />
        <View style={{ justifyContent: "space-between", marginLeft: 8 }}>
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
      </View>
    </TouchableOpacity>
  );
};
