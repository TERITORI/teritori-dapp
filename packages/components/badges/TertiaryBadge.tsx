import * as React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import {
  BadgesSize,
  heightBadge,
  paddingHorizontalBadge,
} from "../../utils/style/badges";
import { neutral33 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";

export const TertiaryBadge: React.FC<{
  label: string | number;
  size?: BadgesSize;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
}> = ({ label, size = "M", textColor = "#FFFFFF", style }) => {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          height: heightBadge(size),
          paddingHorizontal: paddingHorizontalBadge(size),
          backgroundColor: neutral33,
          borderRadius: 999,
        },
        style,
      ]}
    >
      <BrandText style={[fontSemibold14, { color: textColor }]}>
        {label}
      </BrandText>
    </View>
  );
};
