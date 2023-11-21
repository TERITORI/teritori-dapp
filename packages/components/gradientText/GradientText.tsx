import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import { StyleProp, StyleSheet, TextStyle } from "react-native";

import {
  gradientColorBlue,
  gradientColorDarkBlue,
  gradientColorDarkerBlue,
  gradientColorGray,
  gradientColorLavender,
  gradientColorLightBlue,
  gradientColorLighterGray,
  gradientColorLightGray,
  gradientColorLightLavender,
  gradientColorPink,
  gradientColorPurple,
  gradientColorSalmon,
  gradientColorTurquoise,
} from "../../utils/style/colors";
import { BrandText } from "../BrandText";

export type GradientType =
  | "blue"
  | "blueReversed"
  | "blueExtended"
  | "purple"
  | "pink"
  | "gray"
  | "grayLight";

export interface GradientTextProps {
  style?: StyleProp<
    Pick<
      TextStyle,
      | "fontFamily"
      | "fontWeight"
      | "fontSize"
      | "letterSpacing"
      | "lineHeight"
      | "textDecorationLine"
      | "textTransform"
    >
  >;
  gradientType: GradientType;
  ellipsizeMode?: string;
  numberOfLines?: number;
  children: ReactNode;
}

const gradient = (type: GradientType) => {
  const start = { x: 0, y: 0.5 };
  const end = { x: 1, y: 0.5 };

  switch (type) {
    case "blue":
      return {
        colors: [gradientColorLightBlue, gradientColorDarkBlue],
        start,
        end,
      };
    case "blueReversed":
      return {
        colors: [gradientColorDarkBlue, gradientColorLightBlue],
        start,
        end,
      };
    case "blueExtended":
      return {
        colors: [
          gradientColorDarkerBlue,
          gradientColorBlue,
          gradientColorTurquoise,
        ],
        start,
        end,
      };
    case "purple":
      return {
        colors: [gradientColorLavender, gradientColorPurple],
        start,
        end,
      };
    case "pink":
      return {
        colors: [gradientColorSalmon, gradientColorPink],
        start,
        end,
      };
    case "gray":
      return {
        colors: [gradientColorGray, gradientColorLightGray],
        start,
        end,
      };
    case "grayLight":
      return {
        colors: [gradientColorLighterGray, gradientColorLightLavender],
        start,
        end,
      };
  }
};

export const GradientText: React.FC<GradientTextProps> = ({
  gradientType,
  children,
  style,
}) => {
  const flatStyle = StyleSheet.flatten(style);

  return (
    <MaskedView
      maskElement={<BrandText style={flatStyle}>{children}</BrandText>}
    >
      <LinearGradient style={{ flex: 1 }} {...gradient(gradientType)} />
    </MaskedView>
  );
};
