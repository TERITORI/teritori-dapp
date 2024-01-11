import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, View, ViewStyle } from "react-native";

import { neutral33 } from "../../../utils/style/colors";

const DEFAULT_WIDTH = Dimensions.get("window").width;

interface ProgressLineProps {
  percent: number;
  width?: number;
  style?: ViewStyle;
}

export const ProgressLine2: React.FC<ProgressLineProps> = ({
  percent,
  width = DEFAULT_WIDTH,
  style,
}) => {
  return (
    <View
      style={[
        {
          height: 4,
          borderRadius: 4,
          backgroundColor: neutral33,
          width,
          position: "relative",
        },
        style,
      ]}
    >
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.33, 0.66, 1]}
        colors={["#202B37", "#29507A", "#4692E5", "#05d5fa"]}
        style={{
          width: (percent / 100) * width,
          height: 6,
          position: "absolute",
          top: 0,
          left: 0,
          borderRadius: 32,
        }}
      />
    </View>
  );
};
