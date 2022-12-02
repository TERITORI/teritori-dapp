import React, { useEffect, useRef, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface FadeInProps {
  style?: StyleProp<ViewStyle>;
  duration?: number;
}

export const AnimationExpand: React.FC<FadeInProps> = ({
  style,
  children,
  duration = 500,
}) => {
  // variables
  const [isExpanded, setIsExpanded] = useState(false);
  const aref = useAnimatedRef<View>();
  const heightRef = useRef<number>(0);
  const animStyle = useAnimatedStyle(
    () => ({
      height: isExpanded ? withTiming(heightRef.current) : withTiming(0),
      opacity: isExpanded ? withTiming(1) : withTiming(0),
    }),
    [isExpanded]
  );

  // hooks
  useEffect(() => {
    setTimeout(() => {
      if (heightRef.current) {
        setIsExpanded(true);
      }
    }, 200);
  }, []);

  // renders
  return (
    <Animated.View style={[animStyle, style]}>
      <View
        ref={aref}
        onLayout={({
          nativeEvent: {
            layout: { height: h },
          },
        }) => (heightRef.current = h)}
      >
        {children}
      </View>
    </Animated.View>
  );
};
