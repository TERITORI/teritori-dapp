import React from "react";
import { StyleSheet, View } from "react-native";

import { genericStyles } from "../../utils/style/genericStyles";
import { DivProps } from "./DivColumn";

export const DivRow: React.FC<DivProps> = ({
  children,
  jc,
  ai = "center",
  style,
}) => (
  <View
    style={[
      genericStyles.row,
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
