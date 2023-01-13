import React from "react";
import { Image } from "react-native";
import { SvgProps } from "react-native-svg";

import { SVG } from "./svg";

export function SVGorImageIcon(props: {
  icon: React.FC<SvgProps> | string;
  iconSize: number;
}) {
  return (
    <>
      {typeof props.icon === "function" ? (
        <SVG source={props.icon} />
      ) : (
        <Image
          source={{ uri: props.icon }}
          style={{ width: props.iconSize, height: props.iconSize }}
        />
      )}
    </>
  );
}
