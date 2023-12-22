import React from "react";
import { ViewStyle, View, StyleProp, TouchableOpacity } from "react-native";
import { SvgProps } from "react-native-svg";

import {
  neutral1A,
  primaryColor,
  primaryTextColor,
  withAlpha,
} from "../../utils/style/colors";
import { fontMedium14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { SecondaryBox } from "../boxes/SecondaryBox";

export const SocialButtonSecondary: React.FC<{
  text: string;
  iconSvg: React.FC<SvgProps>;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ text, onPress, iconSvg, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <SecondaryBox style={{ backgroundColor: withAlpha(neutral1A, 0.64) }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <SecondaryBox
            style={{
              backgroundColor: primaryColor,
              borderRadius: 6,
              marginLeft: 6,
            }}
          >
            <SVG
              source={iconSvg}
              width={20}
              height={20}
              color={primaryTextColor}
            />
          </SecondaryBox>
          <BrandText
            style={[
              fontMedium14,
              { color: primaryColor, marginLeft: 8, marginRight: 16 },
            ]}
          >
            {text}
          </BrandText>
        </View>
      </SecondaryBox>
    </TouchableOpacity>
  );
};
