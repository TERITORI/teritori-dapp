import React from "react";
import { View, TouchableOpacity } from "react-native";
import { SvgProps } from "react-native-svg";

import governanceSVG from "../../../assets/icons/governance.svg";
import guardiansSVG from "../../../assets/icons/guardians.svg";
import launchpadSVG from "../../../assets/icons/launchpad.svg";
import marketplaceSVG from "../../../assets/icons/marketplace.svg";
import sidebarBottomSVG from "../../../assets/sidebar/bottom.svg";
import sidebarContainerSelectedSVG from "../../../assets/sidebar/container-selected.svg";
import sidebarContainerSVG from "../../../assets/sidebar/container.svg";
import sidebarTopSVG from "../../../assets/sidebar/top.svg";
import { getCurrentRouteName, useAppNavigation } from "../../utils/navigation";
import { neutral33 } from "../../utils/style/colors";
import { sidebarWidth } from "../../utils/style/layout";
import { SVG } from "../SVG";

const SidebarButton: React.FC<{
  iconSVG: React.FC<SvgProps>;
  selected?: boolean;
  onPress?: () => void;
}> = ({ selected, iconSVG, onPress }) => {
  return (
    <View
      style={{ alignItems: "center", justifyContent: "center", height: 88 }}
    >
      <TouchableOpacity onPress={onPress} disabled={selected}>
        {selected ? (
          <SVG width={68} height={68} source={sidebarContainerSelectedSVG} />
        ) : (
          <SVG width={54} height={54} source={sidebarContainerSVG} />
        )}
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SVG width={40} height={40} source={iconSVG} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const borderWidth = 1;
const menuWidth = 72;

export const Sidebar: React.FC = () => {
  const navigation = useAppNavigation();
  const currentRouteName = getCurrentRouteName(navigation);
  return (
    <View
      style={{
        width: sidebarWidth,
        maxWidth: sidebarWidth,
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-end",
      }}
    >
      <SVG width={menuWidth} height={64} source={sidebarTopSVG} preserveAspectRatio="none"/>
      <View
        style={{
          borderLeftColor: neutral33,
          borderLeftWidth: borderWidth,
          width: menuWidth,
          backgroundColor: "rgba(56, 58, 87, 0.5)",
        }}
      >
        <SidebarButton
          selected={currentRouteName === "Marketplace"}
          iconSVG={marketplaceSVG}
          onPress={() => navigation.navigate("Marketplace")}
        />
        <SidebarButton
          selected={currentRouteName === "Launchpad"}
          iconSVG={launchpadSVG}
          onPress={() => navigation.navigate("Launchpad")}
        />
        <SidebarButton
          selected={currentRouteName === "GuardiansGame"}
          iconSVG={guardiansSVG}
          onPress={() => navigation.navigate("GuardiansGame")}
        />
        <SidebarButton
          selected={currentRouteName === "Governance"}
          iconSVG={governanceSVG}
          onPress={() => navigation.navigate("Governance")}
        />
      </View>
      <SVG width={menuWidth} height={64} source={sidebarBottomSVG} preserveAspectRatio="none"/>
    </View>
  );
};
