import Lottie from "lottie-react-native";
import React, { memo } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

export const AnimatedLoader: React.FC<{
  size?: number;
  style?: StyleProp<ViewStyle>;
}> = memo(({ size: sizeProp, style }) => {
  const size = sizeProp || 80;
  return (
    <View
      style={[
        {
          height: size,
          width: size,
          borderRadius: size / 2,
          margin: "auto",
        },
        style,
      ]}
    >
      <Lottie source={require("./animation-full-screen.json")} autoPlay loop />
    </View>
  );
});
