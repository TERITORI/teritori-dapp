import React from "react";
import { SvgProps } from "react-native-svg";

export const SVG: React.FC<SvgProps & { source: React.FC<SvgProps> }> = ({
  source,
  ...svgProps
}) => {
  const Component = source;
  return <Component {...svgProps} />;
};
