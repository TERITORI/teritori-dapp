import React from "react";
import { View, TouchableOpacity, ViewStyle, StyleProp } from "react-native";

import logoTopSVG from "../../assets/logos/logo-hexagon.svg";
import { useAppNavigation } from "../utils/navigation";
import { neutral33 } from "../utils/style/colors";
import {
  headerHeight,
  headerMarginHorizontal,
  screenContainerContentMarginHorizontal,
} from "../utils/style/layout";
import { SVG } from "./SVG";

export const Header: React.FC<{
  style?: StyleProp<ViewStyle>;
}> = ({ children, style }) => {
  const navigation = useAppNavigation();

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
          marginLeft: screenContainerContentMarginHorizontal,
        }}
      >
        <>{children}</>
      </View>

      {/* Wallet selector placeholder */}
      <View />
    </View>
  );
};
