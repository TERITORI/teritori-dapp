import React from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import refreshSVG from "../../../../../assets/icons/refresh-white.svg";
import { SVG } from "../../../../components/SVG";

const SVG_SIZE = 20;

export const Spinner = () => {
  const rotate = useSharedValue(0);

  rotate.value = withRepeat(
    withTiming(360, {
      duration: 1000,
      easing: Easing.linear,
    }),
    -1,
  );
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotate.value}deg` }],
    };
  });
  return (
    <View>
      <Animated.View
        style={[animatedStyle, { height: SVG_SIZE, width: SVG_SIZE }]}
      >
        <SVG source={refreshSVG} width={SVG_SIZE} height={SVG_SIZE} />
      </Animated.View>
    </View>
  );
};
