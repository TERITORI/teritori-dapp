import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import { ReactNode } from "react";
import { StyleProp, View, ViewStyle, StyleSheet } from "react-native";

// Be very careful while editing this, try to refrain from adding new props

export type GradientBoxStyle = Pick<
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
> & { borderRadius?: number; backgroundColor?: string };

export const GradientBox: React.FC<{
  children: ReactNode;
  borderProps: LinearGradientProps;
  fillProps: LinearGradientProps;
  style?: StyleProp<GradientBoxStyle>;
}> = ({ children, borderProps, fillProps, style }) => {
  const flatStyle = StyleSheet.flatten(style);
  const {
    margin,
    width,
    height,
    borderWidth: maybeBorderWidth,
    borderRadius,
    backgroundColor,
    marginBottom,
    marginEnd,
    marginHorizontal,
    marginLeft,
    marginRight,
    marginStart,
    marginTop,
    marginVertical,
    ...styleRest
  } = flatStyle;
  const borderWidth = maybeBorderWidth || 0;
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
        width,
        height,
      }}
    >
      {borderWidth > 0 && (
        <LinearGradient
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            borderRadius,
          }}
          {...borderProps}
        />
      )}
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
