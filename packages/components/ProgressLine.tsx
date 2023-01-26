import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, ViewStyle } from "react-native";
import { Dimensions } from "react-native";

import { neutral33 } from "../utils/style/colors";
import { smallMobileWidth } from "../utils/style/layout";

const DEFAULT_WIDTH = 200;

export interface ProgressLineProps {
  percent: number;
  width?: number;
  style?: ViewStyle;
}

export const ProgressLine: React.FC<ProgressLineProps> = ({
  percent,
  width = DEFAULT_WIDTH,
  style,
}) => {
  const windowWidth = Dimensions.get("window").width;

  return (
    <View
      style={[
        {
          height: 4,
          borderRadius: 4,
          backgroundColor: neutral33,
          width: windowWidth < smallMobileWidth ? "20%" : width,
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
          width:
            windowWidth < smallMobileWidth
              ? `${percent}%`
              : (percent / 100) * width,
          height: 4,
          position: "absolute",
          top: 0,
          left: 0,
          borderRadius: 4,
        }}
      />
    </View>
  );
};
