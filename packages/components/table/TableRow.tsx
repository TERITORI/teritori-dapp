import React, { FC, ReactNode } from "react";
import { View } from "react-native";

import {
  tablePaddingHorizontal,
  tableRowHeight,
} from "@/components/table/utils";
import { mineShaftColor } from "@/utils/style/colors";

export const TableRow: FC<{
  children: ReactNode;
}> = ({ children }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        borderBottomColor: mineShaftColor,
        borderBottomWidth: 1,
        paddingHorizontal: tablePaddingHorizontal,
        height: tableRowHeight,
      }}
    >
      {children}
    </View>
  );
};
