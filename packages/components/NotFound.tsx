import React from "react";
import { View } from "react-native";

import { BrandText } from "./BrandText";
import { layout } from "../utils/style/layout";

export const NotFound: React.FC<{ label: string }> = ({ label }) => {
  return (
    <View
      style={{
        alignItems: "center",
        width: "100%",
        marginTop: layout.spacing_x4,
      }}
    >
      <BrandText>{label} not found</BrandText>
    </View>
  );
};
