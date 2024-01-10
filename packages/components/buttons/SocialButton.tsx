import React from "react";
import { ViewStyle, View, StyleProp, TouchableOpacity } from "react-native";
import { SvgProps } from "react-native-svg";

import {
  neutral22,
  neutral33,
  secondaryColor,
  withAlpha,
} from "../../utils/style/colors";
import { fontMedium14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { LegacySecondaryBox } from "../boxes/LegacySecondaryBox";

export const SocialButton: React.FC<{
  text?: string;
  iconSvg: React.FC<SvgProps>;
  iconColor?: string;
  textColor?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  noBrokenCorners?: boolean;
  height?: number;
  bgColor?: string;
}> = ({
  text,
  onPress,
  iconSvg,
  iconColor,
  style,
  height,
  noBrokenCorners = true,
  textColor = secondaryColor,
  bgColor,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <LegacySecondaryBox
        // We don't handle broken corners for now, because this button can be used on an image
        noBrokenCorners={noBrokenCorners}
        mainContainerStyle={{
          backgroundColor: bgColor ? bgColor : withAlpha(neutral22, 0.64),
        }}
        height={height === undefined ? 44 : height}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <LegacySecondaryBox
            noBrokenCorners={noBrokenCorners}
            style={{ marginLeft: text ? 6 : 0 }}
            mainContainerStyle={{ backgroundColor: neutral33, borderRadius: 6 }}
            width={32}
            height={32}
            squaresBackgroundColor={withAlpha(neutral22, 0.64)}
            cornerWidth={5.5}
          >
            <SVG source={iconSvg} height={20} width={20} />
          </LegacySecondaryBox>

          {!!text && (
            <BrandText
              style={[fontMedium14, { marginLeft: 8, marginRight: 16 }]}
            >
              {text}
            </BrandText>
          )}
        </View>
      </LegacySecondaryBox>
    </TouchableOpacity>
  );
};
