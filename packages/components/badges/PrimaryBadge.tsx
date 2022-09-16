import * as React from "react"
import {StyleProp, View, ViewStyle} from "react-native"

import { primaryColor, secondaryColor, primaryTextColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import {BadgesSize, heightBadge, paddingHorizontalBadge} from "../../utils/style/badges"

export const PrimaryBadge: React.FC<{
  label: string;
  size?: BadgesSize;
  backgroundColor?: "primary" | "secondary";
  style?: StyleProp<ViewStyle>;
}> = ({label, size = "M", backgroundColor = "primary", style}) => {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: paddingHorizontalBadge(size),
          height: heightBadge(size),
          backgroundColor:
            backgroundColor === "primary" ? primaryColor : secondaryColor,
          borderRadius: 999
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
