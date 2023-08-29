import React from "react";
import { View, ViewStyle } from "react-native";

import SideNotchSVG from "../../../../assets/sidebar/side-notch.svg";
import { SVG } from "../../SVG";

export const SideNotch: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  return (
    <View style={[containerStyle, style]}>
      <SVG source={SideNotchSVG} />
    </View>
  );
};

const containerStyle: ViewStyle = {
  position: "absolute",
  flex: 1,
  flexDirection: "row",
  left: 0,
  top: 0,
  bottom: 0,
};
