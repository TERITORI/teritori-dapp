import React from "react";
import { View, ViewStyle } from "react-native";

import SideNotchSVG from "../../../../assets/sidebar/side-notch.svg";
import { SVG } from "../../SVG";

import { primaryColor, rakkiYellow } from "@/utils/style/colors";

export const SideNotch: React.FC<{
  sidebarItemId?: string;
  style?: ViewStyle;
}> = ({ sidebarItemId, style }) => {
  return (
    <View
      style={[
        {
          position: "absolute",
          flex: 1,
          flexDirection: "row",
          left: 0,
          top: 0,
          bottom: 0,
        },
        style,
      ]}
    >
      <SVG
        source={SideNotchSVG}
        color={sidebarItemId === "rakki" ? rakkiYellow : primaryColor}
      />
    </View>
  );
};
