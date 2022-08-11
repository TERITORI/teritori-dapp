import React from "react";
import { TextProps, StyleSheet } from "react-native";

import { BrandTextBase } from "./BrandTextBase";
import {exoFontFamilyFromFontWeight} from "../../utils/style/fonts"

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
