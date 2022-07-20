import React from "react";
import { TextProps, StyleSheet } from "react-native";

import { BrandTextBase } from "./BrandTextBase";
import {primaryColor} from "../../utils/colors"

const exoFontFamilyFromFontWeight = (weight: string) => {
  switch (weight) {
    case "500":
      return "Exo_500Medium";
    default:
      return "Exo_600SemiBold";
  }
};

export const BrandText: React.FC<TextProps> = (props) => {
  const { style, onPress, ...otherProps } = props;
  const flatStyle = style ? StyleSheet.flatten(style) : undefined;

  const clickableStyle = {
    textDecoration: "underline",
    // TODO: color gradient blue
    color: primaryColor
  }

  return (
    <BrandTextBase
      onPress={onPress}
      style={[
        { fontFamily: exoFontFamilyFromFontWeight(flatStyle?.fontWeight) },
        style,
        onPress && clickableStyle
      ]}
      {...otherProps}
    />
  );
};
