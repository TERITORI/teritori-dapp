import React from "react";
import { ViewStyle, StyleProp, TouchableOpacity } from "react-native";
import { SvgProps } from "react-native-svg";

import { iconPadding, iconSize, innerGap, outerPadding } from "./SocialButton";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { Box } from "../boxes/Box";

import {
  neutral1A,
  primaryColor,
  primaryTextColor,
  withAlpha,
} from "@/utils/style/colors";
import { fontRegular14 } from "@/utils/style/fonts";

export const SocialButtonSecondary: React.FC<{
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
          backgroundColor: withAlpha(neutral1A, 0.64),
          paddingLeft: outerPadding,
          paddingRight: outerPadding + (text ? innerGap : 0),
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Box
          style={{
            backgroundColor: primaryColor,
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
            color={primaryTextColor}
          />
        </Box>
        {!!text && (
          <BrandText
            style={[
              fontRegular14,
              { color: primaryColor, marginLeft: innerGap },
            ]}
          >
            {text}
          </BrandText>
        )}
      </Box>
    </TouchableOpacity>
  );
};
