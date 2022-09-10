import React from "react";
import { TextProps, StyleSheet } from "react-native";

import { exoFontFamilyFromFontWeight } from "../../utils/style/fonts";
import { BrandTextBase } from "./BrandTextBase";

export const BrandText: React.FC<TextProps> = (props) => {
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
