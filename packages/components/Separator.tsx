// libraries
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { neutral44 } from "../utils/style/colors";

type SeparatorProps = {
  style?: ViewStyle;
};

export const Separator = ({ style }: SeparatorProps) => {
  // returns
  return <View style={[styles.container, style]} />;
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: neutral44,
    width: "100%",
    height: 1,
  },
});
