import React, { FC, useCallback } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import { HeaderMobile } from "./HeaderMobile";
import { NetworkInfo, NetworkKind } from "../../networks";
import { DAppStoreData } from "../../screens/DAppStore/components/DAppStoreData";
import { neutral33, neutral77 } from "../../utils/style/colors";
import { fontBold12 } from "../../utils/style/fonts";
import {
  getMobileScreenContainerMarginHorizontal,
  MOBILE_HEADER_HEIGHT,
} from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SelectedNetworkGate } from "../SelectedNetworkGate";
import { SidebarMobile } from "../navigation/SidebarMobile";

export const ScreenContainerMobile: FC<{
  networkFilter: (n: NetworkInfo) => boolean;
  hasScroll: boolean;
  forceNetworkId?: string;
  forceNetworkKind?: NetworkKind;
  mobileTitle?: string;
}> = ({
  children,
  networkFilter,
  hasScroll,
  forceNetworkId,
  forceNetworkKind,
  mobileTitle,
}) => {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();

  const Children: FC = useCallback(() => {
    return (
      <>
        {mobileTitle && Platform.OS === "web" ? (
          <View
            style={{
              height: 48,
              borderBottomWidth: 1,
              flexDirection: "row",
              alignItems: "center",
              borderBottomColor: neutral33,
              paddingHorizontal:
                getMobileScreenContainerMarginHorizontal(windowWidth),
            }}
          >
            <BrandText style={[fontBold12, { color: neutral77 }]}>
              {mobileTitle}
            </BrandText>
          </View>
        ) : null}
        {children}
      </>
    );
  }, [mobileTitle, children, windowWidth]);

  return (
    <SafeAreaView style={styles.container}>
      <DAppStoreData />
      <View
        style={{
          flex: 1,
        }}
      >
        <HeaderMobile
          forceNetworkId={forceNetworkId}
          forceNetworkKind={forceNetworkKind}
        />
        {Platform.OS === "web" && <SidebarMobile />}

        {/*==== Scrollable screen content*/}
        <View
          style={{
            flex: 1,
            width: "100%",
            height: windowHeight,
            marginTop: MOBILE_HEADER_HEIGHT,
          }}
        >
          <SelectedNetworkGate filter={networkFilter}>
            {hasScroll ? (
              <ScrollView
                style={{ width: "100%", flex: 1 }}
                contentContainerStyle={[
                  {
                    minHeight: windowHeight - MOBILE_HEADER_HEIGHT,
                  },
                ]}
              >
                <View
                  style={[
                    styles.childrenContainer,
                    {
                      width: "100%",
                      flex: 1,
                      marginHorizontal:
                        getMobileScreenContainerMarginHorizontal(windowWidth),
                    },
                  ]}
                >
                  <Children>{children}</Children>
                </View>
                {/*TODO: Put here Riotters Footer ?*/}
              </ScrollView>
            ) : (
              <View
                style={[
                  styles.childrenContainer,
                  {
                    width: "100%",
                    marginHorizontal:
                      getMobileScreenContainerMarginHorizontal(windowWidth),
                  },
                ]}
              >
                <Children>{children}</Children>
                {/*TODO: Put here Riotters Footer ?*/}
              </View>
            )}
          </SelectedNetworkGate>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#000000",
  },
  childrenContainer: {
    height: "100%",
    alignSelf: "center",
  },
});
