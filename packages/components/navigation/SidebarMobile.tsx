import { FC } from "react";
import { View, StyleSheet, FlatList, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";

import { SidebarButton } from "./components/SidebarButton";
import { SidebarProfileButton } from "./components/SidebarProfileButton";
import { SidebarType } from "./types";
import addSVG from "../../../assets/icons/add-circle.svg";
import { useSidebar } from "../../context/SidebarProvider";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { useSelectedNetworkKind } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { NetworkKind } from "../../networks";
import { useAppNavigation } from "../../utils/navigation";
import { SIDEBAR_LIST } from "../../utils/sidebar";
import { neutral00, neutral17, neutral33 } from "../../utils/style/colors";
import { layout, MOBILE_HEADER_HEIGHT } from "../../utils/style/layout";
import { SpacerColumn } from "../spacer";

const SpringConfig: WithSpringConfig = {
  stiffness: 100,
  mass: 0.5,
  restDisplacementThreshold: 0.2,
};

export const SidebarMobile: FC = () => {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const selectedWallet = useSelectedWallet();
  const userInfo = useNSUserInfo(selectedWallet?.userId);
  const selectedNetworkKind = useSelectedNetworkKind();
  const connected = selectedWallet?.connected;
  const navigation = useAppNavigation();
  const { isSidebarExpanded, toggleSidebar } = useSidebar();

  const layoutStyle = useAnimatedStyle(
    () => ({
      width: isSidebarExpanded
        ? withSpring(windowWidth, SpringConfig)
        : withSpring(0, SpringConfig),
    }),
    [isSidebarExpanded]
  );

  const onRouteChange = (name: SidebarType["route"]) => {
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
        data={Object.values(SIDEBAR_LIST)}
        keyExtractor={(item) => item.title}
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
              onPress={(routeName) => {
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
              route="ComingSoon"
              title=""
              onPress={() => navigation.navigate("ComingSoon")}
            />
            <SpacerColumn size={1} />
          </>
        }
      />
      {isSidebarExpanded && (
        <View>
          <View
            style={{
              height: 1,
              marginHorizontal: 18,
              backgroundColor: neutral33,
              marginBottom: layout.padding_x1,
            }}
          />

          {selectedNetworkKind === NetworkKind.Cosmos &&
            connected &&
            userInfo.metadata && (
              <SidebarProfileButton
                isLoading={userInfo.loading}
                userId={selectedWallet?.userId || ""}
                tokenId={userInfo.metadata.tokenId || ""}
                image={userInfo.metadata.image || ""}
                isExpanded={isSidebarExpanded}
              />
            )}
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
    marginLeft: layout.padding_x2,
  },
});
