import React from "react";
import { FlatList, Linking, Platform, View, ViewStyle } from "react-native";
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
import addSVG from "../../../assets/icons/add-circle.svg";
import { useSidebar } from "../../context/SidebarProvider";
import { useRoute } from "../../hooks/navigation/useRoute";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { NetworkFeature, NetworkKind } from "../../networks";
import { neutral00, neutral33 } from "../../utils/style/colors";
import { fontBold16, fontBold9, fontSemibold14 } from "../../utils/style/fonts";
import {
  fullSidebarWidth,
  headerHeight,
  layout,
  smallSidebarWidth,
} from "../../utils/style/layout";
import { SidebarType } from "../../utils/types/sidebar";
import { BrandText } from "../BrandText";
import ToggleButton from "../buttons/ToggleButton";
import { Separator } from "../separators/Separator";
import { SpacerColumn, SpacerRow } from "../spacer";

import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useAppMode } from "@/hooks/useAppMode";

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
  const { isSidebarExpanded, dynamicSidebar } = useSidebar();
  const [appMode, handleSet] = useAppMode();

  const layoutStyle = useAnimatedStyle(
    () => ({
      width: isSidebarExpanded
        ? withSpring(fullSidebarWidth, SpringConfig)
        : withSpring(smallSidebarWidth, SpringConfig),
    }),
    [isSidebarExpanded],
  );

  const onRouteChange = (name: SidebarType["route"]) => {
    // @ts-expect-error: description todo
    navigation.navigate(name);
  };

  return (
    <View
      style={{
        backgroundColor: neutral00,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        flex: Platform.OS === "web" ? undefined : 1,
      }}
    >
      <Animated.View style={[containerCStyle, layoutStyle]}>
        {Platform.OS === "web" && (
          <View style={headerContainerCStyle}>
            {currentRouteName === "Home" && <SideNotch />}

            <TopLogo />

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
              {Platform.OS !== "web" && (
                <View
                  style={{
                    flexDirection: "row",
                    paddingHorizontal: layout.spacing_x3,
                    paddingVertical: layout.spacing_x1,
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <BrandText style={fontSemibold14}>Normal Mode</BrandText>
                  <SpacerRow size={1} />
                  <ToggleButton
                    isActive={appMode === "normal"}
                    style={{ transform: [{ scale: 0.6 }] }}
                    onValueChange={(value) => {
                      if (value) {
                        handleSet("web3Addict");
                      }

                      handleSet("mini");
                    }}
                  />
                </View>
              )}
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

const containerCStyle: ViewStyle = {
  borderRightWidth: 1,
  borderColor: neutral33,
  zIndex: 100,
  flex: 1,
};

const headerContainerCStyle: ViewStyle = {
  height: headerHeight,
};
