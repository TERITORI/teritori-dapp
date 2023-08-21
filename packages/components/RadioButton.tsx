import React from "react";
import { View } from "react-native";

import { SVG } from "./SVG";
import radioButtonSVG from "../../assets/icons/radio-button.svg";
import { neutral33, primaryColor } from "../utils/style/colors";

interface RadioButtonProps {
  selected: boolean;
}

export const RadioButton: React.FC<RadioButtonProps> = ({ selected }) => {
  const size = 24;
  return (
    <View style={{ width: size, height: size }}>
      <SVG
        source={radioButtonSVG}
        color={selected ? primaryColor : neutral33}
        width={size}
        height={size}
      />
    </View>
  );
};
