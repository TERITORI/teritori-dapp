import React from "react";
import { Platform, Image } from "react-native";
import { ImageProps, SvgFromUri, SvgProps } from "react-native-svg";

export const SVG: React.FC<
  SvgProps & { source: React.FC<SvgProps> | string }
> = ({ source, ...svgProps }) => {
  if (!source) {
    return null;
  }

  if (typeof source === "string" && source.startsWith("http")) {
    if (Platform.OS === "web") {
      return <Image source={{ uri: source }} {...(svgProps as ImageProps)} />;
    }
    return <SvgFromUri uri={source} {...svgProps} />;
  }
  const Component = source;
  return <Component {...svgProps} />;
};
