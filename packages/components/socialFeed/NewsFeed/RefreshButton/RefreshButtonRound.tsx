import React from "react";
import { TouchableOpacity, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import refreshSVG from "../../../../../assets/icons/refresh.svg";
import { neutral17, neutral33 } from "../../../../utils/style/colors";
import {
  layout,
  RESPONSIVE_BREAKPOINT_S,
} from "../../../../utils/style/layout";
import { SVG } from "../../../SVG";

import {
  ROUND_BUTTON_WIDTH_S,
  ROUND_BUTTON_WIDTH_L,
} from "@/utils/social-feed";

interface RefreshButtonProps {
  isRefreshing: SharedValue<boolean>;
  onPress?(): void;
  widthToAnimate?: number;
}

const SVG_SIZE = 16;

export const RefreshButtonRound: React.FC<RefreshButtonProps> = ({
  isRefreshing,
  onPress,
}) => {
  const isRefreshingAnim = useDerivedValue(() => {
    return isRefreshing.value;
  }, [isRefreshing.value]);

  const { width } = useWindowDimensions();

  const rotateValue = useDerivedValue(() => {
    return isRefreshingAnim.value
      ? withRepeat(
          withTiming(1, {
            duration: 500,
            easing: Easing.linear,
          }),
          -1,
        )
      : withTiming(0, {
          duration: 500,
          easing: Easing.linear,
        });
  }, [isRefreshingAnim.value]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ: `${rotateValue.value * 180}deg`,
        },
      ],
    };
  }, [rotateValue.value]);

  return (
    <Animated.View
      style={{
        alignSelf: "center",
      }}
    >
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: neutral17,
          borderWidth: 1,
          borderColor: neutral33,
          borderRadius: 999,
          padding: layout.spacing_x1_5,

          justifyContent: "center",
          width:
            width < RESPONSIVE_BREAKPOINT_S
              ? ROUND_BUTTON_WIDTH_S
              : ROUND_BUTTON_WIDTH_L,
          height:
            width < RESPONSIVE_BREAKPOINT_S
              ? ROUND_BUTTON_WIDTH_S
              : ROUND_BUTTON_WIDTH_L,
        }}
        onPress={onPress}
      >
        <Animated.View style={animatedStyles}>
          <SVG source={refreshSVG} width={SVG_SIZE} height={SVG_SIZE} />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};
