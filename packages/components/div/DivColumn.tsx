// libraries
import React from "react";
import { View, ViewStyle } from "react-native";

export interface DivProps {
  jc?: ViewStyle["justifyContent"];
  ai?: ViewStyle["alignItems"];
  style?: ViewStyle;
}

export const DivColumn: React.FC<DivProps> = ({ children, jc, ai, style }) => (
  <View
    style={{
      flexDirection: "column",
      justifyContent: jc,
      alignItems: ai,
      ...style,
    }}
  >
    {children}
  </View>
);
