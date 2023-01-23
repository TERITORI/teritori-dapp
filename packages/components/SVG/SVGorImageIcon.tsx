import React from "react";
import { Image } from "react-native";
import { SvgProps } from "react-native-svg";

import { SVG } from "./svg";

export function SVGorImageIcon({
  icon,
  iconSize,
}: {
  icon: React.FC<SvgProps> | string;
  iconSize: number;
}) {
  return (
    <>
      {typeof icon === "function" ? (
        <SVG source={icon} height={iconSize} width={iconSize} />
      ) : (
        <Image
          source={{ uri: icon }}
          style={{ width: iconSize, height: iconSize }}
        />
      )}
    </>
  );
}
