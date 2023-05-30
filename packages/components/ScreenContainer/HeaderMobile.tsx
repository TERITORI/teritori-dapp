import React, { FC } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import hamburgerCrossSVG from "../../../assets/icons/hamburger-button-cross.svg";
import hamburgerSVG from "../../../assets/icons/hamburger-button.svg";
import { useSidebar } from "../../context/SidebarProvider";
import { NetworkKind } from "../../networks";
import { neutral00, neutral33 } from "../../utils/style/colors";
import { layout, MOBILE_HEADER_HEIGHT } from "../../utils/style/layout";
import { NetworkSelectorMobile } from "../NetworkSelector/NetworkSelectorMobile";
import { SVG } from "../SVG";
import { SearchButtonMobile } from "../Search/SearchButtonMobile";
import { ConnectWalletButtonMobile } from "../TopMenu/ConnectWalletButtonMobile";
import { TopLogoMobile } from "../navigation/components/TopLogoMobile";
import { SpacerRow } from "../spacer";

export const HeaderMobile: FC<{
  forceNetworkId?: string;
  forceNetworkKind?: NetworkKind;
}> = ({ forceNetworkId, forceNetworkKind }) => {
  const { isSidebarExpanded, toggleSidebar } = useSidebar();

  return (
    <View style={styles.container}>
      <TopLogoMobile />
      <View style={styles.rightContainer}>
        <SearchButtonMobile />
        <SpacerRow size={2} />
        <NetworkSelectorMobile
          forceNetworkId={forceNetworkId}
          forceNetworkKind={forceNetworkKind}
        />
        <SpacerRow size={2} />
        <ConnectWalletButtonMobile />
        <SpacerRow size={2} />
        <TouchableOpacity onPress={toggleSidebar}>
          <SVG
            source={isSidebarExpanded ? hamburgerCrossSVG : hamburgerSVG}
            width={32}
            height={32}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: MOBILE_HEADER_HEIGHT,
    maxHeight: MOBILE_HEADER_HEIGHT,
    width: "100%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: neutral33,
    borderBottomWidth: 1,
    paddingHorizontal: layout.padding_x1_5,
    position: "absolute",
    top: 0,
    zIndex: 99999,
    backgroundColor: neutral00,
  },
  rightContainer: {
    height: MOBILE_HEADER_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
  },
});
