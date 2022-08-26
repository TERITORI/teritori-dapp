import React from "react";
import { View, TouchableOpacity, ViewStyle, StyleProp } from "react-native";

import { neutral11, neutral33, neutral44 } from "../../utils/style/colors";

export const TertiaryBox: React.FC<{
  width?: number;
  height?: number;
  fullWidth?: boolean;
  paddingHorizontal?: number;
  paddingVertical?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: number;
  squaresBackgroundColor?: string;
  disabled?: boolean;
  nonPressable?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  mainContainerStyle?: StyleProp<ViewStyle>;
}> = ({
  width,
  height,
  fullWidth = false,
  paddingHorizontal,
  paddingVertical,
  backgroundColor = "#000000",
  borderColor = neutral33,
  borderRadius = 8,
  squaresBackgroundColor = "#000000",
  children,
  disabled = false,
  nonPressable = false,
  onPress,
  style,
  mainContainerStyle,
}) => {
  return (
    // ---- Main container, flex row to fit the horizontal content
    <View
      style={[style, { flexDirection: "row" }, fullWidth && { width: "100%" }]}
    >
      {/* ---- Sub main container, flex column to fit the vertical content*/}
      <View style={fullWidth && { width: "100%" }}>
        {/*Touchable container*/}
        <TouchableOpacity
          onPress={onPress}
          disabled={disabled || nonPressable}
          style={{
            width: fullWidth ? "100%" : width,
            height,
            flexDirection: "column",
          }}
        >
          {/* ---- Content container */}
          <View
            style={[
              {
                width: fullWidth ? "100%" : width,
                height,
                backgroundColor: disabled ? neutral11 : backgroundColor,
                borderColor: disabled ? neutral44 : borderColor,
                borderWidth: 1,
                borderRadius,
                paddingHorizontal,
                paddingVertical,
                alignItems: "center",
                justifyContent: "center",
              },
              mainContainerStyle,
            ]}
          >
            <>{children}</>
          </View>

          {/* Left top broken corner */}
          <View
            style={{
              width: 8,
              height: 18,
              left: 0,
              top: -5,
              backgroundColor: squaresBackgroundColor,
              borderRightColor: disabled ? neutral44 : borderColor,
              borderRightWidth: 1,
              transform: [{ rotate: "45deg" }],
              position: "absolute",
              zIndex: 2,
            }}
          />

          {/* Right bottom broken corner */}
          <View
            style={{
              width: 8,
              height: 18,
              right: 0,
              bottom: -5,
              transform: [{ rotate: "225deg" }],
              backgroundColor: squaresBackgroundColor,
              borderRightColor: disabled ? neutral44 : borderColor,
              borderRightWidth: 1,
              position: "absolute",
              zIndex: 2,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
