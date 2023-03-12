import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";

export const Label: React.FC<TextProps & { styleType: string }> = (props) => {
  const { style, styleType = "base", ...otherProps } = props;

  return (
    <Text style={[(styles as any)[styleType], style]} {...otherProps}>
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  H1_80: {
    fontFamily: "Bebas Neue",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 80,
    lineHeight: 96,
  },
  H1_40: {
    fontFamily: "Bebas Neue",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 40,
    lineHeight: 96,
  },
  H2_80: {
    fontFamily: "Bebas Neue",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 80,
    lineHeight: 96,
  },
  H2_40: {
    fontFamily: "Bebas Neue",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 40,
    lineHeight: 96,
  },
  T2_50: {
    fontFamily: "Bebas Neue",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 50,
    lineHeight: 96,
  },
  T2_20: {
    fontFamily: "Bebas Neue",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 20,
    lineHeight: 96,
  },
  T1_20: {
    fontFamily: "Bebas Neue",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 20,
    lineHeight: 96,
  },
  T1_15: {
    fontFamily: "Bebas Neue",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 15,
    lineHeight: 96,
  },
});
