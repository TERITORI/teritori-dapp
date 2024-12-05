import React, { ReactNode } from "react";
import { View, ViewStyle, StyleProp, Pressable } from "react-native";
import Animated, {
  WithSpringConfig,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import { useSidebar } from "../../context/SidebarProvider";
import { neutral17, neutral33, withAlpha } from "../../utils/style/colors";
import {
  headerHeight,
  headerMarginHorizontal,
  layout,
  screenContainerContentMarginHorizontal,
} from "../../utils/style/layout";
import { NetworkSelector } from "../NetworkSelector/NetworkSelector";
import { SVG } from "../SVG";
import { SearchBar } from "../Search/SearchBar";
import { ConnectWalletButton } from "../TopMenu/ConnectWalletButton";
import { TogglePlayerButton } from "../mediaPlayer/TogglePlayerButton";
import { BackButton } from "../navigation/components/BackButton";
import { CartIconButtonBadge } from "../navigation/components/CartIconButtonBadge";
import { Separator } from "../separators/Separator";
import { SpacerRow } from "../spacer";

import { useMediaPlayer } from "@/context/MediaPlayerProvider";
import { NetworkFeature, NetworkKind } from "@/networks";

const SpringConfig: WithSpringConfig = {
  stiffness: 100,
  mass: 0.5,
  restDisplacementThreshold: 0.2,
};

export const Header: React.FC<{
  style?: StyleProp<ViewStyle>;
  onBackPress?: () => void;
  children: ReactNode;
  forceNetworkId?: string;
  forceNetworkKind?: NetworkKind;
  forceNetworkFeatures?: NetworkFeature[];
}> = ({
  children,
  style,
  onBackPress,
  forceNetworkId,
  forceNetworkKind,
  forceNetworkFeatures,
}) => {
  const { isSidebarExpanded, toggleSidebar } = useSidebar();
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
  const { media } = useMediaPlayer();
  return (
    <View
      style={[
        {
          height: headerHeight,
          maxHeight: headerHeight,
          paddingRight: screenContainerContentMarginHorizontal,
          width: "100%",
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomColor: withAlpha(neutral33, 0.5),
          borderBottomWidth: 1,
          zIndex: 999,
        },
        style,
      ]}
    >
      <View
        style={{
          width: "100%",
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Animated.View
          style={[
            toggleButtonStyle,
            { marginRight: layout.contentSpacing - 20 },
          ]}
        >
          <Pressable
            style={{
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
              borderLeftWidth: isSidebarExpanded ? undefined : 0,
            }}
            onPress={toggleSidebar}
          >
            <SVG source={chevronRightSVG} />
          </Pressable>
        </Animated.View>
        {/*If you want to add buttons or something in the Header in desktop mode, refer to ScreenContainer/index.tsx for now*/}
        {!!onBackPress && <BackButton onPress={onBackPress} />}
        {children && (
          <>
            <SpacerRow size={1.5} />
            {children}
          </>
        )}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            height: headerHeight,
            alignItems: "center",
          }}
        >
          <TogglePlayerButton />
          {media && (
            <Separator
              horizontal
              style={{ height: "100%", marginHorizontal: layout.spacing_x2 }}
            />
          )}
          <SearchBar style={{ marginLeft: media ? 0 : 60, flex: 1 }} />
          <Separator
            horizontal
            style={{ height: "100%", marginHorizontal: layout.spacing_x2 }}
          />
          <CartIconButtonBadge style={{ marginRight: layout.spacing_x1_5 }} />
          <NetworkSelector
            forceNetworkId={forceNetworkId}
            forceNetworkKind={forceNetworkKind}
            forceNetworkFeatures={forceNetworkFeatures}
            style={{ marginRight: layout.spacing_x1_5 }}
          />
          <ConnectWalletButton />
        </View>
      </View>
      <View />
    </View>
  );
};
