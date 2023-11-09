import React from "react";
import { Image, ImageStyle, StyleProp } from "react-native";
import { SvgProps } from "react-native-svg";

import { SVG } from "./svg";

export function SVGorImageIcon({
  icon,
  iconSize,
  style,
  color,
}: {
  icon: React.FC<SvgProps> | string;
  iconSize: number;
  style?: StyleProp<ImageStyle>;
  color?: string;
}) {
  return (
    <>
      {typeof icon === "function" ? (
        <SVG
          color={color}
          source={icon}
          height={iconSize}
          width={iconSize}
          style={style}
        />
      ) : (
        <Image
          source={{ uri: icon }}
          style={[
            {
              width: iconSize,
              height: iconSize,
            },
            style,
          ]}
        />
      )}
    </>
  );
}
