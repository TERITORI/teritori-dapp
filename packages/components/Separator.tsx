// libraries
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { neutral44 } from "../utils/style/colors";

type SeparatorProps = {
  style?: ViewStyle;
  color?: string;
};

export const Separator: React.FC<SeparatorProps> = ({
  style,
  color = neutral44,
}: SeparatorProps) => {
  // returns
  return <View style={[styles.container, { backgroundColor: color }, style]} />;
};
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 1,
  },
});
