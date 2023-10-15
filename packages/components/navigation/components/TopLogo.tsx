import React from "react";
import { View, TouchableOpacity } from "react-native";

import logoTopVersionSVG from "../../../../assets/logos/logo-hexagon-version-alpha.svg";
import { isElectron } from "../../../utils/isElectron";
import { useAppNavigation } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";
import { SVG } from "../../SVG";
const LOGO_SIZE = isElectron() ? 38 : 68;

export const TopLogo = () => {
  const navigation = useAppNavigation();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <TouchableOpacity
        style={{
          marginHorizontal: layout.spacing_x0_5,
          marginTop: isElectron() ? 20 : 0,
        }}
        onPress={() => navigation.navigate("Home")}
      >
        <SVG width={LOGO_SIZE} height={LOGO_SIZE} source={logoTopVersionSVG} />
      </TouchableOpacity>
    </View>
  );
};
