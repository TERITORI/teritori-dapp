import React from "react";

import radioButtonSVG from "../../assets/icons/radio-button.svg";
import { neutral33, primaryColor } from "../utils/style/colors";
import { SVG } from "./SVG";

interface RadioButtonProps {
  selected: boolean;
}

export const RadioButton: React.FC<RadioButtonProps> = ({ selected }) => {
  return (
    <SVG
      source={radioButtonSVG}
      color={selected ? primaryColor : neutral33}
      width={24}
      height={24}
    />
  );
};
