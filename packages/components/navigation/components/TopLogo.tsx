import React from "react";
import { View, TouchableOpacity, ViewStyle, StyleProp } from "react-native";

import logoTopVersionSVG from "@/assets/logos/logo-hexagon-version-alpha.svg";
import { SVG } from "@/components/SVG";
import { useAppConfig } from "@/context/AppConfigProvider";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";

const viewPort = { width: 188, height: 68 }; // from the svg code

export const TopLogo: React.FC<{
  height: number;
  style?: StyleProp<ViewStyle>;
}> = ({ height, style }) => {
  const navigation = useAppNavigation();
  const { homeScreen, logo: configLogo } = useAppConfig();

  const logoSource = configLogo || logoTopVersionSVG;
  const logo = (
    <SVG
      height={height}
      width={(height / viewPort.height) * viewPort.width}
      source={logoSource}
    />
  );

  return homeScreen === "Home" ? (
    <TouchableOpacity
      style={style}
      onPress={() => navigation.navigate(homeScreen as any)}
    >
      {logo}
    </TouchableOpacity>
  ) : (
    <View style={style}>{logo}</View>
  );
};
