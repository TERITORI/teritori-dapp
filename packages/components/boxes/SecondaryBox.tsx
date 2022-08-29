import React from "react";
import { View, ViewStyle, StyleProp } from "react-native";

import { neutral11 } from "../../utils/style/colors";

export const SecondaryBox: React.FC<{
  width?: number;
  height?: number;
  fullWidth?: boolean;
  cornerWidth?: number;
  squaresBackgroundColor?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  mainContainerStyle?: StyleProp<any>;
}> = ({
  width,
  height,
  fullWidth = false,
  // Less or more big "broken" corner (Example on SocialButton)
  cornerWidth = 8,
  // We need that to correctly set the color under the card
  squaresBackgroundColor = "#000000",
  disabled = false,
  style,
  mainContainerStyle,
  children,
}) => {
  const {
    paddingVertical,
    paddingHorizontal,
    borderRadius = 8,
    backgroundColor = "#000000",
  } = mainContainerStyle;

  return (
    // ---- Main container, flex row to fit the horizontal content
    <View
      style={[{ flexDirection: "row" }, fullWidth && { width: "100%" }, style]}
    >
      {/* ---- Sub main container, flex column to fit the vertical content*/}
      <View style={fullWidth && { width: "100%" }}>
        {/*---- Content wrapper*/}
        <View
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
        </View>
      </View>
    </View>
  );
};
