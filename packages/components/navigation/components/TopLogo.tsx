import React from "react";
import { View, TouchableOpacity, ViewStyle } from "react-native";

import logoTopVersionSVG from "../../../../assets/logos/logo-hexagon-version-alpha.svg";
import { useAppNavigation } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";
import { SVG } from "../../SVG";

export const TopLogo = () => {
  // variables
  const navigation = useAppNavigation();

  // returns
  return (
    <View style={topDetailContainerStyle}>
      <TouchableOpacity
        style={topIconContainerStyle}
        onPress={() => navigation.navigate("Home")}
      >
        <SVG width={68} height={68} source={logoTopVersionSVG} />
      </TouchableOpacity>
    </View>
  );
};

const topDetailContainerStyle: ViewStyle = {
  flex: 1,
  justifyContent: "center",
};
const topIconContainerStyle: ViewStyle = {
  paddingLeft: layout.padding_x0_5,
};
