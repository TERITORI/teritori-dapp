import React from "react";
import { TextProps } from "react-native";

import "./BrandText.css";
import { BrandTextBase } from "./BrandTextBase";

export const BrandText: React.FC<TextProps> = (props) => {
  const { style, ...otherProps } = props;
  return (
    <BrandTextBase style={[{ fontFamily: "Exo" }, style]} {...otherProps} />
  );
};
