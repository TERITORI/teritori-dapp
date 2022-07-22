import React from "react";
import { TextProps, StyleSheet } from "react-native";

import { BrandTextBase } from "./BrandTextBase";

export const exoFontFamilyFromFontWeight = (weight: string) => {
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

  return (
    <BrandTextBase
      onPress={onPress}
      style={[
        { fontFamily: exoFontFamilyFromFontWeight(flatStyle?.fontWeight) },
        style,
      ]}
      {...otherProps}
    />
  );
};
