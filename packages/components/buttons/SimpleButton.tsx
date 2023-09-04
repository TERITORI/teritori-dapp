import React from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import {
  neutral00,
  primaryTextColor,
  yellowDefault,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";

interface SimpleButtonProps {
  text: string;
  size?: "XS" | "SM" | "M" | "XL";
  color?: string;
  bgColor?: string;
  onPress?(): void;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
  disabled?: boolean;
  iconSVG?: React.FC<SvgProps>;
  outline?: boolean;
}

export const SimpleButton: React.FC<SimpleButtonProps> = ({
  text,
  size = "M",
  color,
  bgColor,
  onPress,
  loading,
  disabled,
  containerStyle,
  style,
  iconSVG = null,
  outline = false,
}) => {
  let padH: number;
  let padV: number;
  let radius: number;

  switch (size) {
    case "XL":
      padH = layout.spacing_x3;
      padV = layout.spacing_x2_5;
      radius = layout.spacing_x1_5;
      break;
    case "SM":
      padH = layout.spacing_x2;
      padV = layout.spacing_x1_5;
      radius = layout.spacing_x0_75;
      break;
    case "XS":
      padH = layout.spacing_x1_5;
      padV = layout.spacing_x0_5;
      radius = layout.spacing_x0_5;
      break;
    case "M":
    default:
      padH = layout.spacing_x2_5;
      padV = layout.spacing_x2;
      radius = layout.spacing_x1;
      break;
  }

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[containerStyle, (loading || disabled) && { opacity: 0.6 }]}
      onPress={() => !loading && onPress?.()}
    >
      <BrandText
        style={[
          fontSemibold14,
          {
            alignSelf: "center",
            borderRadius: radius,
            display: "flex",
            color: outline ? color || yellowDefault : color || primaryTextColor,
            backgroundColor: outline ? neutral00 : bgColor || yellowDefault,
            borderColor: outline
              ? color || yellowDefault
              : bgColor || yellowDefault,
            borderWidth: 1,
            paddingHorizontal: padH,
            paddingVertical: padV,
          },
          style,
        ]}
      >
        {iconSVG && (
          <SVG
            style={{ marginRight: layout.spacing_x1 }}
            height={layout.spacing_x2}
            source={iconSVG}
          />
        )}
        {loading ? "Loading..." : text}
      </BrandText>
    </TouchableOpacity>
  );
};
