import Lottie from "lottie-react-native";
import React from "react";
import { View } from "react-native";

export const AnimatedLoader: React.FC = () => {
  return (
    <View
      style={{
        height: 80,
        width: 80,
        borderRadius: 999,
        margin: "auto",
      }}
    >
      <Lottie source={require("./animation-full-screen.json")} autoPlay loop />
    </View>
  );
};
