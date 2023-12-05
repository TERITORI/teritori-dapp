import { isEqual } from "lodash";
import { ReactNode, memo } from "react";
import {
  ViewStyle,
  StyleProp,
  View,
  ColorValue,
  StyleSheet,
} from "react-native";

import { useTheme } from "../../hooks/useTheme";

// Be very careful while editing this, try to refrain from adding new props

export type BoxStyle = Pick<
  ViewStyle,
  | "width"
  | "height"
  | "backgroundColor"
  | "borderColor"
  | "borderWidth"
  | "margin"
  | "marginBottom"
  | "marginEnd"
  | "marginLeft"
  | "marginRight"
  | "marginHorizontal"
  | "marginStart"
  | "marginTop"
  | "marginVertical"
  | "flex"
  | "padding"
  | "paddingBottom"
  | "paddingEnd"
  | "paddingHorizontal"
  | "paddingLeft"
  | "paddingRight"
  | "paddingStart"
  | "paddingTop"
  | "paddingVertical"
  | "flexDirection"
  | "alignItems"
  | "justifyContent"
  | "minWidth"
  | "maxWidth"
  | "minHeight"
  | "maxHeight"
  | "alignSelf"
> & { borderRadius?: number };

const defaultBorderRadius = 8;

export const Box: React.FC<{
  style: StyleProp<BoxStyle>;
  children?: ReactNode;
  notched?: boolean;
}> = ({ style, children, notched }) => {
  const theme = useTheme();
  const defaultStyle = { backgroundColor: theme.backgroundColor };
  if (notched) {
    return <NotchedBox style={[defaultStyle, style]}>{children}</NotchedBox>;
  }
  return (
    <View style={[defaultStyle, { borderRadius: defaultBorderRadius }, style]}>
      {children}
    </View>
  );
};

const NotchedBox: React.FC<{
  style: StyleProp<BoxStyle>;
  children?: ReactNode;
}> = ({ style, children }) => {
  const flatStyle = StyleSheet.flatten(style);
  const {
    borderColor,
    backgroundColor,
    borderWidth: maybeBorderWidth,
    width,
    height,
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
    flex,
    borderRadius: maybeBorderRadius,
    alignSelf,
    ...styleRest
  } = flatStyle;
  const borderWidth = maybeBorderWidth || 0;
  const borderRadius = maybeBorderRadius || defaultBorderRadius;
  const notchSize = borderRadius + 4;
  return (
    <View
      style={{
        width,
        height,
        margin,
        marginBottom,
        marginEnd,
        marginHorizontal,
        marginLeft,
        marginRight,
        marginStart,
        marginTop,
        marginVertical,
        minHeight,
        maxHeight,
        minWidth,
        maxWidth,
        flex,
        alignSelf,
      }}
    >
      {borderWidth > 0 && (
        <NotchedRectangle
          color={borderColor}
          style={{ height: "100%", width: "100%", position: "absolute" }}
          borderRadius={borderRadius}
          notchSize={notchSize}
        />
      )}
      <NotchedRectangle
        color={backgroundColor}
        style={{
          position: "absolute",
          left: borderWidth || 0,
          right: borderWidth || 0,
          top: borderWidth || 0,
          bottom: borderWidth || 0,
        }}
        borderRadius={borderRadius - borderWidth}
        notchSize={notchSize - borderWidth / 2}
      />
      <View
        style={[
          {
            height: "100%",
            width: "100%",
            // we need to add the border width here to respect the DOM box model
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

const NotchedRectangle: React.FC<{
  style: StyleProp<ViewStyle>;
  color: ColorValue | undefined;
  borderRadius: number;
  notchSize: number;
}> = memo(
  ({ style, color, borderRadius, notchSize }) => (
    <View style={style}>
      <View style={{ width: "100%", flexDirection: "row" }}>
        <View
          style={{
            height: notchSize,
            borderLeftWidth: notchSize,
            borderLeftColor: "transparent",
            borderStyle: "solid",
            borderBottomWidth: notchSize,
            borderBottomColor: color,
            width: "50%",
          }}
        />
        <View
          style={{
            height: notchSize,
            borderTopRightRadius: borderRadius,
            backgroundColor: color,
            width: "50%",
          }}
        />
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          width: "100%",
          backgroundColor: color,
        }}
      />
      <View style={{ width: "100%", flexDirection: "row" }}>
        <View
          style={{
            height: notchSize,
            borderBottomLeftRadius: borderRadius,
            backgroundColor: color,
            width: "50%",
          }}
        />
        <View
          style={{
            height: notchSize,
            borderRightWidth: notchSize,
            borderRightColor: "transparent",
            borderStyle: "solid",
            borderTopWidth: notchSize,
            borderTopColor: color,
            width: "50%",
          }}
        />
      </View>
    </View>
  ),
  isEqual,
);
