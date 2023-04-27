import React, { useMemo, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  useWindowDimensions,
  ViewStyle,
  StyleProp,
} from "react-native";

import { Header } from "./Header";
import { ScreenContainerMobile } from "./ScreenContainerMobile";
import { SearchBar } from "./SearchBar";
import { useForceNetworkKind } from "../../hooks/useForceNetworkKind";
import { useForceNetworkSelection } from "../../hooks/useForceNetworkSelection";
import { useForceUnselectNetworks } from "../../hooks/useForceUnselectNetworks";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { NetworkInfo, NetworkKind } from "../../networks";
import { DAppStoreData } from "../../screens/DAppStore/components/DAppStoreData";
import { neutral33 } from "../../utils/style/colors";
import {
  getResponsiveScreenContainerMarginHorizontal,
  headerHeight,
  headerMarginHorizontal,
  screenContainerContentMarginHorizontal,
} from "../../utils/style/layout";
import { NetworkSelector } from "../NetworkSelector/NetworkSelector";
import { SelectedNetworkGate } from "../SelectedNetworkGate";
import { ConnectWalletButton } from "../TopMenu/ConnectWalletButton";
import { Footer } from "../footers/Footer";
import { Sidebar } from "../navigation/Sidebar";

export const ScreenContainer: React.FC<{
  headerChildren?: JSX.Element;
  footerChildren?: React.ReactNode;
  headerStyle?: StyleProp<ViewStyle>;
  mobileTitle?: string;
  hideSidebar?: boolean;
  noMargin?: boolean;
  noScroll?: boolean;
  fullWidth?: boolean;
  isHeaderSmallMargin?: boolean;
  forceNetworkId?: string;
  forceNetworkKind?: NetworkKind;
  responsive?: boolean;
  onBackPress?: () => void;
  maxWidth?: number;
}> = ({
  children,
  headerChildren,
  footerChildren,
  headerStyle,
  mobileTitle,
  hideSidebar,
  noMargin,
  noScroll,
  fullWidth,
  isHeaderSmallMargin,
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

          <Header
            style={headerStyle}
            isHeaderSmallMargin={isHeaderSmallMargin}
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
              </SelectedNetworkGate>
            </View>
          </View>
          {/*
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
            <SearchBar />
            <View
              style={{
                height: "100%",
                backgroundColor: neutral33,
                marginHorizontal: 16,
                width: 1,
              }}
            />
            <NetworkSelector
              forceNetworkId={forceNetworkId}
              forceNetworkKind={forceNetworkKind}
              style={{ marginRight: 12 }}
            />
            <ConnectWalletButton
              style={{ marginRight: headerMarginHorizontal }}
            />
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
