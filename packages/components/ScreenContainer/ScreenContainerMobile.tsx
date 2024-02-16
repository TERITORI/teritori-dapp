import React, { FC, ReactNode } from "react";
import {
  Platform,
  SafeAreaView,
  View,
  useWindowDimensions,
} from "react-native";

import { HeaderMobile } from "./HeaderMobile";
import { useSearchBar } from "../../context/SearchBarProvider";
import { useAppMode } from "../../hooks/useAppMode";
import { NetworkFeature, NetworkInfo, NetworkKind } from "../../networks";
import { neutral33, neutral77 } from "../../utils/style/colors";
import { fontBold12 } from "../../utils/style/fonts";
import { MOBILE_HEADER_HEIGHT, layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SearchModalMobile } from "../Search/SearchModalMobile";
import { SelectedNetworkGate } from "../SelectedNetworkGate";
import { MediaPlayerBar } from "../mediaPlayer/MediaPlayerBar";
import { SidebarMobile } from "../navigation/SidebarMobile";

import DefaultAppBar from "@/components/mini/DefaultAppBar";

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
  children: ReactNode;
  headerMini?: ReactNode;
}> = ({
  children,
  networkFilter,
  hasScroll,
  forceNetworkId,
  forceNetworkKind,
  forceNetworkFeatures,
  mobileTitle,
  onBackPress,
  headerMini,
}) => {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const { isSearchModalMobileOpen, setSearchModalMobileOpen } = useSearchBar();
  const [appMode] = useAppMode();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: "100%",
        backgroundColor: "#000000",
      }}
    >
      <View
        style={[
          {
            flex: 1,
            paddingTop: MOBILE_HEADER_HEIGHT,
          },
        ]}
      >
        <SearchModalMobile
          onClose={() => setSearchModalMobileOpen(false)}
          visible={isSearchModalMobileOpen}
        />
        {appMode === "mini" ? (
          headerMini ?? <DefaultAppBar title={mobileTitle || ""} />
        ) : (
          <HeaderMobile
            onBackPress={onBackPress}
            forceNetworkId={forceNetworkId}
            forceNetworkKind={forceNetworkKind}
            forceNetworkFeatures={forceNetworkFeatures}
          />
        )}

        {Platform.OS === "web" && <SidebarMobile />}

        {/*==== Scrollable screen content*/}
        <View style={{ flex: 1, width: "100%", height: windowHeight }}>
          <SelectedNetworkGate filter={networkFilter}>
            {hasScroll ? (
              <View
                style={[
                  {
                    marginHorizontal: layout.spacing_x2,
                    minHeight: windowHeight - MOBILE_HEADER_HEIGHT,
                  },
                ]}
              >
                {mobileTitle ? <MobileTitle title={mobileTitle} /> : null}
                <View style={[{ height: "100%" }]}>{children}</View>
              </View>
            ) : (
              <>
                <View
                  style={[{ flex: 1, height: "100%", alignSelf: "center" }]}
                >
                  {children}
                </View>
              </>
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
      </View>
    </SafeAreaView>
  );
};
