import { useNavigation } from "@react-navigation/native";
import React, { FC } from "react";
import { View, TouchableOpacity, Platform, ViewStyle } from "react-native";
import { useSelector } from "react-redux";

import hamburgerCrossSVG from "../../../assets/icons/hamburger-button-cross.svg";
import hamburgerSVG from "../../../assets/icons/hamburger-button.svg";
import { useSidebar } from "../../context/SidebarProvider";
import { NetworkFeature, NetworkKind } from "../../networks";
import { selectAllSelectedNFTData } from "../../store/slices/marketplaceCartItems";
import { neutral00, neutral33 } from "../../utils/style/colors";
import { layout, MOBILE_HEADER_HEIGHT } from "../../utils/style/layout";
import { NetworkSelectorMobile } from "../NetworkSelector/NetworkSelectorMobile";
import { SVG } from "../SVG";
import { SearchButtonMobile } from "../Search/SearchButtonMobile";
import { ConnectWalletButtonMobile } from "../TopMenu/ConnectWalletButtonMobile";
import { TogglePlayerButton } from "../mediaPlayer/TogglePlayerButton";
import { BackButton } from "../navigation/components/BackButton";
import { CartIconButtonBadge } from "../navigation/components/CartIconButtonBadge";
import { TopLogo } from "../navigation/components/TopLogo";
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
  const navigation = useNavigation();

  return (
    <View style={containerCStyle}>
      <TopLogo height={48} />
      <View style={rightContainerCStyle}>
        {onBackPress && (
          <>
            <SpacerRow size={1} />
            <BackButton onPress={onBackPress} />
          </>
        )}
        <SpacerRow size={1} />
        <TogglePlayerButton />
        <SpacerRow size={1} />
        <SearchButtonMobile />

        {!!selectedNFTDataInCart.length && (
          <>
            <SpacerRow size={1} />
            <CartIconButtonBadge isMobile />
          </>
        )}

        <SpacerRow size={1} />

        <NetworkSelectorMobile
          forceNetworkId={forceNetworkId}
          forceNetworkKind={forceNetworkKind}
          forceNetworkFeatures={forceNetworkFeatures}
        />
        <SpacerRow size={1} />
        <ConnectWalletButtonMobile />
        <SpacerRow size={1} />
        <TouchableOpacity
          onPress={() => {
            if (Platform.OS === "web") {
              toggleSidebar();
            } else {
              // @ts-expect-error: description todo
              navigation.openDrawer();
            }
          }}
        >
          <SVG
            source={
              Platform.OS === "web" && isSidebarExpanded
                ? hamburgerCrossSVG
                : hamburgerSVG
            }
            width={32}
            height={32}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const containerCStyle: ViewStyle = {
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
};

const rightContainerCStyle: ViewStyle = {
  height: MOBILE_HEADER_HEIGHT,
  flexDirection: "row",
  alignItems: "center",
};
