import React, { useEffect, useRef } from "react";
import {
  Animated,
  LayoutChangeEvent,
  Platform,
  StyleProp,
  ViewStyle,
} from "react-native";

interface FadeInProps {
  style?: StyleProp<ViewStyle>;
  duration?: number;
  delay?: number;
  onLayout?: ((event: LayoutChangeEvent) => void) | undefined;
}

export const AnimationFadeIn: React.FC<FadeInProps> = ({
  style,
  children,
  duration = 500,
  delay,
  onLayout,
}) => {
  // variables
  const fadeInAnimation = useRef(new Animated.Value(0)).current;

  // hooks
  useEffect(() => {
    Animated.timing(fadeInAnimation, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [duration, delay, fadeInAnimation]);

  // renders
  return (
    <Animated.View
      style={[style, { opacity: fadeInAnimation }]}
      onLayout={onLayout}
    >
      {children}
    </Animated.View>
  );
};
