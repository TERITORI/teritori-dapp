import { LinearGradient } from "expo-linear-gradient";
import { FC, memo } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { neutral33 } from "../utils/style/colors";

/**
 * @param gain - The gain of the progress line. Must be between 0 and 1 inclusive.
 * @param style - The style of the container View.
 */
export const ProgressLine: FC<{
  gain: number;
  style?: StyleProp<ViewStyle>;
}> = memo(({ gain, style }) => {
  if (gain < 0) {
    gain = 0;
  }
  if (gain > 1) {
    gain = 1;
  }
  return (
    <View
      style={[
        {
          height: 4,
          borderRadius: 4,
          backgroundColor: neutral33,
          flexGrow: 1,
          position: "relative",
        },
        style,
      ]}
    >
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.5, 1]}
        colors={["#5433FF", "#20BDFF", "#A5FECB"]}
        style={{
          width: `${gain * 100}%`,
          height: 4,
          position: "absolute",
          top: 0,
          left: 0,
          borderRadius: 4,
        }}
      />
    </View>
  );
});
