import { useRoute } from "@react-navigation/native";
import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";

import addSVG from "../../../assets/icons/add.svg";
import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import logoTopSVG from "../../../assets/logos/logo-hexagon.svg";
import { useSidebar } from "../../context/SidebarProvider";
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

const SpringConfig: WithSpringConfig = {
  stiffness: 100,
  mass: 0.5,
  restDisplacementThreshold: 0.2,
};

export const Sidebar: React.FC = () => {
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
            <SVG width={68} height={68} source={logoTopSVG} />
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
      <ScrollView>
        <SpacerColumn size={1} />
        {Object.values(SIDEBAR_LIST).map((item) => (
          <SidebarButton
            key={item.title}
            selected={currentRouteName === item.route}
            iconSVG={item.icon}
            onPress={() => navigation.navigate(item.route)}
            title={item.title}
            isComingSoon={item.route === "ComingSoon"}
          />
        ))}
        <SidebarButton
          selected={currentRouteName === "ComingSoon"}
          iconSVG={addSVG}
          iconSize={36}
          onPress={() => navigation.navigate("ComingSoon")}
          isComingSoon
        />
      </ScrollView>
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
