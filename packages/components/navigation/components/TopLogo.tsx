import React from "react";
import { View, TouchableOpacity } from "react-native";

import logoTopVersionSVG from "../../../../assets/logos/logo-hexagon-version-alpha.svg";
import { layout } from "../../../utils/style/layout";
import { SVG } from "../../SVG";

import { router } from "@/utils/router";

export const TopLogo = () => {
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
        }}
        onPress={() => router.navigate("")}
      >
        <SVG width={68} height={68} source={logoTopVersionSVG} />
      </TouchableOpacity>
    </View>
  );
};
