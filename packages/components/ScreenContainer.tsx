import React, { useMemo, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  useWindowDimensions,
  Platform,
  ViewStyle,
  StyleProp,
} from "react-native";

import { Header } from "./Header";
import { NetworkSelector } from "./NetworkSelector";
import { SelectedNetworkGate } from "./SelectedNetworkGate";
import { ConnectWalletButton } from "./TopMenu/ConnectWalletButton";
import { Footer } from "./footers/Footer";
import { Sidebar } from "./navigation/Sidebar";
import { useForceNetworkKind } from "../hooks/useForceNetworkKind";
import { useForceNetworkSelection } from "../hooks/useForceNetworkSelection";
import { useForceUnselectNetworks } from "../hooks/useForceUnselectNetworks";
import { useMaxResolution } from "../hooks/useMaxResolution";
import { NetworkInfo, NetworkKind } from "../networks";
import { DAppStoreData } from "../screens/DAppStore/components/DAppStoreData";
import {
  getResponsiveScreenContainerMarginHorizontal,
  headerHeight,
  headerMarginHorizontal,
  screenContainerContentMarginHorizontal,
} from "../utils/style/layout";

export const ScreenContainer: React.FC<{
  headerChildren?: JSX.Element;
  footerChildren?: React.ReactNode;
  headerStyle?: StyleProp<ViewStyle>;
  hideSidebar?: boolean;
  customSidebar?: React.ReactNode;
  noMargin?: boolean;
  noScroll?: boolean;
  fullWidth?: boolean;
  smallMargin?: boolean;
  forceNetworkId?: string;
  forceNetworkKind?: NetworkKind;
  fixedFooterChildren?: React.ReactNode;
  responsive?: boolean;
  onBackPress?: () => void;
  maxWidth?: number;
}> = ({
  children,
  headerChildren,
  footerChildren,
  headerStyle,
  hideSidebar,
  noMargin,
  noScroll,
  fullWidth,
  smallMargin,
  customSidebar,
  fixedFooterChildren,
  responsive,
  onBackPress,
  maxWidth,
  forceNetworkId,
  forceNetworkKind,
}) => {
  // variables
  const { height } = useWindowDimensions();
  const hasMargin = !noMargin;
  const hasScroll = !noScroll;
  const { width: screenWidth } = useMaxResolution({ responsive, noMargin });

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
  // returns
  return (
    <SafeAreaView style={{ width: "100%", flex: 1 }}>
      <DAppStoreData />
      {/*TODO: Refactor this*/}

      <View style={styles.container}>
        {["android", "ios"].includes(Platform.OS) ||
          (!hideSidebar && <Sidebar />)}
        {!["android", "ios"].includes(Platform.OS) && customSidebar}

        <View style={{ width: "100%", flex: 1 }}>
          {/*==== Header*/}
          <Header
            style={headerStyle}
            smallMargin={smallMargin}
            onBackPress={onBackPress}
          >
            {headerChildren}
          </Header>

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
                {fixedFooterChildren && (
                  <View style={{ width: "100%" }}>
                    <View style={[{ width, alignSelf: "center" }, marginStyle]}>
                      {fixedFooterChildren}
                    </View>
                  </View>
                )}
              </SelectedNetworkGate>
            </View>
          </View>
          {/*
            We render the wallet selector here with absolute position to make sure
            the popup is on top of everything else, otherwise it's unusable
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
            <NetworkSelector
              forceNetworkId={forceNetworkId}
              forceNetworkKind={forceNetworkKind}
              style={{ marginRight: 12 }}
            />
            <ConnectWalletButton />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    flexDirection: "row",
    zIndex: 999
  },
  childrenContainer: {
    height: "100%",
    alignSelf: "center",
  },
});
