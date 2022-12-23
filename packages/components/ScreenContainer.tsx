import React from "react";
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

import { useMaxResolution } from "../hooks/useMaxResolution";
import {
  headerHeight,
  headerMarginHorizontal,
  screenContainerContentMarginHorizontal,
} from "../utils/style/layout";
import { ConnectWalletButton } from "./ConnectWalletButton";
import { Header } from "./Header";
import { NetworkSelector } from "./NetworkSelector";
import { Footer } from "./footers/Footer";
import { Sidebar } from "./navigation/Sidebar";
import {useGame} from "../context/GameProvider";

export const ScreenContainer: React.FC<{
  headerChildren?: JSX.Element;
  footerChildren?: JSX.Element;
  headerStyle?: StyleProp<ViewStyle>;
  hideSidebar?: boolean;
  customSidebar?: React.ReactNode;
  noMargin?: boolean;
  noScroll?: boolean;
  fullWidth?: boolean;
  smallMargin?: boolean;
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

  // const {stopAudio, setEnteredInGame} = useAudioVideoZ()
  const {stopAudio, setEnteredInGame} = useGame()

  // returns
  return (
    <SafeAreaView style={{ width: "100%", flex: 1 }} onLayout={() =>
      setEnteredInGame(false)
    }>
      <View style={styles.container}>
        {["android", "ios"].includes(Platform.OS) ||
          (!hideSidebar ? <Sidebar /> : null)}
        {!["android", "ios"].includes(Platform.OS) && customSidebar}

        <View style={{ width: "100%", flex: 1 }}>
          {/*==== Header*/}
          <Header style={headerStyle} smallMargin={smallMargin}>
            {headerChildren}
          </Header>

          <View
            style={{ width: "100%", flexDirection: "row", flex: 1, height }}
          >
            {/*==== Scrollable screen content*/}
            <View style={{ flex: 1 }}>
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
            <NetworkSelector style={{ marginRight: 12 }} />
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
