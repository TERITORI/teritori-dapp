import React from "react";
import { View, ViewStyle, StyleProp, StyleSheet } from "react-native";

import { BrandText } from "./BrandText";
import { OptimizedImage } from "./OptimizedImage";

export const ImageWithTextInsert: React.FC<{
  imageURL?: string;
  textInsert?: string;
  sourceSize: number;
  style?: StyleProp<ViewStyle>;
}> = ({ imageURL, textInsert, sourceSize, style }) => {
  const padding = sourceSize * 0.045;
  const flatStyle = StyleSheet.flatten(style);
  return (
    <View style={[{ overflow: "hidden" }, style]}>
      <OptimizedImage
        sourceURI={imageURL}
        style={{
          width: flatStyle.width || sourceSize,
          height: flatStyle.height || sourceSize,
          resizeMode: "cover",
        }}
        height={sourceSize}
        width={sourceSize}
      />
      {!!textInsert && (
        <BrandText
          style={{
            position: "absolute",
            fontSize: sourceSize * 0.063,
            right: padding,
            bottom: padding,
            maxWidth: sourceSize - padding,
          }}
        >
          {textInsert}
        </BrandText>
      )}
    </View>
  );
};
