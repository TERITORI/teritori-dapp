import { ReactNode } from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";

export type LinkProps = {
  to?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle | TextStyle>;
};
