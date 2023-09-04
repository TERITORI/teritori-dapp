import React from "react";
import { View, ViewStyle } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { useAnimatedGestureHandler } from "react-native-reanimated";
import { clamp } from "react-native-redash";

const CustomSlider: React.FC<{
  style: ViewStyle;
  thumbStyle: ViewStyle;
  width: number;
  height: number;
  widthThumb: number;
  heightThumb: number;
  minimumTrackTintColor: string;
  maximumTrackTintColor: string;
  onValueChange: (value: number) => void;
  value: number;
}> = ({
  style,
  thumbStyle,
  width,
  height,
  widthThumb,
  heightThumb,
  minimumTrackTintColor,
  maximumTrackTintColor,
  onValueChange,
  value,
}) => {
  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.offsetX = value;
    },
    onActive: (event, ctx) => {
      onValueChange(clamp(ctx.offsetX + event.translationX, 0, width));
    },
  });

  return (
    <View style={[style, { width, height }]}>
      <View
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
          left: 0,
          backgroundColor: maximumTrackTintColor,
        }}
      />
      <View
        style={{
          height: "100%",
          width: value,
          position: "absolute",
          left: 0,
          backgroundColor: minimumTrackTintColor,
        }}
      />
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <View
          style={[
            thumbStyle,
            {
              left: value - widthThumb / 2,
              top: -(heightThumb / 2 - height / 2),
              position: "absolute",
              width: widthThumb,
              height: heightThumb,
            },
          ]}
        />
      </PanGestureHandler>
    </View>
  );
};

export default CustomSlider;
