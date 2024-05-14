import React, { FC, ReactNode } from "react";
import { View } from "react-native";

import { useIsMobile } from "@/hooks/useIsMobile";
import { mineShaftColor } from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";

// Data row used for tables at left (always visible)
export const TableStaticRow: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const isMobile = useIsMobile();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        borderColor: mineShaftColor,
        borderBottomWidth: 1,
        paddingHorizontal: isMobile ? layout.spacing_x1 : layout.spacing_x2_5,
        height: 50,
      }}
    >
      {children}
    </View>
  );
};
