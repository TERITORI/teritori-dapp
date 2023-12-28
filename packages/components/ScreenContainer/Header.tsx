import React, { ReactNode } from "react";
import { View, ViewStyle, StyleProp, Pressable } from "react-native";
import Animated, {
  WithSpringConfig,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import { useSidebar } from "../../context/SidebarProvider";
import { neutral17, neutral33 } from "../../utils/style/colors";
import { headerHeight, layout } from "../../utils/style/layout";
import { SVG } from "../SVG";
import { BackButton } from "../navigation/components/BackButton";
import { SpacerRow } from "../spacer";

const SpringConfig: WithSpringConfig = {
  stiffness: 100,
  mass: 0.5,
  restDisplacementThreshold: 0.2,
};

export const Header: React.FC<{
  style?: StyleProp<ViewStyle>;
  onBackPress?: () => void;
  children: ReactNode;
}> = ({ children, style, onBackPress }) => {
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
  return (
    <View
      style={[
        {
          height: headerHeight,
          maxHeight: headerHeight,
          width: "100%",
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomColor: neutral33,
          borderBottomWidth: 1,
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
      </View>

      {/* Wallet selector placeholder */}
      <View />
    </View>
  );
};
