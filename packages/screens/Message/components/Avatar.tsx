import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Avatar as PaperAvatar } from "react-native-paper";

import logoSVG from "../../../../assets/logos/logo.svg";
import { neutral22 } from "../../../utils/style/colors";

type AvatarProps = {
  source: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export const Avatar = ({ source, size = 40, style }: AvatarProps) => {
  return (
    <PaperAvatar.Image
      style={[
        {
          backgroundColor: neutral22,
          padding: source ? 0 : size * 0.14,
        },
        style,
      ]}
      size={size}
      source={source ? { uri: source } : logoSVG}
    />
  );
};
