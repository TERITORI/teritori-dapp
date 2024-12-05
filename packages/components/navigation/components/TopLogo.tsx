import React from "react";
import { View, TouchableOpacity, ViewStyle, StyleProp } from "react-native";

import logoTopVersionSVG from "@/assets/logos/logo-hexagon-version-alpha.svg";
import { SVG } from "@/components/SVG";
import { useAppConfig } from "@/context/AppConfigProvider";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";

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
      preserveAspectRatio="xMinYMin meet"
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
