import React from "react";
import { View, ViewStyle, StyleProp, StyleSheet } from "react-native";

import { BrandText } from "./BrandText";
import { OptimizedImage } from "./OptimizedImage";

export const ImageWithTextInsert: React.FC<{
  imageURL?: string;
  textInsert?: string;
  size: number;
  style?: StyleProp<ViewStyle>;
}> = ({ imageURL, textInsert, size, style }) => {
  const padding = size * 0.045;
  const flatStyle = StyleSheet.flatten(style);
  return (
    <View style={[{ overflow: "hidden" }, style]}>
      <OptimizedImage
        sourceURI={imageURL}
        style={{
          width: flatStyle.width || size,
          height: flatStyle.height || size,
        }}
        height={size}
        width={size}
      />
      {!!textInsert && (
        <BrandText
          style={{
            position: "absolute",
            fontSize: size * 0.063,
            right: padding,
            bottom: padding,
            maxWidth: size - padding,
          }}
        >
          {textInsert}
        </BrandText>
      )}
    </View>
  );
};
