import React, { PropsWithChildren, useEffect, useRef } from "react";
import { Animated, ViewStyle } from "react-native";

import { shouldUseNativeDriver } from "../../../utils/animations";

type FadeInViewProps = PropsWithChildren<{ style: ViewStyle }>;
export const FadeInView: React.FC<FadeInViewProps> = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: shouldUseNativeDriver,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim, // Bind opacity to animated value
      }}
    >
      {props.children}
    </Animated.View>
  );
};
