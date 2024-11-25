import React, { FC, ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { tableColumnsGap } from "@/components/table/utils";

export const TableCell: FC<{
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}> = ({ children, style }) => {
  return (
    <View
      style={[
        {
          marginRight: tableColumnsGap,
          flexDirection: "row",
          alignItems: "center",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};
