import * as React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import {
  BadgesSize,
  heightBadge,
  paddingHorizontalBadge,
} from "../../utils/style/badges";
import {
  primaryColor,
  secondaryColor,
  primaryTextColor,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";

export const PrimaryBadge: React.FC<{
  label: string | number;
  size?: BadgesSize;
  backgroundColor?: "primary" | "secondary";
  style?: StyleProp<ViewStyle>;
}> = ({ label, size = "M", backgroundColor = "primary", style }) => {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          height: heightBadge(size),
          paddingHorizontal: paddingHorizontalBadge(size),
          backgroundColor:
            backgroundColor === "primary" ? primaryColor : secondaryColor,
          borderRadius: 999,
        },
        style,
      ]}
    >
      <BrandText style={[fontSemibold14, { color: primaryTextColor }]}>
        {label}
      </BrandText>
    </View>
  );
};
