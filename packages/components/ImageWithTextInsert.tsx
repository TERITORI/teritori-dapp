import React from "react";
import { View, ViewStyle, StyleProp } from "react-native";

import { BrandText } from "./BrandText";
import { OptimizedImage } from "./OptimizedImage";

export const ImageWithTextInsert: React.FC<{
  imageURL?: string;
  textInsert?: string;
  size: number;
  style?: StyleProp<ViewStyle>;
}> = ({ imageURL, textInsert, size, style }) => {
  const padding = size * 0.045;
  return (
    <View style={[{ overflow: "hidden" }, style]}>
      <OptimizedImage
        source={{ uri: imageURL }}
        style={{ width: size, height: size }}
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
