import React from "react";
import { View, TouchableOpacity, ViewStyle } from "react-native";

import { neutral11 } from "../../utils/style/colors";

export const SecondaryBox: React.FC<{
  width?: number;
  height?: number;
  fullWidth?: boolean;
  paddingHorizontal?: number;
  paddingVertical?: number;
  backgroundColor?: string;
  borderRadius?: number;
  cornerWidth?: number;
  squaresBackgroundColor?: string;
  disabled?: boolean;
  nonPressable?: boolean;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  mainContainerStyle?: ViewStyle | ViewStyle[];
}> = ({
  width,
  height,
  fullWidth = false,
  paddingHorizontal,
  paddingVertical,
  backgroundColor = "#000000",
  borderRadius = 8,
  // Less or more big "broken" corner (Example on SocialButton)
  cornerWidth = 8,
  // We need that to correctly set the color under the card
  squaresBackgroundColor = "#000000",
  disabled = false,
  nonPressable = false,
  style,
  mainContainerStyle,
  onPress,
  children,
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
          }}
        >
          {/* ---- Content container */}
          <View
            style={[
              {
                width: fullWidth ? "100%" : width,
                height,
                backgroundColor: disabled ? neutral11 : backgroundColor,
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
              width: cornerWidth,
              height: 18,
              left: -0.5,
              top: -5.5,
              backgroundColor: squaresBackgroundColor,
              transform: [{ rotate: "45deg" }],
              position: "absolute",
              zIndex: 2,
            }}
          />

          {/* Right bottom broken corner */}
          <View
            style={{
              width: cornerWidth,
              height: 18,
              right: -0.5,
              bottom: -5.5,
              transform: [{ rotate: "225deg" }],
              backgroundColor: squaresBackgroundColor,
              position: "absolute",
              zIndex: 2,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
