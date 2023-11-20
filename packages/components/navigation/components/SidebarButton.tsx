import { useIsFocused } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { SideNotch } from "./SideNotch";
import { SidebarNestedButton } from "./SidebarNestedButton";
import chevronDownSVG from "../../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../../assets/icons/chevron-up.svg";
import { useSidebar } from "../../../context/SidebarProvider";
import { useAppRoute } from "../../../utils/navigation";
import {
  neutral17,
  neutral33,
  neutral77,
  primaryColor,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold12 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { arrayIncludes } from "../../../utils/typescript";
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
  const { isSidebarExpanded } = useSidebar();
  const { name: currentRouteName } = useAppRoute();
  const allNestedRoutes = useMemo(
    () => (nested ? Object.values(nested).map((d) => d.route) : []),
    [nested],
  );
  const [isNestedBarExpanded, setIsNestedBarExpanded] =
    useState<boolean>(false);
  const isComingSoon = route === "ComingSoon";
  const isFocused = useIsFocused();
  const isSelected = useMemo(() => {
    if (nested) {
      return (
        arrayIncludes(allNestedRoutes, currentRouteName) && !isNestedBarExpanded
      );
    } else {
      return route === currentRouteName;
    }
  }, [nested, allNestedRoutes, currentRouteName, isNestedBarExpanded, route]);

  useEffect(() => {
    setIsNestedBarExpanded((isNestedBarExpanded) => {
      if (
        arrayIncludes(allNestedRoutes, currentRouteName) &&
        !isNestedBarExpanded
      ) {
        return true;
      } else if (!isFocused && isNestedBarExpanded) {
        return false;
      }
      return isNestedBarExpanded;
    });
  }, [allNestedRoutes, currentRouteName, isFocused]);

  const toggleNestedSidebar = useCallback(
    () => setIsNestedBarExpanded((isNestedBarExpanded) => !isNestedBarExpanded),
    [],
  );

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
    [isSidebarExpanded],
  );

  return (
    <CustomPressable
      onPress={isComingSoon ? () => {} : onPress && (() => onPress(route))}
      disabled={isSelected}
      style={containerCStyle}
    >
      {({ hovered }) => (
        <View>
          <View style={titleContainerCStyle}>
            {isSelected && <SideNotch style={{ left: -layout.spacing_x2 }} />}
            <View
              style={[
                svgContainerCStyle,
                isSelected && { borderColor: primaryColor },
                isComingSoon && { opacity: 0.5 },
              ]}
            >
              <SVGorImageIcon icon={icon} iconSize={iconSize} />
            </View>
            <SpacerRow size={2} />
            <Animated.View style={[rowCenterCStyle, opacityStyle]}>
              <BrandText
                style={[
                  fontSemibold12,
                  (isSelected || isComingSoon) && { color: neutral77 },
                ]}
              >
                {isComingSoon && hovered ? "Coming Soon" : title}
              </BrandText>
              {nested && (
                <Animated.View>
                  <Pressable
                    style={chevronCStyle}
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
            <Animated.View>
              <View style={nestedContainerCStyle}>
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

const containerCStyle: ViewStyle = {
  width: "100%",
  paddingHorizontal: layout.spacing_x2,
};

const titleContainerCStyle: ViewStyle = {
  paddingVertical: layout.spacing_x1,
  alignItems: "center",
  flexDirection: "row",
};

const rowCenterCStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  flex: 1,
  maxWidth: 120,
};

const svgContainerCStyle: ViewStyle = {
  borderWidth: 2,
  height: 40,
  width: 40,
  justifyContent: "center",
  alignItems: "center",
  borderColor: neutral33,
  borderRadius: 20,
};

const chevronCStyle: ViewStyle = {
  height: 20,
  width: 20,
  borderRadius: 10,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: neutral17,
};

const nestedContainerCStyle: ViewStyle = {
  flex: 1,
  paddingVertical: layout.spacing_x0_5,
  backgroundColor: neutral17,
  borderRadius: 8,
};
