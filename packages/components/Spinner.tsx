import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SvgProps } from "react-native-svg";

import { SVG } from "./SVG";

import refreshSVG from "@/assets/icons/refresh-white.svg";

const SVG_SIZE = 20;
type SpinnerProps = {
  svg?: React.FC<SvgProps>;
  size?: number;
};
export const Spinner = ({ size, svg }: SpinnerProps) => {
  const rotate = useSharedValue(0);

  useEffect(() => {
    rotate.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
    );
  }, [rotate]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotate.value}deg` }],
    };
  });
  return (
    <View>
      <Animated.View
        style={[
          animatedStyle,
          { height: size || SVG_SIZE, width: size || SVG_SIZE },
        ]}
      >
        <SVG
          source={svg || refreshSVG}
          width={size || SVG_SIZE}
          height={size || SVG_SIZE}
        />
      </Animated.View>
    </View>
  );
};
