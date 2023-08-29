// libraries
import React, { useEffect, useRef, useState } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
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
  isExpandedByDefault?: boolean;
};

export const CollapsableSection: React.FC<CollapsableSectionProps> = ({
  title,
  icon,
  children,
  isExpandedByDefault = false,
}) => {
  // variables
  const [isExpanded, setIsExpanded] = useState(false);
  const aref = useAnimatedRef<View>();
  const heightRef = useRef<number>(0);
  const style = useAnimatedStyle(
    () => ({
      height: isExpanded ? withTiming(heightRef.current) : withTiming(0),
      opacity: isExpanded ? withTiming(1) : withTiming(0),
    }),
    [isExpanded]
  );
  const rotateStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      isExpanded ? 1 : 0,
      [0, 1],
      [0, 180],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  }, [isExpanded]);

  // hooks
  useEffect(() => {
    setTimeout(() => {
      if (isExpandedByDefault) {
        setIsExpanded(true);
      }
    }, 1000);
  }, [isExpandedByDefault]);

  // functions
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // returns
  return (
    <TertiaryBox fullWidth>
      <Pressable onPress={toggleExpansion} style={headerStyle}>
        <View style={rowWithCenterStyle}>
          <SVG source={icon} width={14} height={14} color={secondaryColor} />
          <SpacerRow size={1.5} />
          <BrandText style={[fontSemibold14, { lineHeight: 14 }]}>
            {title}
          </BrandText>
        </View>

        <Animated.View style={[chevronContainerStyle, rotateStyle]}>
          <SVG
            source={chevronDownSVG}
            width={16}
            height={16}
            color={isExpanded ? primaryColor : secondaryColor}
          />
        </Animated.View>
      </Pressable>
      <Animated.View style={[childrenContainerStyle, style]}>
        <View
          ref={aref}
          onLayout={({
            nativeEvent: {
              layout: { height: h },
            },
          }) => (heightRef.current = h)}
          style={childrenContainerStyle}
        >
          {children}
        </View>
      </Animated.View>
    </TertiaryBox>
  );
};

const headerStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  padding: layout.padding_x2,
};
const rowWithCenterStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
};
const chevronContainerStyle: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
  height: layout.iconButton,
  width: layout.iconButton,
  borderRadius: layout.iconButton / 2,
  backgroundColor: neutral33,
  borderWidth: 1,
  borderColor: neutral44,
};
const childrenContainerStyle: ViewStyle = {
  width: "100%",
};
