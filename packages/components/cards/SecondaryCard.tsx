import React from "react";
import { View, TouchableOpacity, ViewStyle } from "react-native";

import { neutral33 } from "../../utils/style/colors";

export const SecondaryCard: React.FC<{
  width?: number | string;
  height?: number;
  paddingH?: number;
  paddingV?: number;
  borderRadius?: number;
  backgroundColor?: string;
  borderColor?: string;
  onPress?: () => void;
  disabled?: boolean;
  squaresBckgColor?: string;
  style?: ViewStyle | ViewStyle[];
}> = ({
  width = "fit-content",
  height = 100,
  children,
  backgroundColor = "#000000",
  borderColor = neutral33,
  borderRadius = 8,
  onPress,
  paddingH = 16,
  paddingV = 16,
  squaresBckgColor = "#000000",
  style,
}) => {
  return (
    // Touchable container
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          width,
          height,
        },
        style,
      ]}
    >
      {/*Main container */}
      <View
        style={{
          width,
          height: height - paddingV * 2,
          backgroundColor,
          borderRadius,
          borderColor,
          borderWidth: 1,
          paddingVertical: paddingV,
          paddingHorizontal: paddingH,
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <>{children}</>
      </View>

      {/* Left top broken corner */}
      <View
        style={{
          width: 20,
          height: 20,
          left: -9,
          top: -9,
          backgroundColor: squaresBckgColor,
          transform: [{ rotate: "45deg" }],
          position: "absolute",
          borderRightColor: borderColor,
          borderRightWidth: 1,
          zIndex: 2,
        }}
      />

      {/* Right bottom broken corner */}
      <View
        style={{
          width: 20,
          height: 20,
          right: -9,
          bottom: -9,
          transform: [{ rotate: "225deg" }],
          backgroundColor: squaresBckgColor,
          position: "absolute",
          borderRightColor: borderColor,
          borderRightWidth: 1,
          zIndex: 2,
        }}
      />
    </TouchableOpacity>
  );
};
