import React from "react";
import { TouchableOpacity, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { neutral33, secondaryColor } from "../utils/style/colors";
import { SVG } from "./SVG";

interface CircleIconBoxProps {
  onPress: () => void;
  icon: React.FC<SvgProps>;
  style?: ViewStyle;
  iconProps?: {
    height: number;
    width: number;
    color: string;
  };
}

export const CircleIconBox = ({
  onPress,
  icon,
  style,
  iconProps = {
    height: 20,
    width: 20,
    color: secondaryColor,
  },
}: CircleIconBoxProps) => (
  <TouchableOpacity
    activeOpacity={0.8}
    style={[
      {
        height: 32,
        width: 32,
        borderRadius: 24,
        backgroundColor: neutral33,
        alignItems: "center",
        justifyContent: "center",
      },
      style,
    ]}
    onPress={onPress}
  >
    <SVG
      source={icon}
      width={iconProps.width}
      height={iconProps.height}
      color={iconProps.color}
    />
  </TouchableOpacity>
);
