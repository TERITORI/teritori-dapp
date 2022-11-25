import { useRoute } from "@react-navigation/native";
import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  FlatList,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";

import addSVG from "../../../assets/icons/add.svg";
import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import logoTopVersionSVG from "../../../assets/logos/logo-hexagon-version-alpha.svg";
import { useSidebar } from "../../context/SidebarProvider";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { useTNSMetadata } from "../../hooks/useTNSMetadata";
import { useAppNavigation } from "../../utils/navigation";
import { SIDEBAR_LIST } from "../../utils/sidebar";
import { neutral17, neutral33 } from "../../utils/style/colors";
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
import { SidebarType } from "./types";

const SpringConfig: WithSpringConfig = {
  stiffness: 100,
  mass: 0.5,
  restDisplacementThreshold: 0.2,
};

export const Sidebar: React.FC = () => {
  const selectedWallet = useSelectedWallet();
  const tnsMetadata = useTNSMetadata(selectedWallet?.address);

  // variables
  const navigation = useAppNavigation();
  const { name: currentRouteName } = useRoute();
  const { isSidebarExpanded, toggleSidebar } = useSidebar();

  // animations
  const layoutStyle = useAnimatedStyle(
    () => ({
      width: isSidebarExpanded
        ? withSpring(fullSidebarWidth, SpringConfig)
        : withSpring(smallSidebarWidth, SpringConfig),
    }),
    [isSidebarExpanded]
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
      <View style={styles.headerContainer}>
        {currentRouteName === "Home" && <SideNotch />}

        <View style={styles.topDetailContainer}>
          <TouchableOpacity
            style={styles.topIconContainer}
            onPress={() => navigation.navigate("Home")}
          >
            <SVG width={68} height={68} source={logoTopVersionSVG} />
          </TouchableOpacity>
        </View>

        <Animated.View
          style={[styles.toggleButtonContainer, toggleButtonStyle]}
        >
          <Pressable style={styles.toggleButton} onPress={toggleSidebar}>
            <SVG source={chevronRightSVG} />
          </Pressable>
        </Animated.View>

        <Separator color={neutral33} />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={Object.values(SIDEBAR_LIST)}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <SidebarButton key={item.title} onPress={onRouteChange} {...item} />
        )}
        ListHeaderComponent={<SpacerColumn size={1} />}
        ListFooterComponent={
          <>
            <SidebarButton
              icon={addSVG}
              iconSize={36}
              route="ComingSoon"
              title=""
              onPress={() => navigation.navigate("ComingSoon")}
            />
            <SpacerColumn size={1} />
          </>
        }
      />
      <View>
        <View
          style={{
            height: 1,
            marginHorizontal: 18,
            backgroundColor: neutral33,
            marginBottom: layout.padding_x1,
          }}
        />

        {tnsMetadata.metadata && (
          <SidebarProfileButton
            walletAddress={selectedWallet?.address || ""}
            tokenId={tnsMetadata?.metadata?.tokenId || ""}
            image={tnsMetadata?.metadata?.image || ""}
            isExpanded={isSidebarExpanded}
          />
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRightWidth: 1,
    borderColor: neutral33,
    zIndex: 100,
  },
  headerContainer: {
    height: headerHeight,
  },
  topDetailContainer: {
    flex: 1,
    justifyContent: "center",
  },
  topIconContainer: {
    paddingLeft: layout.padding_x0_5,
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
