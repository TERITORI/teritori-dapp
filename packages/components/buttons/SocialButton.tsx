import React from "react";
import { ViewStyle, View } from "react-native";
import { SvgProps } from "react-native-svg";

import { neutral22, neutral33 } from "../../utils/style/colors";
import { fontMedium14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { SecondaryBox } from "../boxes/SecondaryBox";

export const SocialButton: React.FC<{
  text: string;
  iconSvg: React.FC<SvgProps>; // Ugly, but it works (Removing the fragments from parent and using the type 'Element' doesn't work)
  onPress?: () => void;
  style?: ViewStyle;
}> = ({ text, onPress, iconSvg, style }) => {
  return (
    <SecondaryBox
      onPress={onPress}
      backgroundColor={neutral22}
      height={44}
      style={style}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <SecondaryBox
          nonPressable
          style={{ marginLeft: 6 }}
          backgroundColor={neutral33}
          width={32}
          height={32}
          squaresBackgroundColor={neutral22}
          borderRadius={6}
          cornerWidth={5}
        >
          <SVG source={iconSvg} />
        </SecondaryBox>
        <BrandText style={[fontMedium14, { marginLeft: 8, marginRight: 16 }]}>
          {text}
        </BrandText>
      </View>
    </SecondaryBox>
  );
};
