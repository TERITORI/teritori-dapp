import React from "react";
import { View, ViewStyle, StyleProp } from "react-native";

import { neutral33 } from "../utils/style/colors";
import {
  headerHeight,
  screenContainerContentMarginHorizontal,
  screenContainerContentMarginHorizontalSmall,
} from "../utils/style/layout";

export const Header: React.FC<{
  smallMargin?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ smallMargin, children, style }) => {
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
          marginLeft: smallMargin
            ? screenContainerContentMarginHorizontalSmall
            : screenContainerContentMarginHorizontal,
        }}
      >
        <>{children}</>
      </View>

      {/* Wallet selector placeholder */}
      <View />
    </View>
  );
};
