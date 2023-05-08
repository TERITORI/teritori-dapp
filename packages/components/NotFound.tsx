import React from "react";
import { View } from "react-native";

import { layout } from "../utils/style/layout";
import { BrandText } from "./BrandText";

export const NotFound: React.FC<{ label: string }> = ({ label }) => {
  return (
    <View
      style={{
        alignItems: "center",
        width: "100%",
        marginTop: layout.padding_x4,
      }}
    >
      <BrandText>{label} not found</BrandText>
    </View>
  );
};
