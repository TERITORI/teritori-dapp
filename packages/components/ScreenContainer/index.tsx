import React, { ReactNode, useCallback, useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";

import { Header } from "./Header";
import { ScreenContainerMobile } from "./ScreenContainerMobile";
import { useForceNetworkFeatures } from "../../hooks/useForceNetworkFeatures";
import { useForceNetworkKind } from "../../hooks/useForceNetworkKind";
import { useForceNetworkSelection } from "../../hooks/useForceNetworkSelection";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { NetworkFeature, NetworkInfo, NetworkKind } from "../../networks";
import {
  fullSidebarWidth,
  getResponsiveScreenContainerMarginHorizontal,
  headerHeight,
  screenContainerContentMarginHorizontal,
  smallSidebarWidth,
} from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SelectedNetworkGate } from "../SelectedNetworkGate";
import { Footer } from "../footers/Footer";
import { MediaPlayerBar } from "../mediaPlayer/MediaPlayerBar";
import { Sidebar } from "../navigation/Sidebar";

import { useSidebar } from "@/context/SidebarProvider";
import { fontRegular15 } from "@/utils/style/fonts";

export interface ScreenContainerProps {
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
  children?: ReactNode;
  headerMini?: ReactNode;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
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
  headerMini,
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
    [screenWidth, maxWidth],
  );

  const marginStyle = hasMargin && {
    marginHorizontal: responsive
      ? getResponsiveScreenContainerMarginHorizontal(calculatedWidth)
      : screenContainerContentMarginHorizontal,
  };

  const width = fullWidth ? "100%" : calculatedWidth;

  useForceNetworkSelection(forceNetworkId);
  useForceNetworkKind(forceNetworkKind);
  useForceNetworkFeatures(forceNetworkFeatures);

  const networkFilter = useCallback(
    (n: NetworkInfo | undefined) => {
      if (forceNetworkId && n?.id !== forceNetworkId) {
        return false;
      }
      return !(forceNetworkKind && n?.kind !== forceNetworkKind);
    },
    [forceNetworkId, forceNetworkKind],
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
        headerMini={headerMini}
      />
    );
  /////////////// default returns
  return (
    <SafeAreaView style={{ width: "100%", flex: 1 }}>
      {/*FIXME: Too many containers levels*/}

      <View
        style={{
          flex: 1,
          backgroundColor: "#000000",
          flexDirection: "row",
          zIndex: 999,
        }}
      >
        {!hideSidebar ? <Sidebar /> : null}

        <View style={{ flex: 1 }}>
          {/*==== Header*/}
          <Header
            forceNetworkId={forceNetworkId}
            forceNetworkKind={forceNetworkKind}
            forceNetworkFeatures={forceNetworkFeatures}
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
                      { minHeight: height - headerHeight },
                    ]}
                  >
                    <View
                      style={[
                        marginStyle,
                        { width, flex: 1, height: "100%", alignSelf: "center" },
                      ]}
                    >
                      {children}
                    </View>
                    {footerChildren ? footerChildren : <Footer />}
                  </ScrollView>
                ) : (
                  <View
                    style={[
                      marginStyle,
                      { width, height: "100%", alignSelf: "center" },
                    ]}
                  >
                    {children}
                    {footerChildren ? footerChildren : <Footer />}
                  </View>
                )}
              </SelectedNetworkGate>
            </View>
          </View>
        </View>
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

interface NewScreenContainerProps {
  title: string;
  children?: ReactNode;
  forceNetworkId?: string;
  forceNetworkKind?: NetworkKind;
  forceNetworkFeatures?: NetworkFeature[];
}

export const NewScreenContainer: React.FC<NewScreenContainerProps> = ({
  title,
  children,
  forceNetworkId,
  forceNetworkKind,
  forceNetworkFeatures,
}) => {
  const { width, height } = useWindowDimensions();
  const { isSidebarExpanded } = useSidebar();

  const contentWidth = useMemo(
    () => width - (isSidebarExpanded ? fullSidebarWidth : smallSidebarWidth),
    [width, isSidebarExpanded],
  );

  useForceNetworkSelection(forceNetworkId);
  useForceNetworkKind(forceNetworkKind);
  useForceNetworkFeatures(forceNetworkFeatures);

  const networkFilter = useCallback(
    (n: NetworkInfo | undefined) => {
      if (forceNetworkId && n?.id !== forceNetworkId) {
        return false;
      }
      return !(forceNetworkKind && n?.kind !== forceNetworkKind);
    },
    [forceNetworkId, forceNetworkKind],
  );

  return (
    <SafeAreaView style={{ width: "100%", flex: 1 }}>
      {/*FIXME: Too many containers levels*/}

      <View
        style={{
          flex: 1,
          backgroundColor: "#000000",
          flexDirection: "row",
          zIndex: 999,
        }}
      >
        <Sidebar />

        <View style={{ flex: 1 }}>
          {/*==== Header*/}
          <Header
            forceNetworkId={forceNetworkId}
            forceNetworkKind={forceNetworkKind}
            forceNetworkFeatures={forceNetworkFeatures}
          >
            {/* Replace it by ScreenTitle */}
            <BrandText style={fontRegular15}>{title}</BrandText>
          </Header>

          <View
            style={{ width: "100%", flexDirection: "row", flex: 1, height }}
          >
            {/*==== Scrollable screen content*/}
            <View style={{ flex: 1 }}>
              <SelectedNetworkGate filter={networkFilter}>
                <ScrollView
                  style={{ width: "100%", flex: 1 }}
                  contentContainerStyle={[{ minHeight: height - headerHeight }]}
                  showsVerticalScrollIndicator={false}
                >
                  <View
                    style={[
                      {
                        flex: 1,
                        width: "100%",
                        height: "100%",
                        alignSelf: "center",
                        paddingHorizontal:
                          screenContainerContentMarginHorizontal,
                      },
                    ]}
                  >
                    {children}
                  </View>
                  <Footer />
                </ScrollView>
              </SelectedNetworkGate>
            </View>
          </View>
        </View>
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
