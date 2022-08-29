import React from "react";
import { View, ViewStyle, StyleProp } from "react-native";

import { neutral11, neutral33, neutral44 } from "../../utils/style/colors";

export const TertiaryBox: React.FC<{
  width?: number;
  height?: number;
  fullWidth?: boolean;
  squaresBackgroundColor?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  mainContainerStyle?: StyleProp<any>;
}> = ({
  width,
  height,
  fullWidth = false,
  squaresBackgroundColor = "#000000",
  children,
  disabled = false,
  style,
  mainContainerStyle,
}) => {
  const {
    paddingVertical,
    paddingHorizontal,
    borderRadius = 8,
    borderColor = neutral33,
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
        </View>
      </View>
    </View>
  );
};
