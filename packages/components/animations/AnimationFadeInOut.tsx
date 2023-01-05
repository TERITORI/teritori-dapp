import React, { useEffect } from "react";
import { LayoutChangeEvent, StyleProp, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface AnimationFadeInOutProps {
  visible: boolean;
  style?: StyleProp<ViewStyle>;
  duration?: number;
  onLayout?: ((event: LayoutChangeEvent) => void) | undefined;
}

export const AnimationFadeInOut: React.FC<AnimationFadeInOutProps> = ({
  visible,
  style,
  children,
  duration = 500,
  onLayout,
}) => {
  // variables
  const opacity = useSharedValue(0);
  const zIndex = useDerivedValue(
    () => (opacity.value === 0 ? -1000 : 1000),
    [opacity.value]
  );

  const animationStyle = useAnimatedStyle(
    () => ({
      opacity: opacity.value,
      zIndex: zIndex.value,
    }),
    [opacity.value, zIndex.value]
  );

  // hooks
  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration });
    } else {
      opacity.value = withTiming(0, { duration });
    }
  }, [visible]);

  // renders
  return (
    <Animated.View style={[style, animationStyle]} onLayout={onLayout}>
      {children}
    </Animated.View>
  );
};
