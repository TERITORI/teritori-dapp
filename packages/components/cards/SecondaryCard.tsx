import React from "react";
import { View, TouchableOpacity, ViewStyle } from "react-native";

import { neutral33 } from "../../utils/style/colors";

export const SecondaryCard: React.FC<{
  width?: number | string;
  height?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  borderRadius?: number;
  backgroundColor?: string;
  borderColor?: string;
  onPress?: () => void;
  disabled?: boolean;
  squaresBackgroundColor?: string;
  style?: ViewStyle | ViewStyle[];
}> = ({
  width,
  height = 100,
  children,
  backgroundColor = "#000000",
  borderColor = neutral33,
  borderRadius = 8,
  onPress,
  paddingHorizontal = 16,
  paddingVertical = 16,
  squaresBackgroundColor = "#000000",
  style,
}) => {
  return (
    <View style={[style, { flexDirection: "row" }]}>
      {/*Touchable container*/}
      <TouchableOpacity
        onPress={onPress}
        style={{
          width,
          height,
        }}
      >
        {/*Main container */}
        <View
          style={{
            width,
            height,
            backgroundColor,
            borderRadius,
            borderColor,
            borderWidth: 1,
            paddingVertical,
            paddingHorizontal,
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
            backgroundColor: squaresBackgroundColor,
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
            backgroundColor: squaresBackgroundColor,
            position: "absolute",
            borderRightColor: borderColor,
            borderRightWidth: 1,
            zIndex: 2,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};
