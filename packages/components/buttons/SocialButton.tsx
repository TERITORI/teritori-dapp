import React from "react";
import { ViewStyle, View, StyleProp, TouchableOpacity } from "react-native";
import { SvgProps } from "react-native-svg";

import { neutral22, neutral33, withAlpha } from "../../utils/style/colors";
import { fontMedium14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { SecondaryBox } from "../boxes/SecondaryBox";

export const SocialButton: React.FC<{
  text: string;
  iconSvg: React.FC<SvgProps>;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  noBrokenCorners?: boolean;
}> = ({ text, onPress, iconSvg, style, noBrokenCorners = true }) => {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <SecondaryBox
        style={{ backgroundColor: withAlpha(neutral22, 0.64), height: 44 }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <SecondaryBox
            style={{
              marginLeft: 6,
              backgroundColor: neutral33,
              borderRadius: 6,
            }}
          >
            <SVG source={iconSvg} height={20} width={20} />
          </SecondaryBox>
          <BrandText style={[fontMedium14, { marginLeft: 8, marginRight: 16 }]}>
            {text}
          </BrandText>
        </View>
      </SecondaryBox>
    </TouchableOpacity>
  );
};
