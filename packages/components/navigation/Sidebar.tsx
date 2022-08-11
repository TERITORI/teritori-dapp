import React from "react";
import {
  View,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native";

import governanceIconPNG from "../../../assets/icons/governance.png";
import guardiansIconPNG from "../../../assets/icons/guardians.png";
import launchpadIconPNG from "../../../assets/icons/launchpad.png";
import marketplaceIconPNG from "../../../assets/icons/marketplace.png";
import sidebarBottomPNG from "../../../assets/sidebar-bottom.png";
import sidebarContainerSelectedPNG from "../../../assets/sidebar-container-selected.png";
import sidebarContainerPNG from "../../../assets/sidebar-container.png";
import sidebarTopPNG from "../../../assets/sidebar-top.png";
import { neutral33 } from "../../utils/style/colors";
import { sidebarWidth } from "../../utils/style/layout";
import { getCurrentRouteName, useAppNavigation } from "../../utils/navigation";

const SidebarButton: React.FC<{
  source: ImageSourcePropType;
  selected?: boolean;
  onPress?: () => void;
}> = ({ selected, source, onPress }) => {
  return (
    <View
      style={{ alignItems: "center", justifyContent: "center", height: 88 }}
    >
      <TouchableOpacity onPress={onPress} disabled={selected}>
        {selected ? (
          <Image
            source={sidebarContainerSelectedPNG}
            style={{ width: 68, height: 68, resizeMode: "stretch" }}
          />
        ) : (
          <Image
            source={sidebarContainerPNG}
            style={{ width: 54, height: 54, resizeMode: "stretch" }}
          />
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
          <Image
            source={source}
            style={{ width: 40, height: 40, resizeMode: "stretch" }}
          />
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
      <Image
        source={sidebarTopPNG}
        style={{
          width: menuWidth,
          height: 64,
          resizeMode: "stretch",
        }}
      />
      <View
        style={{
          borderLeftColor: neutral33,
          borderLeftWidth: borderWidth,
          width: menuWidth - borderWidth,
          backgroundColor: "rgba(56, 58, 87, 0.5)",
        }}
      >
        <SidebarButton
          selected={currentRouteName === "Marketplace"}
          source={marketplaceIconPNG}
          onPress={() => navigation.navigate("Marketplace")}
        />
        <SidebarButton
          selected={currentRouteName === "Launchpad"}
          source={launchpadIconPNG}
          onPress={() => navigation.navigate("Launchpad")}
        />
        <SidebarButton
          selected={currentRouteName === "GuardiansGame"}
          source={guardiansIconPNG}
          onPress={() => navigation.navigate("GuardiansGame")}
        />
        <SidebarButton
          selected={currentRouteName === "Governance"}
          source={governanceIconPNG}
          onPress={() => navigation.navigate("Governance")}
        />
      </View>
      <Image
        source={sidebarBottomPNG}
        style={{ width: menuWidth, height: 64, resizeMode: "stretch" }}
      />
    </View>
  );
};
