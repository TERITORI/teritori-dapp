import React from "react";
import { View, ViewStyle } from "react-native";

interface OutsideClickWrapperProps {
  children: React.ReactNode;
  onOutsideClick: () => void;
  style?: ViewStyle;
}

export const OutsideClickWrapper: React.FC<OutsideClickWrapperProps> = ({
  children,
  onOutsideClick,
  style,
}) => {
  return <View style={style}>{children}</View>;
};
