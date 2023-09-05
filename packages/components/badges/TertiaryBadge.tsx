import * as React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import {
  BadgesSize,
  heightBadge,
  paddingHorizontalBadge,
} from "../../utils/style/badges";
import { neutral33 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";

export const TertiaryBadge: React.FC<{
  label: string | number;
  iconSVG?: React.FC<SvgProps>;
  size?: BadgesSize;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
}> = ({ label, iconSVG, size = "M", textColor = "#FFFFFF", style }) => {
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
      {iconSVG && (
        <SVG
          source={iconSVG}
          width={16}
          height={16}
          style={{ marginLeft: layout.spacing_x1 }}
        />
      )}
    </View>
  );
};
