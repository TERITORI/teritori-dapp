// libraries
import React from "react";
import { View, ViewStyle } from "react-native";

import { genericStyles } from "../../utils/style/genericStyles";

export interface DivProps {
  jc?: ViewStyle["justifyContent"];
  ai?: ViewStyle["alignItems"];
  style?: ViewStyle;
}

export const DivColumn: React.FC<DivProps> = ({ children, jc, ai, style }) => (
  <View
    style={[
      genericStyles.column,
      {
        justifyContent: jc,
        alignItems: ai,
        ...style,
      },
    ]}
  >
    {children}
  </View>
);
