import React, { FC } from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import { Notification } from "./Notification";
import hamburgerCrossSVG from "../../../assets/icons/hamburger-button-cross.svg";
import hamburgerSVG from "../../../assets/icons/hamburger-button.svg";
import { useSidebar } from "../../context/SidebarProvider";
import { NetworkFeature, NetworkKind } from "../../networks";
import { selectAllSelectedNFTData } from "../../store/slices/marketplaceCartItems";
import { useAppNavigation } from "../../utils/navigation";
import { neutral00, neutral33 } from "../../utils/style/colors";
import { layout, MOBILE_HEADER_HEIGHT } from "../../utils/style/layout";
import { NetworkSelectorMobile } from "../NetworkSelector/NetworkSelectorMobile";
import { SVG } from "../SVG";
import { SearchButtonMobile } from "../Search/SearchButtonMobile";
import { ConnectWalletButtonMobile } from "../TopMenu/ConnectWalletButtonMobile";
import { BackButton } from "../navigation/components/BackButton";
import { CartIconButtonBadge } from "../navigation/components/CartIconButtonBadge";
import { TopLogoMobile } from "../navigation/components/TopLogoMobile";
import { SpacerRow } from "../spacer";

export const HeaderMobile: FC<{
  forceNetworkId?: string;
  forceNetworkKind?: NetworkKind;
  forceNetworkFeatures?: NetworkFeature[];
  onBackPress?: () => void;
}> = ({
  forceNetworkId,
  forceNetworkKind,
  forceNetworkFeatures,
  onBackPress,
}) => {
  const { isSidebarExpanded, toggleSidebar } = useSidebar();
  const selectedNFTDataInCart = useSelector(selectAllSelectedNFTData);
  const navigation = useAppNavigation();

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <TopLogoMobile />
        <View style={styles.rightContainer}>
          <SpacerRow size={1} />
          {onBackPress && <BackButton onPress={onBackPress} />}
          <SpacerRow size={1} />
          <SearchButtonMobile />

          {!!selectedNFTDataInCart.length && (
            <>
              <SpacerRow size={1} />
              <CartIconButtonBadge isMobile />
              <SpacerRow size={1} />
            </>
          )}

          <NetworkSelectorMobile
            forceNetworkId={forceNetworkId}
            forceNetworkKind={forceNetworkKind}
            forceNetworkFeatures={forceNetworkFeatures}
          />
          <SpacerRow size={1} />
          <ConnectWalletButtonMobile />
          <SpacerRow size={1} />
          <Notification />

          <TouchableOpacity
            onPress={() => {
              if (["android", "ios"].includes(Platform.OS)) {
                navigation.openDrawer();
              } else {
                toggleSidebar();
              }
            }}
          >
            <SVG
              source={isSidebarExpanded ? hamburgerCrossSVG : hamburgerSVG}
              width={32}
              height={32}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
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
    paddingHorizontal: layout.spacing_x1_5,
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
