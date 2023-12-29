import React from "react";
import { View, StyleProp, TouchableOpacity } from "react-native";

import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import {
  gradientColorBlue,
  gradientColorDarkerBlue,
  gradientColorPink,
  neutral00,
  neutral11,
  neutral30,
  neutral44,
} from "../../utils/style/colors";
import { fontSemibold16, fontSemibold24 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { Box, BoxStyle } from "../boxes/Box";

export const ApplicationStatusCard: React.FC<{
  label: string;
  count: any;
  style?: StyleProp<BoxStyle>;
  onPress: () => void;
  isReady?: boolean;
}> = ({ label, style, count, isReady, onPress }) => {
  return (
    <Box
      notched
      borderGradient={{
        colors: [gradientColorBlue, gradientColorDarkerBlue, gradientColorPink],
      }}
      style={[
        style,
        {
          flex: 1,
          paddingVertical: 20,
          paddingHorizontal: 20,
          backgroundColor: isReady ? neutral00 : neutral11,
          borderWidth: 1,
          borderColor: isReady ? "" : neutral44,
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        style={[
          {
            alignItems: "flex-start",
            justifyContent: "space-between",
            height: 124,
          },
        ]}
      >
        <BrandText style={[fontSemibold16]}>{label}</BrandText>
        <View>
          <BrandText style={[fontSemibold24]}>{count}</BrandText>
        </View>
        <View
          style={{
            height: 32,
            width: 32,
            backgroundColor: neutral30,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            position: "absolute",
            right: 18,
            bottom: 0,
          }}
        >
          <SVG source={chevronRightSVG} width={16} />
        </View>
      </TouchableOpacity>
    </Box>
  );
};
