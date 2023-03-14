import React, { useCallback } from "react";
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

import { useForceNetworkKind } from "../hooks/useForceNetworkKind";
import { useForceNetworkSelection } from "../hooks/useForceNetworkSelection";
import { useMaxResolution } from "../hooks/useMaxResolution";
import { NetworkInfo, NetworkKind } from "../networks";
import {
  headerHeight,
  headerMarginHorizontal,
  screenContainerContentMarginHorizontal,
} from "../utils/style/layout";
import { Header } from "./Header";
import { NetworkSelector } from "./NetworkSelector";
import { SelectedNetworkGate } from "./SelectedNetworkGate";
import { ConnectWalletButton } from "./TopMenu/ConnectWalletButton";
import { Footer } from "./footers/Footer";
import { Sidebar } from "./navigation/Sidebar";

export const ScreenContainer: React.FC<{
  headerChildren?: JSX.Element;
  footerChildren?: JSX.Element;
  headerStyle?: StyleProp<ViewStyle>;
  hideSidebar?: boolean;
  customSidebar?: React.ReactNode;
  noMargin?: boolean;
  noScroll?: boolean;
  fullWidth?: boolean;
  isHeaderSmallMargin?: boolean;
  smallMargin?: boolean;
  forceNetworkId?: string;
  forceNetworkKind?: NetworkKind;
}> = ({
  children,
  headerChildren,
  footerChildren,
  headerStyle,
  hideSidebar,
  noMargin,
  noScroll,
  fullWidth,
  isHeaderSmallMargin,
  customSidebar,
  forceNetworkId,
  forceNetworkKind,
}) => {
  // variables
  const { height } = useWindowDimensions();
  const hasMargin = !noMargin;
  const hasScroll = !noScroll;
  const marginStyle = hasMargin && {
    marginHorizontal: screenContainerContentMarginHorizontal,
  };
  const { width: maxWidth } = useMaxResolution();
  const width = fullWidth ? "100%" : maxWidth;

  useForceNetworkSelection(forceNetworkId);
  useForceNetworkKind(forceNetworkKind);

  const networkFilter = useCallback(
    (n: NetworkInfo | undefined) => {
      if (forceNetworkId && n?.id !== forceNetworkId) {
        return false;
      }
      if (forceNetworkKind && n?.kind !== forceNetworkKind) {
        return false;
      }
      return true;
    },
    [forceNetworkId, forceNetworkKind]
  );

  // returns
  return (
    <SafeAreaView style={{ width: "100%", flex: 1 }}>
      {/*TODO: Refactor this*/}

      <View style={styles.container}>
        {["android", "ios"].includes(Platform.OS) ||
          (!hideSidebar ? <Sidebar /> : null)}
        {!["android", "ios"].includes(Platform.OS) && customSidebar}

        <View style={{ width: "100%", flex: 1 }}>
          {/*==== Header*/}
          <Header style={headerStyle} isHeaderSmallMargin={isHeaderSmallMargin}>
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
  },
  childrenContainer: {
    height: "100%",
    alignSelf: "center",
  },
});
