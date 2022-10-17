import React from "react";
import { View, ViewStyle, StyleProp, StyleSheet } from "react-native";

import { neutral33, neutral44 } from "../../utils/style/colors";

export const TertiaryBox: React.FC<{
  width?: number;
  height?: number;
  fullWidth?: boolean;
  squaresBackgroundColor?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  mainContainerStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  center?: boolean;
}> = ({
  width,
  height,
  fullWidth = false,
  squaresBackgroundColor = "#000000",
  children,
  disabled = false,
  style,
  mainContainerStyle,
  backgroundColor,
  center = true,
}) => {
  const flatMainContainerStyle = mainContainerStyle
    ? StyleSheet.flatten(mainContainerStyle)
    : {};
  const borderRadius = flatMainContainerStyle.borderRadius || 8;
  const borderColor = disabled
    ? neutral44
    : flatMainContainerStyle.borderColor || neutral33;
  // const backgroundColor = disabled
  //   ? neutral11
  //   : flatMainContainerStyle.backgroundColor || "#000000";

  return (
    // ---- Main container, flex row to fit the horizontal content
    <View
      style={[{ flexDirection: "row" }, fullWidth && { width: "100%" }, style]}
    >
      {/* ---- Sub main container, flex column to fit the vertical content*/}
      <View style={fullWidth && { width: "100%" }}>
        {/*---- Content wrapper*/}
        <View
          style={[
            height ? { height } : null,
            width ? { width } : fullWidth ? { width: "100%" } : null,
          ]}
        >
          {/* ---- Content container */}
          <View
            style={[
              width ? { width } : fullWidth ? { width: "100%" } : null,
              height ? { height } : null,
              {
                backgroundColor,
                borderColor,
                borderWidth: 1,
                borderRadius,
                alignItems: "center",
                justifyContent: center ? "center" : "flex-start",
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
              borderRightColor: borderColor,
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
              borderRightColor: borderColor,
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