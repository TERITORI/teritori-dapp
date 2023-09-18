import React, { FC } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import { HeaderMobile } from "./HeaderMobile";
import { useSearchBar } from "../../context/SearchBarProvider";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { NetworkFeature, NetworkInfo, NetworkKind } from "../../networks";
import { DAppStoreData } from "../../screens/DAppStore/components/DAppStoreData";
import { neutral33, neutral77 } from "../../utils/style/colors";
import { fontBold12 } from "../../utils/style/fonts";
import { layout, MOBILE_HEADER_HEIGHT } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SearchModalMobile } from "../Search/SearchModalMobile";
import { SelectedNetworkGate } from "../SelectedNetworkGate";
import { MediaPlayerBar } from "../mediaPlayer/MediaPlayerBar";
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
}> = ({
  children,
  networkFilter,
  hasScroll,
  forceNetworkId,
  forceNetworkKind,
  forceNetworkFeatures,
  mobileTitle,
  onBackPress,
}) => {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const { width } = useMaxResolution();
  const { isSearchModalMobileOpen, setSearchModalMobileOpen } = useSearchBar();

  return (
    <SafeAreaView style={styles.container}>
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
      <SidebarMobile />

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
              <View style={[styles.childrenContainer, { flex: 1, width }]}>
                {children}
              </View>
              {/*TODO: Put here Riotters Footer ?*/}
            </ScrollView>
          ) : (
            <>
              <View style={[styles.childrenContainer, { flex: 1 }]}>
                {children}
              </View>
            </>
            // TODO: Put here Riotters Footer ?
          )}
          <MediaPlayerBar
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: windowWidth,
            }}
          />
        </SelectedNetworkGate>
      </View>
    </SafeAreaView>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#000000",
    paddingTop: MOBILE_HEADER_HEIGHT,
  },
  childrenContainer: {
    height: "100%",
    alignSelf: "center",
  },
});
