import React from "react";
import { View } from "react-native";

import { Label } from "../label/Label";

export const Round: React.FC<{ round: number }> = ({ round }) => (
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
      Round {round}
    </Label>
  </View>
);
