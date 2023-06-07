// libraries
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { neutral44 } from "../utils/style/colors";

type SeparatorProps = {
  style?: ViewStyle;
  color?: string;
  horizontal?: boolean;
};

export const Separator: React.FC<SeparatorProps> = ({
  style,
  color = neutral44,
  horizontal,
}: SeparatorProps) => {
  // returns
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: color,
          ...(horizontal ? { width: 1, height: "100%" } : {}),
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 1,
  },
});
