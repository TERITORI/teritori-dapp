import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";

export const Label: React.FC<TextProps & { styleType: string }> = ({
  style,
  styleType = "base",
  children,
  ...otherProps
}) => {
  return (
    <Text style={[(styles as any)[styleType], style]} {...otherProps}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  H1_Bebas_80: {
    fontFamily: "Bebas Neue",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 80,
    lineHeight: 96,
  },
  H1_Bebas_40: {
    fontFamily: "Bebas Neue",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 40,
    lineHeight: 96,
  },
  H2_DHBS_80: {
    fontFamily: "Dafter Harder Better Stronger",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 80,
    lineHeight: 96,
  },
  H2_DHBS_40: {
    fontFamily: "Dafter Harder Better Stronger",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 40,
    lineHeight: 96,
  },
  T2_Bebas_50: {
    fontFamily: "Bebas Neue",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 50,
    lineHeight: 96,
  },
  T2_Bebas_20: {
    fontFamily: "Bebas Neue",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 20,
    lineHeight: 96,
  },
  T1_Bebas_20: {
    fontFamily: "Bebas Neue",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 20,
    lineHeight: 96,
  },
  T1_DHBS_20: {
    fontFamily: "Dafter Harder Better Stronger",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 20,
    lineHeight: 96,
  },
  T1_Bebas_15: {
    fontFamily: "Bebas Neue",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 15,
    lineHeight: 96,
  },
});
