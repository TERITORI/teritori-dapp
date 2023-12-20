import React from "react";
import {
  FlatList,
  Pressable,
  TouchableOpacity,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";

import { SideBarButton } from "./SideBarButton";
import chevronRightSVG from "../../../../../../assets/icons/chevron-right.svg";
import RWADarkLogo from "../../../../../../assets/logos/rwa-dark-logo.svg";
import RWALightLogo from "../../../../../../assets/logos/rwa-light-logo.svg";
import { SVG } from "../../../../../components/SVG";
import { SidebarType } from "../../../../../components/navigation/types";
import { Separator } from "../../../../../components/separators/Separator";
import { SpacerColumn } from "../../../../../components/spacer";
import { useRWASideBar } from "../../../../../context/SidebarProvider";
import { useIsMobile } from "../../../../../hooks/useIsMobile";
import { useIsLightTheme, useTheme } from "../../../../../hooks/useTheme";
import { useAppNavigation } from "../../../../../utils/navigation";
import {
  MOBILE_HEADER_HEIGHT,
  MOBILE_SIDEBAR_MAX_WIDTH,
  fullSidebarWidth,
  headerHeight,
  layout,
  smallSidebarWidth,
} from "../../../../../utils/style/layout";

const RWATopLogo = () => {
  const navigation = useAppNavigation();
  const isLightTheme = useIsLightTheme();

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <TouchableOpacity
        style={{ marginHorizontal: layout.spacing_x0_5 }}
        onPress={() => navigation.navigate("RWAHome")}
      >
        <SVG
          width={68}
          height={68}
          source={isLightTheme ? RWALightLogo : RWADarkLogo}
        />
      </TouchableOpacity>
    </View>
  );
};

const SpringConfig: WithSpringConfig = {
  stiffness: 100,
  mass: 0.5,
  restDisplacementThreshold: 0.2,
};

const SidebarSeparator: React.FC = () => {
  const theme = useTheme();
  return (
    <View
      style={{
        height: 1,
        marginHorizontal: layout.spacing_x2,
        backgroundColor: theme.borderColor,
        marginBottom: layout.spacing_x1,
      }}
    />
  );
};

export const SideBarMobile: React.FC = () => {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  // const navigation = useAppNavigation();
  const { isSidebarExpanded, dynamicSidebar } = useRWASideBar();
  const theme = useTheme();

  const layoutStyle = useAnimatedStyle(
    () => ({
      width: isSidebarExpanded
        ? withSpring(
            windowWidth < MOBILE_SIDEBAR_MAX_WIDTH
              ? windowWidth
              : MOBILE_SIDEBAR_MAX_WIDTH,
            SpringConfig,
          )
        : withSpring(0, SpringConfig),
    }),
    [isSidebarExpanded, windowWidth],
  );

  const onRouteChange = (name: SidebarType["route"]) => {
    // @ts-expect-error
    navigation.navigate(name);
  };

  return (
    <Animated.View
      style={[
        SideBarMobileContainerCStyle,
        layoutStyle,
        {
          height: windowHeight - MOBILE_HEADER_HEIGHT,
          backgroundColor: theme.headerBackgroundColor,
          borderColor: theme.borderColor,
        },
        !isSidebarExpanded && { borderRightWidth: 0 },
      ]}
    >
      <FlatList
        showsVerticalScrollIndicator={false}
        data={Object.values(dynamicSidebar)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SideBarButton key={item.id} onPress={onRouteChange} {...item} />
        )}
        ListHeaderComponent={<SpacerColumn size={1} />}
        ListFooterComponent={<SidebarSeparator />}
      />
    </Animated.View>
  );
};

const SideBarMobileContainerCStyle: ViewStyle = {
  borderRightWidth: 1,
  position: "absolute",
  top: MOBILE_HEADER_HEIGHT,
  zIndex: 9999,
};

export const SideBar: React.FC = () => {
  const navigation = useAppNavigation();
  const { isSidebarExpanded, toggleSidebar, dynamicSidebar } = useRWASideBar();
  const theme = useTheme();
  const isMobile = useIsMobile();

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

  return isMobile ? null : (
    <Animated.View
      style={[
        containerCStyle,
        layoutStyle,
        {
          borderColor: theme.borderColor,
          backgroundColor: theme.headerBackgroundColor,
        },
      ]}
    >
      <View style={{ height: headerHeight }}>
        <RWATopLogo />

        <Animated.View style={[toggleButtonContainerCStyle, toggleButtonStyle]}>
          <Pressable
            style={[toggleButtonCStyle, { borderColor: theme.borderColor }]}
            onPress={toggleSidebar}
          >
            <SVG color={theme.chevronIconColor} source={chevronRightSVG} />
          </Pressable>
        </Animated.View>

        <Separator color={theme.borderColor} />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={Object.values(dynamicSidebar)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SideBarButton key={item.id} onPress={onRouteChange} {...item} />
        )}
        ListHeaderComponent={<SpacerColumn size={1} />}
        ListFooterComponent={<SidebarSeparator />}
      />
    </Animated.View>
  );
};

const containerCStyle: ViewStyle = {
  borderRightWidth: 1,
  zIndex: 100,
};

const toggleButtonContainerCStyle: ViewStyle = {
  position: "absolute",
  flex: 1,
  flexDirection: "row",
  right: -20,
  top: 0,
  bottom: 0,
};

const toggleButtonCStyle: ViewStyle = {
  borderWidth: 1,
  alignSelf: "center",
  height: 28,
  width: 20,
  alignItems: "center",
  justifyContent: "center",
  borderTopRightRadius: 6,
  borderBottomRightRadius: 6,
};
