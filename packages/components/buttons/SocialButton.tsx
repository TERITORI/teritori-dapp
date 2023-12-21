import React from "react";
import { ViewStyle, View, StyleProp, TouchableOpacity } from "react-native";
import { SvgProps } from "react-native-svg";

import { neutral22, neutral33, withAlpha } from "../../utils/style/colors";
import { fontMedium14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { Box } from "../boxes/Box";

export const SocialButton: React.FC<{
  text: string;
  iconSvg: React.FC<SvgProps>;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  noBrokenCorners?: boolean;
}> = ({ text, onPress, iconSvg, style, noBrokenCorners = true }) => {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <Box
        // We don't handle broken corners for now, because this button can be used on an image
        notched={!noBrokenCorners}
        style={{
          backgroundColor: withAlpha(neutral22, 0.64),
          height: 44,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            notched={!noBrokenCorners}
            style={{
              marginLeft: 6,
              backgroundColor: neutral33,
              borderRadius: 6,
              width: 32,
              height: 32,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SVG source={iconSvg} height={20} width={20} />
          </Box>
          <BrandText style={[fontMedium14, { marginLeft: 8, marginRight: 16 }]}>
            {text}
          </BrandText>
        </View>
      </Box>
    </TouchableOpacity>
  );
};
