import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TextProps, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { BrandText } from "./BrandText";
import { errorColor } from "../utils/style/colors";
import { fontSemibold14 } from "../utils/style/fonts";

interface ErrorTextProps extends TextProps {
  center?: boolean;
  style?: ViewStyle;
}

// error text component to be used by input elements
export const ErrorText: React.FC<ErrorTextProps> = ({
  children,
  style,
  ...restProps
}) => {
  const aref = useAnimatedRef<View>();
  const heightRef = useRef<number>(0);
  const [isExpandable, setIsExpandable] = useState(false);
  const animStyle = useAnimatedStyle(
    () => ({
      height: isExpandable ? withTiming(heightRef.current) : withTiming(0),
      opacity: isExpandable ? withTiming(1) : withTiming(0),
    }),
    [isExpandable],
  );

  // hooks
  useEffect(() => {
    // fix for height not calculating
    if (children) {
      setTimeout(() => {
        setIsExpandable(true);
      }, 200);
    } else {
      setIsExpandable(false);
    }
  }, [children]);

  return (
    <Animated.View style={animStyle}>
      <View
        ref={aref}
        onLayout={({
          nativeEvent: {
            layout: { height: h },
          },
        }) => (heightRef.current = h)}
      >
        <BrandText style={[styles.text, style]} {...restProps}>
          {children}
        </BrandText>
      </View>
    </Animated.View>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  text: StyleSheet.flatten([
    fontSemibold14,
    {
      marginTop: 6,
      color: errorColor,
    },
  ]),
});
