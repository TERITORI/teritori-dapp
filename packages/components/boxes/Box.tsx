import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import { ReactNode } from "react";
import {
  StyleProp,
  View,
  ViewStyle,
  StyleSheet,
  ViewProps,
} from "react-native";

import { useTheme } from "../../hooks/useTheme";

// Be very careful while editing this, try to refrain from adding new props

const defaultBoxBorderRadius = 8;
const notchRadius = 12;

export type BoxStyle = Pick<
  ViewStyle,
  | "margin"
  | "marginBottom"
  | "marginEnd"
  | "marginHorizontal"
  | "marginLeft"
  | "marginRight"
  | "marginStart"
  | "marginTop"
  | "marginVertical"
  | "width"
  | "height"
  | "borderWidth"
  | "padding"
  | "paddingBottom"
  | "paddingEnd"
  | "paddingHorizontal"
  | "paddingLeft"
  | "paddingRight"
  | "paddingStart"
  | "paddingTop"
  | "paddingVertical"
  | "alignItems"
  | "justifyContent"
  | "flexDirection"
  | "minWidth"
  | "maxWidth"
  | "minHeight"
  | "maxHeight"
  | "alignSelf"
  | "opacity"
  | "position"
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "flex"
> & { borderRadius?: number; backgroundColor?: string; borderColor?: string };

export type GradientParams = Omit<LinearGradientProps, keyof ViewProps>;

export const Box: React.FC<{
  children: ReactNode;
  borderGradient?: GradientParams;
  fillGradient?: GradientParams;
  notched?: boolean;
  style?: StyleProp<BoxStyle>;
}> = ({
  children,
  borderGradient: maybeBorderProps,
  fillGradient: maybeFillProps,
  notched,
  style,
}) => {
  const theme = useTheme();
  const flatStyle = StyleSheet.flatten(style);
  const {
    margin,
    width,
    height,
    borderWidth: maybeBorderWidth,
    borderRadius: maybeBorderRadius,
    backgroundColor,
    borderColor,
    marginBottom,
    marginEnd,
    marginHorizontal,
    marginLeft,
    marginRight,
    marginStart,
    marginTop,
    marginVertical,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    alignSelf,
    opacity,
    position,
    left,
    right,
    top,
    bottom,
    flex,
    ...styleRest
  } = flatStyle;

  const borderWidth = maybeBorderWidth === undefined ? 0 : maybeBorderWidth;
  const borderRadius =
    maybeBorderRadius === undefined
      ? defaultBoxBorderRadius
      : maybeBorderRadius;

  const fillProps = maybeFillProps || {
    colors: [theme.backgroundColor, theme.backgroundColor],
  };
  const borderProps = maybeBorderProps || {
    colors: [theme.backgroundColor, theme.backgroundColor],
  };
  let { colors: borderColors, ...borderPropsRest } = borderProps;
  if (borderColor) {
    borderColors = [borderColor, borderColor];
  }
  let { colors: fillColors, ...fillPropsRest } = fillProps;
  if (backgroundColor) {
    fillColors = [backgroundColor, backgroundColor];
  }
  return (
    <View
      style={{
        margin,
        marginBottom,
        marginEnd,
        marginHorizontal,
        marginLeft,
        marginRight,
        marginStart,
        marginTop,
        marginVertical,
        minWidth,
        maxWidth,
        minHeight,
        maxHeight,
        width,
        height,
        alignSelf,
        opacity,
        position,
        left,
        right,
        top,
        bottom,
        flex,
      }}
    >
      {borderWidth > 0 &&
        (notched ? (
          <NotchedRectangle
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              borderRadius,
            }}
            notchRadius={notchRadius}
            color={borderColors[0]}
          />
        ) : (
          <LinearGradient
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              borderRadius,
            }}
            colors={borderColors}
            {...borderPropsRest}
          />
        ))}
      {notched ? (
        <NotchedRectangle
          style={{
            left: borderWidth,
            top: borderWidth,
            right: borderWidth,
            bottom: borderWidth,
            position: "absolute",
            borderRadius: borderRadius ? borderRadius - borderWidth : undefined,
          }}
          notchRadius={notchRadius - borderWidth / 2}
          color={fillColors[0]}
        />
      ) : (
        <LinearGradient
          style={{
            left: borderWidth,
            top: borderWidth,
            right: borderWidth,
            bottom: borderWidth,
            position: "absolute",
            borderRadius: borderRadius ? borderRadius - borderWidth : undefined,
          }}
          colors={fillColors}
          {...fillPropsRest}
        />
      )}
      <View
        style={[
          {
            width: "100%",
            height: "100%",
            borderWidth,
            borderColor: "transparent",
          },
          styleRest,
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const sqrt2 = Math.sqrt(2);
const centerBlockInsetGain = 1 - sqrt2 / 2;

const NotchedRectangle: React.FC<{
  color: string;
  style?: StyleProp<ViewStyle>;
  notchRadius: number;
}> = ({ color, style, notchRadius }) => {
  // mathed
  const centerBlockSize = notchRadius * sqrt2;
  const centerBlockInset = notchRadius * centerBlockInsetGain;

  // this is black magic, should do the math to get proper formulas
  const brokenRadius = notchRadius * 1.7;
  const fillersHeight = brokenRadius - notchRadius;
  const fillersWidth = notchRadius * 0.505;
  return (
    <View
      style={[
        {
          borderTopLeftRadius: brokenRadius,
          borderBottomRightRadius: brokenRadius,
          backgroundColor: color,
        },
        style,
      ]}
    >
      <View
        style={{
          height: fillersHeight,
          width: fillersWidth,
          backgroundColor: color,
          position: "absolute",
          top: notchRadius,
          left: 0,
        }}
      />
      <View
        style={{
          height: fillersWidth,
          width: fillersHeight,
          backgroundColor: color,
          position: "absolute",
          top: 0,
          left: notchRadius,
        }}
      />
      <View
        style={{
          height: centerBlockSize,
          width: centerBlockSize,
          backgroundColor: color,
          position: "absolute",
          transform: [
            { translateX: centerBlockInset },
            { translateY: centerBlockInset },
            { rotate: "45deg" },
          ],
        }}
      />
      <View
        style={{
          height: fillersHeight,
          width: fillersWidth,
          backgroundColor: color,
          position: "absolute",
          bottom: notchRadius,
          right: 0,
        }}
      />
      <View
        style={{
          height: fillersWidth,
          width: fillersHeight,
          backgroundColor: color,
          position: "absolute",
          bottom: 0,
          right: notchRadius,
        }}
      />
      <View
        style={{
          height: centerBlockSize,
          width: centerBlockSize,
          backgroundColor: color,
          position: "absolute",
          transform: [
            { translateX: -centerBlockInset },
            { translateY: -centerBlockInset },
            { rotate: "45deg" },
          ],
          bottom: 0,
          right: 0,
        }}
      />
    </View>
  );
};
