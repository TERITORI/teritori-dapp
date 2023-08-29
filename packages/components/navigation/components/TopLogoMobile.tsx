import React, { FC } from "react";
import { View, TouchableOpacity, ViewStyle } from "react-native";

import logoTopVersionMobileSVG from "../../../../assets/logos/logo-version-alpha-small.svg";
import { useAppNavigation } from "../../../utils/navigation";
import { SVG } from "../../SVG";

export const TopLogoMobile: FC = () => {
  const navigation = useAppNavigation();

  return (
    <View style={topDetailContainerStyle}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <SVG width={48} height={48} source={logoTopVersionMobileSVG} />
      </TouchableOpacity>
    </View>
  );
};

const topDetailContainerStyle: ViewStyle = {
  flex: 1,
  justifyContent: "center",
};
