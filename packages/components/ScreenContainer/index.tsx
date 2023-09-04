import React, { useMemo, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

import { Header } from "./Header";
import { ScreenContainerMobile } from "./ScreenContainerMobile";
import { useForceNetworkKind } from "../../hooks/useForceNetworkKind";
import { useForceNetworkSelection } from "../../hooks/useForceNetworkSelection";
import { useForceUnselectNetworks } from "../../hooks/useForceUnselectNetworks";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { NetworkFeature, NetworkInfo, NetworkKind } from "../../networks";
import { DAppStoreData } from "../../screens/DAppStore/components/DAppStoreData";
import {
  getResponsiveScreenContainerMarginHorizontal,
  headerHeight,
  headerMarginHorizontal,
  layout,
  screenContainerContentMarginHorizontal,
} from "../../utils/style/layout";
import { NetworkSelector } from "../NetworkSelector/NetworkSelector";
import { SearchBar } from "../Search/SearchBar";
import { SelectedNetworkGate } from "../SelectedNetworkGate";
import { Separator } from "../Separator";
import { ConnectWalletButton } from "../TopMenu/ConnectWalletButton";
import { Footer } from "../footers/Footer";
import { MediaPlayerBar } from "../mediaPlayer/MediaPlayerBar";
import { TogglePlayerButton } from "../mediaPlayer/TogglePlayerButton";
import { Sidebar } from "../navigation/Sidebar";
import { CartIconButtonBadge } from "../navigation/components/CartIconButtonBadge";

export const ScreenContainer: React.FC<{
  headerChildren?: JSX.Element;
  footerChildren?: React.ReactNode;
  mobileTitle?: string;
  hideSidebar?: boolean;
  noMargin?: boolean;
  noScroll?: boolean;
  fullWidth?: boolean;
  forceNetworkId?: string;
  forceNetworkKind?: NetworkKind;
  forceNetworkFeatures?: NetworkFeature[];
  responsive?: boolean;
  isLarge?: boolean;
  onBackPress?: () => void;
  maxWidth?: number;
}> = ({
  children,
  headerChildren,
  footerChildren,
  mobileTitle,
  hideSidebar,
  noMargin,
  noScroll,
  fullWidth,
  responsive,
  isLarge,
  onBackPress,
  maxWidth,
  forceNetworkId,
  forceNetworkKind,
  forceNetworkFeatures,
}) => {
  const { height } = useWindowDimensions();
  const hasMargin = !noMargin;
  const hasScroll = !noScroll;
  const { width: screenWidth, contentWidth } = useMaxResolution({
    responsive,
    noMargin,
    isLarge,
  });
  const isMobile = useIsMobile();

  const calculatedWidth = useMemo(
    () => (maxWidth ? Math.min(maxWidth, screenWidth) : screenWidth),
    [screenWidth, maxWidth]
  );

  const marginStyle = hasMargin && {
    marginHorizontal: responsive
      ? getResponsiveScreenContainerMarginHorizontal(calculatedWidth)
      : screenContainerContentMarginHorizontal,
  };

  const width = fullWidth ? "100%" : calculatedWidth;

  useForceNetworkSelection(forceNetworkId);
  useForceNetworkKind(forceNetworkKind);
  useForceUnselectNetworks();

  const networkFilter = useCallback(
    (n: NetworkInfo | undefined) => {
      if (forceNetworkId && n?.id !== forceNetworkId) {
        return false;
      }
      return !(forceNetworkKind && n?.kind !== forceNetworkKind);
    },
    [forceNetworkId, forceNetworkKind]
  );

  /////////////// mobile returns
  if (isMobile)
    return (
      <ScreenContainerMobile
        onBackPress={onBackPress}
        children={children}
        networkFilter={networkFilter}
        hasScroll={hasScroll}
        forceNetworkId={forceNetworkId}
        forceNetworkKind={forceNetworkKind}
        mobileTitle={mobileTitle}
      />
    );
  /////////////// default returns
  return (
    <SafeAreaView style={{ width: "100%", flex: 1 }}>
      <DAppStoreData />
      {/*FIXME: Too many containers levels*/}

      <View style={styles.container}>
        {!hideSidebar ? <Sidebar /> : null}

        <View style={{ width: "100%", flex: 1 }}>
          {/*==== Header*/}
          <Header onBackPress={onBackPress}>{headerChildren}</Header>

          <View
            style={{ width: "100%", flexDirection: "row", flex: 1, height }}
          >
            {/*==== Scrollable screen content*/}
            <View style={{ flex: 1 }}>
              <SelectedNetworkGate filter={networkFilter}>
                {hasScroll ? (
                  <ScrollView
                    style={{ width: "100%", flex: 1 }}
                    contentContainerStyle={[
                      {
                        minHeight: height - headerHeight,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.childrenContainer,
                        marginStyle,
                        { width, flex: 1 },
                      ]}
                    >
                      {children}
                    </View>
                    {footerChildren ? footerChildren : <Footer />}
                  </ScrollView>
                ) : (
                  <View
                    style={[styles.childrenContainer, marginStyle, { width }]}
                  >
                    {children}
                    {footerChildren ? footerChildren : <Footer />}
                  </View>
                )}
              </SelectedNetworkGate>
            </View>
          </View>
          {/*-----
            We render the wallet selector here with absolute position to make sure
            the popup is on top of everything else, otherwise it's unusable
            TODO: Fix that and put this in Header.tsx
          */}
          <View
            style={{
              position: "absolute",
              flexDirection: "row",
              top: 0,
              right: headerMarginHorizontal,
              height: headerHeight,
              alignItems: "center",
            }}
          >
            <TogglePlayerButton />
            <Separator
              horizontal
              style={{ height: "100%", marginHorizontal: layout.spacing_x2 }}
            />
            <SearchBar />
            <Separator
              horizontal
              style={{ height: "100%", marginHorizontal: layout.spacing_x2 }}
            />
            <CartIconButtonBadge style={{ marginRight: layout.spacing_x1_5 }} />
            <NetworkSelector
              forceNetworkId={forceNetworkId}
              forceNetworkKind={forceNetworkKind}
              forceNetworkFeatures={forceNetworkFeatures}
              style={{ marginRight: layout.spacing_x1_5 }}
            />
            <ConnectWalletButton
              style={{ marginRight: headerMarginHorizontal }}
            />
          </View>
        </View>
        {/*-----END TODO*/}
        <MediaPlayerBar
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: contentWidth,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    flexDirection: "row",
    zIndex: 999,
  },
  childrenContainer: {
    height: "100%",
    alignSelf: "center",
  },
});
