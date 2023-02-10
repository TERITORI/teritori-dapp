import { useRoute } from "@react-navigation/native";
import React, { useMemo } from "react";
import { View, StyleSheet, Pressable, FlatList } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";
import { useSelector } from "react-redux";

import addSVG from "../../../assets/icons/add-circle.svg";
import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import { useSidebar } from "../../context/SidebarProvider";
import { useSelectedNetwork } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { useTNSMetadata } from "../../hooks/useTNSMetadata";
import { getValuesFromId } from "../../screens/DAppStore/query/query";
import {
  selectAvailableApps,
  selectCheckedApps,
} from "../../store/slices/dapps-store";
import { useAppNavigation } from "../../utils/navigation";
import { Network } from "../../utils/network";
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
import { TopLogo } from "./components/TopLogo";
import { SidebarType } from "./types";

const SpringConfig: WithSpringConfig = {
  stiffness: 100,
  mass: 0.5,
  restDisplacementThreshold: 0.2,
};

export const Sidebar: React.FC = () => {
  const selectedWallet = useSelectedWallet();
  const tnsMetadata = useTNSMetadata(selectedWallet?.address);
  const selectedNetwork = useSelectedNetwork();

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

  const selectedApps = useSelector(selectCheckedApps);
  const availableApps = useSelector(selectAvailableApps);

  const dynamicSidebar = useMemo(() => {
    const dynamicAppsSelection = Object.values(SIDEBAR_LIST);

    selectedApps.map((element) => {
      const { appId, groupKey } = getValuesFromId(element);
      if (!availableApps[groupKey]) {
        return;
      }
      const option = availableApps[groupKey].options[appId];
      // @ts-ignore
      dynamicAppsSelection[element] = {
        id: option.id,
        title: option.title,
        route: option.route,
        icon: option.icon,
      };
    });
    return dynamicAppsSelection;
  }, [selectedApps, availableApps]);

  // returns
  return (
    <Animated.View style={[styles.container, layoutStyle]}>
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
      <FlatList
        showsVerticalScrollIndicator={false}
        data={Object.values(dynamicSidebar)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          let { route } = item;
          if (item.disabledOn?.includes(selectedNetwork || Network.Unknown)) {
            route = "ComingSoon";
          }

          return (
            <SidebarButton
              key={item.id}
              onPress={onRouteChange}
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
              route="ComingSoon"
              key="ComingSoon2"
              id="ComingSoon2"
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
            tokenId={tnsMetadata.metadata.tokenId || ""}
            image={tnsMetadata.metadata.image || ""}
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
