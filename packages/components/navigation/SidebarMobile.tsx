import React, { FC } from "react";
import { StyleSheet, FlatList, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";

import { SidebarButton } from "./components/SidebarButton";
import { SidebarType } from "./types";
import addSVG from "../../../assets/icons/add-circle.svg";
import { useSidebar } from "../../context/SidebarProvider";
import { useSelectedNetworkKind } from "../../hooks/useSelectedNetwork";
import { NetworkKind } from "../../networks";
import { RouteName, useAppNavigation } from "../../utils/navigation";
import { neutral00, neutral17, neutral33 } from "../../utils/style/colors";
import {
  layout,
  MOBILE_HEADER_HEIGHT,
  MOBILE_SIDEBAR_MAX_WIDTH,
} from "../../utils/style/layout";
import { SpacerColumn } from "../spacer";

const SpringConfig: WithSpringConfig = {
  stiffness: 100,
  mass: 0.5,
  restDisplacementThreshold: 0.2,
};

export const SidebarMobile: FC = () => {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const selectedNetworkKind = useSelectedNetworkKind();
  const navigation = useAppNavigation();
  const { isSidebarExpanded, toggleSidebar, dynamicSidebar } = useSidebar();

  const layoutStyle = useAnimatedStyle(
    () => ({
      width: isSidebarExpanded
        ? withSpring(
            windowWidth < MOBILE_SIDEBAR_MAX_WIDTH
              ? windowWidth
              : MOBILE_SIDEBAR_MAX_WIDTH,
            SpringConfig
          )
        : withSpring(0, SpringConfig),
    }),
    [isSidebarExpanded, windowWidth]
  );

  const onRouteChange = (name: SidebarType["route"]) => {
    // @ts-expect-error
    navigation.navigate(name);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        layoutStyle,
        { height: windowHeight - MOBILE_HEADER_HEIGHT },
        !isSidebarExpanded && { borderRightWidth: 0 },
      ]}
    >
      <FlatList
        showsVerticalScrollIndicator={false}
        data={Object.values(dynamicSidebar)}
        keyExtractor={(item) => item.id}
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
              key={item.id}
              onPress={(routeName: RouteName) => {
                isSidebarExpanded && toggleSidebar();
                onRouteChange(routeName);
              }}
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
    </Animated.View>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    borderRightWidth: 1,
    borderColor: neutral33,
    backgroundColor: neutral00,
    position: "absolute",
    top: MOBILE_HEADER_HEIGHT,
    zIndex: 9999,
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
