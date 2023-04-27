import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { Label } from "../label/Label";

export const Datum: React.FC<{
  value: number | string;
  datumWidth: number;
  styleTypeSize: string;
  style: StyleProp<ViewStyle>;
}> = ({ value, datumWidth, styleTypeSize, style }) => (
  <View style={[style, { borderRadius: 10, marginRight: -15 }]}>
    <Label
      styleType={`H1_Bebas_${styleTypeSize}`}
      style={{ textAlign: "center", color: "#E8E1EF" }}
    >
      {value}
    </Label>
  </View>
);
