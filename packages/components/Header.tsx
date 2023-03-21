import React from "react";
import { View, ViewStyle, StyleProp, Platform } from "react-native";

import { useMaxResolution } from "../hooks/useMaxResolution";
import { neutral33 } from "../utils/style/colors";
import {
  headerHeight,
  layout,
  screenContainerContentMarginHorizontal,
} from "../utils/style/layout";

export const Header: React.FC<{
  smallMargin?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ children, style }) => {
  const { width } = useMaxResolution();
  return (
    <View
      style={[
        {
          height: headerHeight,
          maxHeight: headerHeight,
          width: "100%",
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomColor: neutral33,
          borderBottomWidth: 1,
        },
        style,
      ]}
    >
      <View
        style={{
          width: "100%",
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          marginLeft:
            width > 500
              ? screenContainerContentMarginHorizontal
              : layout.padding_x1,
        }}
      >
        <>{children}</>
      </View>

      {/* Wallet selector placeholder */}
      {/* <View /> */}
    </View>
  );
};
