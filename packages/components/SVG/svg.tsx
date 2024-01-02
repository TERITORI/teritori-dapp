import React from "react";
import { Platform, Image, View, ImageProps } from "react-native";
import { SvgFromUri, SvgProps } from "react-native-svg";

export const SVG: React.FC<
  SvgProps & {
    source: React.FC<SvgProps> | string;
    height: ImageProps["height"];
    width: ImageProps["width"];
  }
> = ({ source, ...svgProps }) => {
  if (!source) {
    return null;
  }

  if (typeof source === "string" && source.startsWith("http")) {
    if (Platform.OS === "web") {
      return (
        <Image
          source={{ uri: source }}
          style={{
            height: svgProps.height || "auto",
            width: svgProps.width || "auto",
          }}
        />
      );
    }
    return (
      <View
        style={{
          height: svgProps.height || "auto",
          width: svgProps.width || "auto",
        }}
      >
        <SvgFromUri uri={source} {...svgProps} />
      </View>
    );
  }
  const Component = source;
  return <Component {...svgProps} />;
};
