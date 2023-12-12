import React from "react";
import {
  FlatList,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BuyTokens } from "./BuyTokens";
import { SideNotch } from "./components/SideNotch";
import { SidebarButton } from "./components/SidebarButton";
import { SidebarProfileButton } from "./components/SidebarProfileButton";
import { TopLogo } from "./components/TopLogo";
import { SidebarType } from "./types";
import addSVG from "../../../assets/icons/add-circle.svg";
import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import { useSidebar } from "../../context/SidebarProvider";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { useRoute } from "../../hooks/useRoute";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { NetworkFeature, NetworkKind } from "../../networks";
import { useAppNavigation } from "../../utils/navigation";
import { neutral00, neutral17, neutral33 } from "../../utils/style/colors";
import { fontBold16, fontBold9 } from "../../utils/style/fonts";
import {
  fullSidebarWidth,
  headerHeight,
  layout,
  smallSidebarWidth,
} from "../../utils/style/layout";
import { SVG } from "../SVG";
import { Separator } from "../separators/Separator";
import { SpacerColumn } from "../spacer";

const SpringConfig: WithSpringConfig = {
  stiffness: 100,
  mass: 0.5,
  restDisplacementThreshold: 0.2,
};

const SidebarSeparator: React.FC = () => {
  return (
    <View
      style={{
        height: 1,
        marginHorizontal: layout.spacing_x2,
        backgroundColor: neutral33,
        marginBottom: layout.spacing_x1,
      }}
    />
  );
};

export const Sidebar: React.FC = () => {
  const selectedWallet = useSelectedWallet();
  const userInfo = useNSUserInfo(selectedWallet?.userId);
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const selectedNetworkKind = selectedNetworkInfo?.kind;
  const connected = selectedWallet?.connected;
  const navigation = useAppNavigation();
  const insets = useSafeAreaInsets();
  const { name: currentRouteName } = useRoute();
  const { isSidebarExpanded, toggleSidebar, dynamicSidebar } = useSidebar();

  const layoutStyle = useAnimatedStyle(
    () => ({
      width: isSidebarExpanded
        ? withSpring(fullSidebarWidth, SpringConfig)
        : withSpring(smallSidebarWidth, SpringConfig),
    }),
    [isSidebarExpanded],
  );

  const toggleButtonStyle = useAnimatedStyle(
    () => ({
      transform: isSidebarExpanded
        ? [
            { rotateY: withSpring("180deg", SpringConfig) },
            { translateX: withSpring(20, SpringConfig) },
          ]
        : [
            { rotateY: withSpring("0deg", SpringConfig) },
            { translateX: withSpring(0, SpringConfig) },
          ],
    }),
    [isSidebarExpanded],
  );

  const onRouteChange = (name: SidebarType["route"]) => {
    // @ts-expect-error
    navigation.navigate(name);
  };

  return (
    <View
      style={{
        backgroundColor: neutral00,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        flex: 1,
      }}
    >
      <Animated.View style={[styles.container, layoutStyle]}>
        {Platform.OS === "web" && (
          <View style={styles.headerContainer}>
            {currentRouteName === "Home" && <SideNotch />}

            <TopLogo />
            <Animated.View
              style={[styles.toggleButtonContainer, toggleButtonStyle]}
            >
              <Pressable style={styles.toggleButton} onPress={toggleSidebar}>
                <SVG source={chevronRightSVG} />
              </Pressable>
            </Animated.View>

            <Separator color={neutral33} />
          </View>
        )}
        <FlatList
          style={{
            flex: 1,
          }}
          showsVerticalScrollIndicator={false}
          data={Object.values(dynamicSidebar)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            let { route } = item;
            if (
              item.disabledOn?.includes(
                selectedNetworkKind || NetworkKind.Unknown,
              )
            ) {
              route = "ComingSoon";
            }

            return (
              <SidebarButton
                key={item.id}
                onPress={
                  route === "External"
                    ? () => {
                        Linking.openURL(item.url);
                      }
                    : onRouteChange
                }
                {...item}
                route={route}
              />
            );
          }}
          ListHeaderComponent={<SpacerColumn size={1} />}
          ListFooterComponent={
            <>
              <SidebarButton
                icon={addSVG}
                iconSize={36}
                route="DAppStore"
                key="ComingSoon2"
                id="ComingSoon2"
                title=""
                onPress={() => navigation.navigate("DAppStore")}
              />
              <SpacerColumn size={1} />
            </>
          }
        />
        <View>
          <SidebarSeparator />
          <BuyTokens
            flexDirection={isSidebarExpanded ? "row" : "column"}
            textStyle={isSidebarExpanded ? fontBold16 : fontBold9}
          />
          <SidebarSeparator />

          {selectedNetworkInfo?.features.includes(NetworkFeature.UPP) &&
            connected &&
            userInfo.metadata && (
              <SidebarProfileButton
                userId={selectedWallet?.userId || ""}
                isExpanded={isSidebarExpanded}
              />
            )}
        </View>
      </Animated.View>
    </View>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    borderRightWidth: 1,
    borderColor: neutral33,
    zIndex: 100,
    flex: 1,
  },
  headerContainer: {
    height: headerHeight,
  },
  toggleButtonContainer: {
    position: "absolute",
    flex: 1,
    flexDirection: "row",
    right: -20,
    top: 0,
    bottom: 0,
  },
  toggleButton: {
    borderColor: neutral33,
    borderWidth: 1,
    backgroundColor: neutral17,
    alignSelf: "center",
    height: 28,
    width: 20,
    alignItems: "center",
    justifyContent: "center",
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  bottomSeperatorContainer: {
    width: 40,
    marginLeft: layout.spacing_x2,
  },
});
