import React from "react";
import { View, TouchableOpacity, ViewStyle } from "react-native";

import { neutral22 } from "../../utils/style/colors";

// A card with solid background color, no border, children.
// backgroundColor neutral22 by default. But can be used to make buttons or cards with personalisation.
export const TertiaryCard: React.FC<{
  width?: number | string;
  height?: number;
  paddingH?: number;
  paddingV?: number;
  borderRadius?: number;
  backgroundColor?: string;
  onPress?: () => void;
  disabled?: boolean;
  squaresBckgColor?: string;
  cornerWidth?: number;
  style?: ViewStyle | ViewStyle[];
}> = ({
  width = "fit-content",
  height = 44,
  children,
  backgroundColor = neutral22,
  borderRadius = 8,
  onPress,
  paddingH = 6,
  paddingV = 6,
  // We need that to correctly set the color under the card
  squaresBckgColor = "#000000",
  // Less or more big "broken" corner
  cornerWidth = 8,
  disabled = false,
  style,
}) => {
  return (
    // Touchable container
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
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
          paddingVertical: paddingV,
          paddingHorizontal: paddingH,
          opacity: disabled ? 0.5 : undefined,
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
          width: cornerWidth,
          height: 20,
          left: 0,
          top: -6,
          backgroundColor: squaresBckgColor,
          transform: [{ rotate: "45deg" }],
          position: "absolute",
          zIndex: 2,
        }}
      />

      {/* Right bottom broken corner */}
      <View
        style={{
          width: cornerWidth,
          height: 20,
          right: 0,
          bottom: -6,
          transform: [{ rotate: "225deg" }],
          backgroundColor: squaresBckgColor,
          position: "absolute",
          zIndex: 2,
        }}
      />
    </TouchableOpacity>
  );
};
