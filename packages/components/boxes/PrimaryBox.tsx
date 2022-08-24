import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, TouchableOpacity, ViewStyle } from "react-native";

import { neutral11 } from "../../utils/style/colors";

/*
backgroundColor custom
borderRadius custom
width custom
height custom
paddingHorizontal custom
paddingVertical custom
squaresBackgroundColor custom

gradient borders

TODO: disabled
*/
export const PrimaryBox: React.FC<{
  width: number;
  height?: number;
  paddingHorizontal: number;
  paddingVertical?: number;
  borderRadius: number;
  backgroundColor: string;
  onPress?: () => void;
  disabled?: boolean;
  squaresBackgroundColor?: string;
  style?: ViewStyle | ViewStyle[];
}> = ({
  width,
  height,
  children,
  backgroundColor,
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
            width: width - 2,
            height: height - 2,
            backgroundColor: disabled ? neutral11 : backgroundColor,
            borderRadius,
            zIndex: 1,
            paddingHorizontal,
            paddingVertical,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <>{children}</>
        </View>

        {/*Main gradient (background absolute to make fake borders)*/}
        <LinearGradient
          // Be careful with these coordinates (Corresponds to ~125deg)
          start={{ x: -0.35, y: -1 }}
          end={{ x: 0.35, y: 1 }}
          style={{
            width,
            opacity: disabled ? 0.5 : 1,
            height,
            borderRadius,
            position: "absolute",
            top: -1,
            left: -1,
          }}
          colors={disabled ? ["#676767", "#B7B7B7"] : ["#01B7C5", "#782C96"]}
        />

        {/* Left top broken corner */}
        <View
          style={{
            width: 8,
            height: 20,
            left: -1.5,
            top: -8,
            backgroundColor: squaresBackgroundColor,
            transform: [{ rotate: "45deg" }],
            position: "absolute",
            zIndex: 3,
          }}
        />

        {/* Left top gradient (Be careful with the coordinates and the colors)*/}
        <LinearGradient
          start={{ x: -1, y: 0 }}
          end={{ x: 1, y: -1 }}
          style={{
            width: 8,
            height: 17,
            left: -1,
            top: -5.5,
            backgroundColor: squaresBackgroundColor,
            opacity: disabled ? 0.5 : 1,
            transform: [{ rotate: "45deg" }],
            position: "absolute",
            zIndex: 2,
          }}
          colors={disabled ? ["#676767", "#676666"] : ["#04B4C4", "#04B3C3"]}
        />

        {/* Right bottom broken corner */}
        <View
          style={{
            width: 8,
            height: 20,
            right: 0.5,
            bottom: -6,
            transform: [{ rotate: "225deg" }],
            backgroundColor: squaresBackgroundColor,
            position: "absolute",
            zIndex: 3,
          }}
        />

        {/* Right bottom gradient (Be careful with the coordinates and the colors) */}
        <LinearGradient
          start={{ x: -1, y: 0 }}
          end={{ x: 1, y: -1 }}
          style={{
            width: 8,
            height: 17,
            right: 1,
            bottom: -3.5,
            backgroundColor: squaresBackgroundColor,
            opacity: disabled ? 0.5 : 1,
            transform: [{ rotate: "45deg" }],
            position: "absolute",
            zIndex: 2,
          }}
          colors={disabled ? ["#B7B7B7", "#bebbbb"] : ["#753097", "#752F97"]}
        />
      </TouchableOpacity>
    </View>
  );
};
