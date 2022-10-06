// libraries
import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  runOnUI,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SvgProps } from "react-native-svg";

// misc
import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import {
  neutral33,
  neutral44,
  primaryColor,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { SpacerRow } from "../spacer";

type CollapsableSectionProps = {
  title: string;
  icon: React.FC<SvgProps>;
};

export const CollapsableSection: React.FC<CollapsableSectionProps> = ({
  title,
  icon,
  children,
}) => {
  // variables

  const [isExpandable, setIsExpandable] = useState(true);
  const aref = useAnimatedRef<View>();
  const open = useSharedValue(false);
  const heightRef = useRef<number>(0);
  const height = useSharedValue(0);
  const style = useAnimatedStyle(
    () => ({
      height: open.value ? withSpring(height.value) : withTiming(0),
      opacity: open.value ? withSpring(1) : withTiming(0),
    }),
    [isExpandable]
  );
  const rotateStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      open.value ? 1 : 0,
      [0, 1],
      [0, 180],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  }, [isExpandable]);
  // hooks

  // functions
  const toggleExpansion = () => {
    if (height.value === 0) {
      runOnUI(() => {
        "worklet";
        height.value = heightRef.current;
      })();
    } else {
      runOnUI(() => {
        "worklet";
        height.value = 0;
      })();
    }
    open.value = !open.value;
    setIsExpandable(!open.value);
  };

  // returns
  return (
    <TertiaryBox fullWidth>
      <View style={styles.header}>
        <View style={styles.rowWithCenter}>
          <SVG source={icon} width={14} height={14} color={secondaryColor} />
          <SpacerRow size={1.5} />
          <BrandText style={[fontSemibold14, { lineHeight: 14 }]}>
            {title}
          </BrandText>
        </View>

        <Animated.View style={[styles.chevronContainer, rotateStyle]}>
          <Pressable onPress={toggleExpansion}>
            <SVG
              source={chevronDownSVG}
              width={16}
              height={16}
              color={isExpandable ? secondaryColor : primaryColor}
            />
          </Pressable>
        </Animated.View>
      </View>
      <Animated.View style={[styles.childrenContainer, style]}>
        <View
          ref={aref}
          onLayout={({
            nativeEvent: {
              layout: { height: h },
            },
          }) => (heightRef.current = h)}
          style={styles.childrenContainer}
        >
          {children}
        </View>
      </Animated.View>
    </TertiaryBox>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: layout.padding_x2,
  },
  rowWithCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  chevronContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: layout.icon,
    width: layout.icon,
    borderRadius: layout.icon / 2,
    background: neutral33,
    borderWidth: 1,
    borderColor: neutral44,
  },
  childrenContainer: {
    width: "100%",
  },
});
