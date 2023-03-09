import { DrawerContentComponentProps } from "@react-navigation/drawer";
import React from "react";
import { View, StyleSheet, Pressable, FlatList, Platform } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import addSVG from "../../../assets/icons/add-circle.svg";
import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import { useSidebar } from "../../context/SidebarProvider";
import { useCurrentRouteName } from "../../hooks/useCurrentRouteName";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { useSelectedNetworkKind } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { NetworkKind } from "../../networks";
import { useAppNavigation } from "../../utils/navigation";
import { SIDEBAR_LIST } from "../../utils/sidebar";
import { neutral00, neutral17, neutral33 } from "../../utils/style/colors";
import {
  smallSidebarWidth,
  fullSidebarWidth,
  layout,
  headerHeight,
} from "../../utils/style/layout";
import { SVG } from "../SVG";
import { Separator } from "../Separator";
import { SpacerColumn } from "../spacer";
import { SideNotch } from "./components/SideNotch";
import { SidebarButton } from "./components/SidebarButton";
import { SidebarProfileButton } from "./components/SidebarProfileButton";
import { TopLogo } from "./components/TopLogo";
import { SidebarType } from "./types";

const SpringConfig: WithSpringConfig = {
  stiffness: 100,
  mass: 0.5,
  restDisplacementThreshold: 0.2,
};

interface SidebarProps extends DrawerContentComponentProps {
  expanded: boolean;
}

export const Sidebar = (props: SidebarProps) => {
  const selectedWallet = useSelectedWallet();
  const userInfo = useNSUserInfo(selectedWallet?.userId);
  const selectedNetworkKind = useSelectedNetworkKind();
  const connected = selectedWallet?.connected;
  const { top, bottom } = useSafeAreaInsets();

  // variables
  const navigation = useAppNavigation();
  const currentRouteName = useCurrentRouteName();
  const { isSidebarExpanded, toggleSidebar } = useSidebar();

  // animations
  const layoutStyle = useAnimatedStyle(
    () => ({
      width:
        isSidebarExpanded || props.expanded
          ? withSpring(fullSidebarWidth, SpringConfig)
          : withSpring(smallSidebarWidth, SpringConfig),
    }),
    [isSidebarExpanded, props.expanded]
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
    [isSidebarExpanded]
  );

  const onRouteChange = (name: SidebarType["route"]) => {
    navigation.navigate(name);
  };

  // returns
  return (
    <Animated.View style={[styles.container, layoutStyle]}>
      <View
        style={[
          styles.headerContainer,
          {
            marginTop: top,
          },
        ]}
      >
        {currentRouteName === "Home" && <SideNotch />}

        <TopLogo />
        {Platform.OS === "web" && (
          <Animated.View
            style={[styles.toggleButtonContainer, toggleButtonStyle]}
          >
            <Pressable
              style={styles.toggleButton}
              onPress={() =>
                Platform.OS === "web"
                  ? toggleSidebar()
                  : navigation.openDrawer()
              }
            >
              <SVG source={chevronRightSVG} />
            </Pressable>
          </Animated.View>
        )}

        <Separator color={neutral33} />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={Object.values(SIDEBAR_LIST)}
        keyExtractor={(item) => item.title}
        contentContainerStyle={{
          paddingBottom: bottom + top + headerHeight,
        }}
        renderItem={({ item }) => {
          let { route } = item;
          if (
            item.disabledOn?.includes(
              selectedNetworkKind || NetworkKind.Unknown
            )
          ) {
            route = "ComingSoon";
          }

          return (
            <SidebarButton
              key={item.title}
              onPress={onRouteChange}
              {...item}
              route={route}
              expanded={props.expanded}
            />
          );
        }}
        ListHeaderComponent={<SpacerColumn size={1} />}
        ListFooterComponent={
          <>
            <SidebarButton
              icon={addSVG}
              iconSize={36}
              route="ComingSoon"
              title=""
              onPress={() => navigation.navigate("ComingSoon")}
              expanded={props.expanded}
            />
            <SpacerColumn size={1} />
          </>
        }
      />
      {selectedNetworkKind === NetworkKind.Cosmos &&
        connected &&
        userInfo.metadata && (
          <View>
            <View
              style={{
                height: 1,
                marginHorizontal: 18,
                backgroundColor: neutral33,
                marginBottom: layout.padding_x1,
              }}
            />

            <SidebarProfileButton
              userId={selectedWallet?.userId || ""}
              tokenId={userInfo.metadata.tokenId || ""}
              image={userInfo.metadata.image || ""}
              isExpanded={isSidebarExpanded}
            />
          </View>
        )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRightWidth: 1,
    borderColor: neutral33,
    backgroundColor: neutral00,
    zIndex: 100,
  },
  headerContainer: {
    height: headerHeight,
    position: "relative",
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
    marginLeft: layout.padding_x2,
  },
});
