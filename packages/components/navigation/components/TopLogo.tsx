import React from "react";
import { View, TouchableOpacity, ViewStyle } from "react-native";

import logoTopVersionSVG from "../../../../assets/logos/logo-hexagon-version-alpha.svg";
import { layout } from "../../../utils/style/layout";
import { SVG } from "../../SVG";

import { useAppConfig } from "@/context/AppConfigProvider";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";

export const TopLogo = () => {
  const navigation = useAppNavigation();
  const { homeScreen } = useAppConfig();

  const logo = <SVG width={68} height={68} source={logoTopVersionSVG} />;

  const style: ViewStyle = {
    marginHorizontal: layout.spacing_x0_5,
  };

  const content =
    homeScreen === "Home" ? (
      <TouchableOpacity
        style={style}
        onPress={() => navigation.navigate(homeScreen as any)}
      >
        {logo}
      </TouchableOpacity>
    ) : (
      <View style={style}>{logo}</View>
    );

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      {content}
    </View>
  );
};
