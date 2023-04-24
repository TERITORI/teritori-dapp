import React from "react";
import { View } from "react-native";

import { Label } from "../label/Label";

export const HeaderItem: React.FC<{
  text: string;
  datumWidth: number;
  roundWidth: number;
}> = ({ text, roundWidth, datumWidth }) => (
  <View
    style={{
      justifyContent: "center",
      width: text === "" ? roundWidth : datumWidth,
    }}
  >
    <Label
      styleType="T2_Bebas_20"
      style={{
        justifyContent: "center",
        textAlign: "center",
        color: "#E8E1EF",
      }}
    >
      {text}
    </Label>
  </View>
);
