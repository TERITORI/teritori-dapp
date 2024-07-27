import React from "react";
import { View } from "react-native";

import { CellBrandText } from "@/components/table/TableTextCell";
import { lightblue, neutral00 } from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";

export const StateBadge: React.FC<{
  text: string;
}> = ({ text }) => {
  return (
    <View
      style={{
        backgroundColor: lightblue,
        borderRadius: 100,
        paddingHorizontal: layout.spacing_x1_25,
        paddingVertical: layout.spacing_x0_75,
        alignSelf: "flex-start",
      }}
    >
      <CellBrandText style={{ color: neutral00 }}>{text}</CellBrandText>
    </View>
  );
};
