import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
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
import { fontSemibold14 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { BrandText } from "../../../BrandText";
import { SVG } from "../../../SVG";

interface RefreshButtonProps {
  isRefreshing: SharedValue<boolean>;
  onPress?(): void;
}

const SVG_SIZE = 16;
const WIDTH = 140;
const LOADING_WIDTH = SVG_SIZE + layout.spacing_x1_5 * 2;

export const RefreshButton: React.FC<RefreshButtonProps> = ({
  isRefreshing,
  onPress,
}) => {
  const isRefreshingAnim = useDerivedValue(() => {
    return isRefreshing.value;
  }, [isRefreshing.value]);

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

  const animStyle = useAnimatedStyle(
    () => ({
      width: isRefreshingAnim.value
        ? withTiming(LOADING_WIDTH)
        : withTiming(WIDTH),
    }),
    [isRefreshingAnim.value],
  );

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ: `${rotateValue.value * 180}deg`,
        },
      ],
    };
  }, [rotateValue.value]);

  const opacityStyle = useAnimatedStyle(
    () => ({
      opacity: isRefreshingAnim.value
        ? withTiming(0, { duration: 100 })
        : withTiming(1, { duration: 800 }),
    }),
    [isRefreshingAnim.value],
  );

  return (
    <Animated.View style={[styles.selfCenter, animStyle]}>
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <Animated.View style={animatedStyles}>
          <SVG source={refreshSVG} width={SVG_SIZE} height={SVG_SIZE} />
        </Animated.View>
        <Animated.View style={[styles.textContainer, opacityStyle]}>
          <BrandText style={fontSemibold14}>Refresh feed</BrandText>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  selfCenter: {
    alignSelf: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: neutral17,
    borderWidth: 1,
    borderColor: neutral33,
    borderRadius: 999,
    paddingHorizontal: layout.spacing_x1_5,
    height: 42,
  },
  textContainer: {
    marginLeft: layout.spacing_x1_5,
  },
});
