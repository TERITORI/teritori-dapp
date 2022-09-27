import React from "react";
import { View } from "react-native";
import { SvgProps } from "react-native-svg";

export const SVG: React.FC<SvgProps & { source: string }> = ({
  source,
  preserveAspectRatio,
  width,
  height,
  ...svgProps
}) => {
  let finalSource = source;
  if (preserveAspectRatio === "none") {
    finalSource += "#svgView(preserveAspectRatio(none))";
  }
  finalSource += "#svgView(fill(red))";
  return (
    <View style={[{ flexDirection: "row" }, svgProps.style]}>
      <img src={finalSource} style={{ width, height, color: "red" }} />
    </View>
  );
};
