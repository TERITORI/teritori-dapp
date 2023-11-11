import React, { useMemo } from "react";
import { View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { BrandText } from "../../../../../components/BrandText";
import { SVGorImageIcon } from "../../../../../components/SVG/SVGorImageIcon";
import { CustomPressable } from "../../../../../components/buttons/CustomPressable";
import { SideNotch } from "../../../../../components/navigation/components/SideNotch";
import { SidebarType } from "../../../../../components/navigation/types";
import { SpacerRow } from "../../../../../components/spacer";
import { useSidebar } from "../../../../../context/SidebarProvider";
import { useTheme } from "../../../../../hooks/useTheme";
import { useAppRoute } from "../../../../../utils/navigation";
import { fontSemibold12 } from "../../../../../utils/style/fonts";
import { layout } from "../../../../../utils/style/layout";

interface SideBarButtonProps extends SidebarType {
  onPress?: (routeName: SidebarType["route"]) => void;
  iconSize?: number;
}

export const SideBarButton: React.FC<SideBarButtonProps> = ({
  icon,
  onPress,
  title,
  route,
  iconSize = 28,
}) => {
  const { isSidebarExpanded } = useSidebar();
  const { name: currentRouteName } = useAppRoute();
  const isComingSoon = route === "ComingSoon";
  const isSelected = useMemo(
    () => route === currentRouteName,
    [currentRouteName, route]
  );
  const theme = useTheme();

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
                { borderColor: theme.borderColor },
                isComingSoon && {
                  opacity: 0.5,
                },
              ]}
            >
              <SVGorImageIcon color="#3063D3" icon={icon} iconSize={iconSize} />
            </View>
            <SpacerRow size={2} />
            <Animated.View style={[rowCenterCStyle, opacityStyle]}>
              <BrandText
                style={[
                  fontSemibold12,
                  (isSelected || isComingSoon) && { color: theme.textColor },
                ]}
              >
                {isComingSoon && hovered ? "Coming Soon" : title}
              </BrandText>
            </Animated.View>
          </View>
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
  borderWidth: 1,
  height: 40,
  width: 40,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 20,
};
