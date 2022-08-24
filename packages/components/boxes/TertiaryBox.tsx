import React from "react";
import { View, TouchableOpacity, ViewStyle } from "react-native";

import { neutral11, neutral77 } from "../../utils/style/colors";

/*
backgroundColor custom
borderRadius custom
width custom
height custom
paddingHorizontal custom
paddingVertical custom
squaresBackgroundColor custom
cornerWidth custom
borderColor custom

TODO: disabled
*/
export const TertiaryBox: React.FC<{
  width?: number;
  height?: number;
  paddingHorizontal: number;
  paddingVertical?: number;
  borderRadius: number;
  backgroundColor: string;
  borderColor: string;
  onPress?: () => void;
  disabled?: boolean;
  squaresBackgroundColor?: string;
  style?: ViewStyle | ViewStyle[];
}> = ({
  width,
  height,
  children,
  backgroundColor,
  borderColor,
  borderRadius,
  onPress,
  paddingHorizontal,
  paddingVertical,
  squaresBackgroundColor = "#000000",
  disabled = false,
  style,
}) => {
  return (
    <View style={[style, { flexDirection: "row" }]}>
      {/*Touchable container*/}
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
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
            backgroundColor: disabled ? neutral11 : backgroundColor,
            borderColor: disabled ? neutral77 : borderColor,
            borderWidth: 1,
            borderRadius,
            paddingHorizontal,
            paddingVertical,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
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
            borderRightColor: disabled ? neutral77 : borderColor,
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
            borderRightColor: disabled ? neutral77 : borderColor,
            borderRightWidth: 1,
            position: "absolute",
            zIndex: 2,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};
