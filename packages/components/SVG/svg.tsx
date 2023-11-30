import React from "react";
import { SvgFromUri, SvgProps } from "react-native-svg";

export const SVG: React.FC<
  SvgProps & { source: React.FC<SvgProps> | string }
> = ({ source, ...svgProps }) => {
  if (!source) {
    return null;
  }

  if (typeof source === "string" && source.startsWith("http")) {
    return <SvgFromUri uri={source} {...svgProps} />;
  }
  const Component = source;
  return <Component {...svgProps} />;
};
