import { useIsFocused, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  // Extrapolate,
  // interpolate,
  useAnimatedStyle,
  // withSpring,
  withTiming,
} from "react-native-reanimated";

import { SideNotch } from "./SideNotch";
import { SidebarNestedButton } from "./SidebarNestedButton";
import chevronDownSVG from "../../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../../assets/icons/chevron-up.svg";
import { useSidebar } from "../../../context/SidebarProvider";
import {
  neutral17,
  neutral33,
  neutral77,
  primaryColor,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold12 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { SVGorImageIcon } from "../../SVG/SVGorImageIcon";
import { CustomPressable } from "../../buttons/CustomPressable";
import { SpacerRow } from "../../spacer";
import { SidebarType } from "../types";

export interface SidebarButtonProps extends SidebarType {
  onPress?: (routeName: SidebarType["route"]) => void;
  iconSize?: number;
}

export const SidebarButton: React.FC<SidebarButtonProps> = ({
  icon,
  onPress,
  title,
  route,
  iconSize = 28,
  nested,
}) => {
  // variables
  const { isSidebarExpanded } = useSidebar();
  const { name: currentRouteName } = useRoute();
  const allNestedRoutes = useMemo(
    () => nested && Object.values(nested).map((d) => d.route),
    [nested]
  );
  const [isNestedBarExpanded, setIsNestedBarExpanded] =
    useState<boolean>(false);
  const isComingSoon = route === "ComingSoon";
  const isFocused = useIsFocused();
  const isSelected = useMemo(() => {
    if (nested) {
      return (
        allNestedRoutes?.includes(currentRouteName as SidebarType["route"]) &&
        !isNestedBarExpanded
      );
    } else {
      return route === currentRouteName;
    }
  }, [nested, allNestedRoutes, currentRouteName, isNestedBarExpanded, route]);

  // hooks
  useEffect(() => {
    setIsNestedBarExpanded((isNestedBarExpanded) => {
      if (
        allNestedRoutes &&
        allNestedRoutes.includes(currentRouteName as SidebarType["route"]) &&
        !isNestedBarExpanded
      ) {
        return true;
      } else if (!isFocused && isNestedBarExpanded) {
        return false;
      }
      return isNestedBarExpanded;
    });
  }, [allNestedRoutes, currentRouteName, isFocused]);

  // functions
  const toggleNestedSidebar = useCallback(
    () => setIsNestedBarExpanded((isNestedBarExpanded) => !isNestedBarExpanded),
    []
  );

  // animations
  const opacityStyle = useAnimatedStyle(
    () => ({
      opacity: isSidebarExpanded
        ? withTiming(1, {
            duration: 500,
          })
        : withTiming(0, {
            duration: 100,
          }),
    }),
    [isSidebarExpanded]
  );

  // const nestedBarStyle = useAnimatedStyle(
  //   () => ({
  //     height: isNestedBarExpanded
  //       ? withSpring(
  //           32 * (allNestedRoutes?.length || 1) + layout.padding_x0_5 * 2
  //         )
  //       : withTiming(0),
  //     opacity: isNestedBarExpanded ? withSpring(1) : withTiming(0),
  //   }),
  //   [isNestedBarExpanded]
  // );

  // const rotateStyle = useAnimatedStyle(() => {
  //   const rotate = interpolate(
  //     isNestedBarExpanded ? 1 : 0,
  //     [0, 1],
  //     [0, 180],
  //     Extrapolate.CLAMP
  //   );

  //   return {
  //     transform: [{ rotate: `${rotate}deg` }],
  //   };
  // }, [isNestedBarExpanded]);

  // returns
  return (
    <CustomPressable
      onPress={isComingSoon ? () => {} : onPress && (() => onPress(route))}
      disabled={isSelected}
      style={styles.container}
    >
      {({ hovered }) => (
        <View>
          <View style={styles.titleContainer}>
            {isSelected && <SideNotch style={{ left: -layout.padding_x2 }} />}
            <View
              style={[
                styles.svgContainer,
                isSelected && { borderColor: primaryColor },
                isComingSoon && { opacity: 0.5 },
              ]}
            >
              <SVGorImageIcon icon={icon} iconSize={iconSize} />
            </View>
            <SpacerRow size={2} />
            <Animated.View style={[styles.rowCenter, opacityStyle]}>
              <BrandText
                style={[
                  fontSemibold12,
                  (isSelected || isComingSoon) && { color: neutral77 },
                ]}
              >
                {isComingSoon && hovered ? "Coming Soon" : title}
              </BrandText>
              {nested && (
                // <Animated.View style={rotateStyle}>
                <Animated.View>
                  <Pressable
                    style={styles.chevron}
                    onPress={toggleNestedSidebar}
                  >
                    <SVG
                      source={
                        isNestedBarExpanded ? chevronUpSVG : chevronDownSVG
                      }
                      height={16}
                      width={16}
                      color={secondaryColor}
                    />
                  </Pressable>
                </Animated.View>
              )}
            </Animated.View>
          </View>

          {nested && isNestedBarExpanded && (
            // <Animated.View style={nestedBarStyle}>
            <Animated.View>
              <View style={styles.nestedContainer}>
                {Object.values(nested).map((n) => (
                  <SidebarNestedButton
                    key={n.title}
                    {...n}
                    onPress={
                      n.route === "ComingSoon"
                        ? () => {}
                        : onPress && (() => onPress(n.route))
                    }
                  />
                ))}
              </View>
            </Animated.View>
          )}
        </View>
      )}
    </CustomPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: layout.padding_x2,
  },
  titleContainer: {
    paddingVertical: layout.padding_x1,
    alignItems: "center",
    flexDirection: "row",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    maxWidth: 120,
  },
  svgContainer: {
    borderWidth: 2,
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    borderColor: neutral33,
    borderRadius: 20,
  },
  chevron: {
    height: 20,
    width: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: neutral17,
  },
  nestedContainer: {
    flex: 1,
    paddingVertical: layout.padding_x0_5,
    backgroundColor: neutral17,
    borderRadius: 8,
  },
});
