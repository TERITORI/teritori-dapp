import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { SVG } from "./SVG";
import { CustomPressable } from "./buttons/CustomPressable";
import { neutral77, secondaryColor } from "../utils/style/colors";

interface IconBoxProps {
  onPress: () => void;
  icon: React.FC<SvgProps>;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  iconProps?: {
    height: number;
    width: number;
    color?: string;
  };
}

export const IconBox = ({
  onPress,
  icon,
  style,
  disabled,
  iconProps = {
    height: 20,
    width: 20,
  },
}: IconBoxProps) => {
  return (
    <CustomPressable
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
      onPress={() => !disabled && onPress()}
    >
      <SVG
        source={icon}
        width={iconProps.width}
        height={iconProps.height}
        color={iconProps.color || disabled ? neutral77 : secondaryColor}
      />
    </CustomPressable>
  );
};
