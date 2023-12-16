import React from "react";
import { ImageStyle, View } from "react-native";

import logoSVG from "../../../../assets/logos/logo.svg";
import { SVG } from "../../../components/SVG";
import { SVGorImageIcon } from "../../../components/SVG/SVGorImageIcon";
import { neutral22 } from "../../../utils/style/colors";

type AvatarProps = {
  source: string;
  size?: number;
  style?: ImageStyle;
};

export const Avatar = ({ source, size = 40, style = {} }: AvatarProps) => {
  if (!source) {
    return (
      <View
        style={{
          backgroundColor: neutral22,
          padding: source ? 0 : size * 0.15,
          borderRadius: size,
          height: size,
          width: size,
        }}
      >
        <SVG source={logoSVG} />
      </View>
    );
  }
  return (
    <SVGorImageIcon style={style} iconSize={size} icon={source || logoSVG} />
  );
};
