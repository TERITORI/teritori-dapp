import React from "react";
import { SvgProps } from "react-native-svg";
import {View} from "react-native"

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
  return (
    <View style={[{flexDirection: "row"}, svgProps.style]}>
      <img src={finalSource} style={{ width, height }} />
    </View>
  );
};
