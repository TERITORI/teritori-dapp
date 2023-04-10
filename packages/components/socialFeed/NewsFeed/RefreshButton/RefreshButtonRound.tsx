import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import refreshSVG from "../../../../../assets/icons/refresh.svg";
import { neutral17, neutral33 } from "../../../../utils/style/colors";
import { layout } from "../../../../utils/style/layout";
import { SVG } from "../../../SVG";

interface RefreshButtonProps {
  isRefreshing?: boolean;
  onPress?(): void;
  widthToAnimate?: number;
}

const SVG_SIZE = 16;

export const RefreshButtonRound: React.FC<RefreshButtonProps> = ({
  isRefreshing,
  onPress,
}) => {
  // variables
  const isRefreshingAnim = useDerivedValue(() => {
    return isRefreshing;
  }, [isRefreshing]);

  const rotateValue = useDerivedValue(() => {
    return isRefreshingAnim.value
      ? withRepeat(
          withTiming(1, {
            duration: 500,
            easing: Easing.linear,
          }),
          -1
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

  // returns
  return (
    <Animated.View style={[styles.selfCenter]}>
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <Animated.View style={animatedStyles}>
          <SVG source={refreshSVG} width={SVG_SIZE} height={SVG_SIZE} />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

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
    padding: layout.padding_x1_5,

    justifyContent: "center",
    width: 68,
    height: 68,
  },
  textContainer: {
    marginLeft: layout.padding_x1_5,
  },
});
