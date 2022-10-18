import React from "react";
import { View, Image, ViewStyle, StyleProp } from "react-native";

import { BrandText } from "./BrandText";

export const ImageWithTextInsert: React.FC<{
  imageURL?: string;
  textInsert?: string;
  size: number;
  style?: StyleProp<ViewStyle>;
}> = ({ imageURL, textInsert, size, style }) => {
  const padding = size * 0.045;
  return (
    <View style={[{ overflow: "hidden" }, style]}>
      <Image source={{ uri: imageURL }} style={{ width: size, height: size }} />
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
