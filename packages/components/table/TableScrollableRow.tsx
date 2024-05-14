import React, { FC, ReactNode } from "react";
import { View } from "react-native";

import { mineShaftColor } from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";

// Data row used for tables at right in a ScrollView
export const TableScrollableRow: FC<{
  children: ReactNode;
}> = ({ children }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        borderColor: mineShaftColor,
        borderBottomWidth: 1,
        paddingVertical: layout.spacing_x2,
        height: 50,
      }}
    >
      {children}
    </View>
  );
};
