import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, ViewStyle, StyleProp } from "react-native";

import { OptimizedImage } from "../OptimizedImage";

type RoundedGradientImageSize = "L" | "M" | "S" | "XS" | "XXS";

const dimension = (size: RoundedGradientImageSize) => {
  switch (size) {
    case "L":
      return 236;
    case "M":
      return 140;
    case "S":
      return 56;
    case "XS":
      return 32;
    case "XXS":
      return 24;
  }
};
const imageDimension = (size: RoundedGradientImageSize) => {
  switch (size) {
    case "L":
      return dimension(size) - 4;
    case "M":
      return dimension(size) - 4;
    case "S":
      return dimension(size) - 2;
    case "XS":
      return dimension(size) - 2;
    case "XXS":
      return dimension(size) - 2;
  }
};

export const RoundedGradientImage: React.FC<{
  sourceURI: string | null | undefined;
  fallbackURI?: string | null | undefined;
  size?: RoundedGradientImageSize;
  style?: StyleProp<ViewStyle>;
  square?: boolean;
  testID?: string;
}> = ({
  sourceURI,
  fallbackURI,
  size = "M",
  style,
  square = false,
  testID,
}) => {
  return (
    <View
      testID={testID}
      style={[
        {
          width: dimension(size),
          height: dimension(size),
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <View
        style={{
          width: imageDimension(size),
          height: imageDimension(size),
          backgroundColor: "#000000",
          borderRadius: square ? 12 : 999,
          zIndex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <OptimizedImage
          width={imageDimension(size)}
          height={imageDimension(size)}
          sourceURI={sourceURI}
          fallbackURI={fallbackURI}
          style={{
            borderRadius: square ? 12 : 999,
            height: "100%",
            width: "100%",
          }}
        />
      </View>

      <LinearGradient
        // Be careful with these coordinates
        // TODO: Find dynamic values depending on the ratio width/height to get a correct gradient angle everytime
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0.7, 0.8]}
        style={{
          position: "absolute",
          width: dimension(size),
          height: dimension(size),
          borderRadius: square ? 12 : 999,
        }}
        colors={["#01B7C5", "#782C96"]}
      />
    </View>
  );
};
