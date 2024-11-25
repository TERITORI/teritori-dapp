import React from "react";
import { View } from "react-native";

import { Label } from "../label/Label";

export const Date: React.FC<{ date: string }> = ({ date }) => (
  <View
    style={{
      justifyContent: "center",
    }}
  >
    <Label
      styleType="T2_Bebas_20"
      style={{
        color: "#E8E1EF",
        transform: [{ rotate: "-90deg" }],
      }}
    >
      {date}
    </Label>
  </View>
);
