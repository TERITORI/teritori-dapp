import { StyleProp, StyleSheet, TextStyle } from "react-native";

import { BrandText } from "../BrandText";

export interface GradientTextProps {
  style: StyleProp<Pick<TextStyle, "fontFamily" | "fontWeight" | "fontSize">>;
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  style,
}) => {
  const flatStyle = StyleSheet.flatten(style);
  return <BrandText style={flatStyle}>{children}</BrandText>;
};
