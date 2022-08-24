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
cornerWidth custom

no border

TODO: disabled
*/
export const SecondaryBox: React.FC<{
  width?: number;
  height?: number;
  paddingHorizontal: number;
  paddingVertical?: number;
  borderRadius: number;
  backgroundColor: string;
  onPress?: () => void;
  disabled?: boolean;
  squaresBackgroundColor?: string;
  cornerWidth?: number;
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
  // We need that to correctly set the color under the card
  squaresBackgroundColor = "#000000",
  // Less or more big "broken" corner (Example on SocialButton)
  cornerWidth = 8,
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
  );
};
