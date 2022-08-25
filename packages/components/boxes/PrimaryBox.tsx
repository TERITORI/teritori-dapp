import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { View, TouchableOpacity, ViewStyle } from "react-native";

import { neutral11 } from "../../utils/style/colors";

/*
TODO: Responsive. Can't make dynamic resizing for this box because absolute Main gradient container...
 => Use static sizes with breakdown or dig this issue
*/
export const PrimaryBox: React.FC<{
  width?: number;
  height?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  backgroundColor?: string;
  borderRadius?: number;
  squaresBackgroundColor?: string;
  disabled?: boolean;
  nonPressable?: boolean;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  mainContainerStyle?: ViewStyle | ViewStyle[];
}> = ({
  width,
  height,
  paddingHorizontal,
  paddingVertical,
  backgroundColor = "#000000",
  borderRadius = 8,
  squaresBackgroundColor = "#000000",
  disabled = false,
  nonPressable = false,
  onPress,
  style,
  mainContainerStyle,
  children,
}) => {
  const [boxWidth, setBoxWidth] = useState(undefined);
  const [boxHeight, setBoxHeight] = useState(undefined);

  return (
    // ---- Main container, flex row to fit the horizontal content
    <View
      style={[style, { flexDirection: "row" }]}
      onLayout={({ nativeEvent }) => {
        setBoxHeight(nativeEvent.layout.height);
        setBoxWidth(nativeEvent.layout.width);
      }}
    >
      {/* ---- Sub main container, flex column to fit the vertical content*/}
      <View>
        {/*Touchable container*/}
        <TouchableOpacity
          onPress={onPress}
          disabled={disabled || nonPressable}
          style={{
            width: width ? width : boxWidth,
            height: height ? height : boxHeight,
          }}
        >
          {/* ---- Content container */}
          <View
            style={[
              {
                width: width ? width - 2 : boxWidth - 2,
                height: height ? height - 2 : boxHeight - 2,
                backgroundColor: disabled ? neutral11 : backgroundColor,
                borderRadius,
                zIndex: 1,
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

          {/*Main gradient (background absolute to make fake borders)*/}
          <LinearGradient
            // Be careful with these coordinates (Corresponds to ~125deg)
            // TODO: Find dynamic values depending on the ratio width/height to get a correct gradient angle everytime
            start={{ x: -0.35, y: -1 }}
            end={{ x: 0.35, y: 1 }}
            style={{
              width: width ? width : boxWidth,
              height: height ? height : boxHeight,
              opacity: disabled ? 0.5 : 1,
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
            // Approximate colors for the corners border, no inconvenient visible to naked eyes.
            colors={disabled ? ["#676767", "#666666"] : ["#04B4C4", "#04B3C3"]}
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
            // Approximate colors for the corners border, no inconvenient visible to naked eyes.
            colors={disabled ? ["#B7B7B7", "#bebbbb"] : ["#753097", "#752F97"]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
