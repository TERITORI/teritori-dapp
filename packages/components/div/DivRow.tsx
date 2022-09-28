import React from "react";
import { View } from "react-native";

import { DivProps } from "./DivColumn";

export const DivRow: React.FC<DivProps> = ({
  children,
  jc,
  ai = "center",
  style,
}) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: jc,
      alignItems: ai,
      ...style,
    }}
  >
    {children}
  </View>
);
