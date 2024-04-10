import React from "react";
import { ViewStyle, StyleProp, TouchableOpacity } from "react-native";
import { SvgProps } from "react-native-svg";

import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { Box } from "../boxes/Box";

import { neutral22, neutral33, withAlpha } from "@/utils/style/colors";
import { fontMedium14 } from "@/utils/style/fonts";

export const iconSize = 32;
export const iconPadding = 12;
export const outerPadding = 6;
export const innerGap = 8;

export const SocialButton: React.FC<{
  text?: string;
  iconSvg: React.FC<SvgProps>;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ text, onPress, iconSvg, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <Box
        style={{
          paddingVertical: outerPadding,
          backgroundColor: withAlpha(neutral22, 0.64),
          paddingLeft: outerPadding,
          paddingRight: outerPadding + (text ? innerGap : 0),
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Box
          style={{
            backgroundColor: neutral33,
            borderRadius: 6,
            width: iconSize,
            height: iconSize,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SVG
            source={iconSvg}
            height={iconSize - iconPadding}
            width={iconSize - iconPadding}
          />
        </Box>
        {!!text && (
          <BrandText style={[fontMedium14, { marginLeft: innerGap }]}>
            {text}
          </BrandText>
        )}
      </Box>
    </TouchableOpacity>
  );
};
