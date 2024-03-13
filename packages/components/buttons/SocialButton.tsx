import React from "react";
import { ViewStyle, View, StyleProp, TouchableOpacity } from "react-native";
import { SvgProps } from "react-native-svg";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { Box } from "@/components/boxes/Box";
import { withAlpha, neutral22, neutral33 } from "@/utils/style/colors";
import { fontMedium14 } from "@/utils/style/fonts";

// TODO: remove uses of Box component directly in other components
export const SocialButton: React.FC<{
  text?: string;
  iconSvg: React.FC<SvgProps>;
  iconColor?: string;
  textColor?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ text, onPress, iconSvg, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <Box
        style={{
          height: 44,
          backgroundColor: withAlpha(neutral22, 0.64),
          justifyContent: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Box
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
