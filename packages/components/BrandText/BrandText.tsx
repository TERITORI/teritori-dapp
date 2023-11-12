import React from "react";
import { TextProps, StyleSheet } from "react-native";

import { BrandTextBase } from "./BrandTextBase";
import { exoFontFamilyFromFontWeight } from "../../utils/style/fonts";

export const BrandText: React.FC<TextProps & { isTicker?: boolean }> = (
  props,
) => {
  const { style, ...otherProps } = props;
  const flatStyle = style ? StyleSheet.flatten(style) : undefined;

  return (
    <BrandTextBase
      style={[
        {
          fontFamily: exoFontFamilyFromFontWeight(flatStyle?.fontWeight),
        },
        style,
      ]}
      {...otherProps}
    />
  );
};
