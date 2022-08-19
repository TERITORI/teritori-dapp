import React from "react";
import { SvgProps } from "react-native-svg";

export const SVG: React.FC<SvgProps & { source: string }> = ({
  source,
  preserveAspectRatio,
  width,
  height,
}) => {
  let finalSource = source;
  if (preserveAspectRatio === "none") {
    finalSource += "#svgView(preserveAspectRatio(none))";
  }
  return <img src={finalSource} style={{ width, height }} />;
};
