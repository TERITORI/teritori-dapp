import React, { FC } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HeaderMobile } from "./HeaderMobile";
import { useSearchBar } from "../../context/SearchBarProvider";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { NetworkFeature, NetworkInfo, NetworkKind } from "../../networks";
import { DAppStoreData } from "../../screens/DAppStore/components/DAppStoreData";
import { neutral33, neutral77 } from "../../utils/style/colors";
import { fontBold12 } from "../../utils/style/fonts";
import {
  getMobileScreenContainerMarginHorizontal,
  layout,
  MOBILE_HEADER_HEIGHT,
} from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SearchModalMobile } from "../Search/SearchModalMobile";
import { SelectedNetworkGate } from "../SelectedNetworkGate";
import { SidebarMobile } from "../navigation/SidebarMobile";

export const MobileTitle: FC<{ title: string }> = ({ title }) => {
  const { width: windowWidth } = useWindowDimensions();

  return (
    <View
      style={{
        height: 48,
        borderBottomWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        borderBottomColor: neutral33,
        width: windowWidth,
        paddingHorizontal: layout.spacing_x2,
      }}
    >
      <BrandText style={[fontBold12, { color: neutral77 }]}>{title}</BrandText>
    </View>
  );
};

export const ScreenContainerMobile: FC<{
  networkFilter: (n: NetworkInfo) => boolean;
  // hasScroll: Pages like Home, !hasScroll: Pages like Feed
  hasScroll: boolean;
  forceNetworkId?: string;
  forceNetworkKind?: NetworkKind;
  forceNetworkFeatures?: NetworkFeature[];
  mobileTitle?: string;
  onBackPress?: () => void;
  noMargin?: boolean;
}> = ({
  children,
  networkFilter,
  hasScroll,
  forceNetworkId,
  forceNetworkKind,
  forceNetworkFeatures,
  mobileTitle,
  onBackPress,
  noMargin,
}) => {
  const { width } = useMaxResolution();
  const { isSearchModalMobileOpen, setSearchModalMobileOpen } = useSearchBar();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobile = useIsMobile();

  return (
    <View style={[styles.container]}>
      <View
        style={[
          {
            marginTop: insets.top,
            marginBottom: insets.bottom,
            flex: 1,
            paddingTop: isMobile ? MOBILE_HEADER_HEIGHT : 0,
          },
        ]}
      >
        <DAppStoreData />
        <SearchModalMobile
          onClose={() => setSearchModalMobileOpen(false)}
          visible={isSearchModalMobileOpen}
        />
        <HeaderMobile
          onBackPress={onBackPress}
          forceNetworkId={forceNetworkId}
          forceNetworkKind={forceNetworkKind}
          forceNetworkFeatures={forceNetworkFeatures}
        />
        {!["ios", "android"].includes(Platform.OS) && <SidebarMobile />}

        {/*==== Scrollable screen content*/}
        <View style={{ flex: 1, width: "100%", height: windowHeight }}>
          <SelectedNetworkGate filter={networkFilter}>
            {hasScroll ? (
              <ScrollView
                contentContainerStyle={[
                  {
                    minHeight: windowHeight - MOBILE_HEADER_HEIGHT,
                  },
                ]}
              >
                {mobileTitle ? <MobileTitle title={mobileTitle} /> : null}
                <View
                  style={[
                    styles.childrenContainer,
                    {
                      flex: 1,
                      width,
                      marginHorizontal: noMargin
                        ? 0
                        : getMobileScreenContainerMarginHorizontal(windowWidth),
                    },
                  ]}
                >
                  {children}
                </View>
                {/*TODO: Put here Riotters Footer ?*/}
              </ScrollView>
            ) : (
              <>
                <View
                  style={[
                    styles.childrenContainer,
                    {
                      flex: 1,
                      marginHorizontal: noMargin
                        ? 0
                        : getMobileScreenContainerMarginHorizontal(windowWidth),
                    },
                  ]}
                >
                  {children}
                </View>
              </>
              // TODO: Put here Riotters Footer ?
            )}
          </SelectedNetworkGate>
        </View>
      </View>
    </View>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#000000",
  },
  childrenContainer: {
    height: "100%",
    alignSelf: "center",
  },
});
