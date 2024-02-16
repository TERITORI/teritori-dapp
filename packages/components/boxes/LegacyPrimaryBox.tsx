import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import { View, ViewStyle, StyleProp, StyleSheet } from "react-native";

import { neutral11, neutral67 } from "../../utils/style/colors";

/**
 * @deprecated use PrimaryBox or Box instead
 */
export const LegacyPrimaryBox: React.FC<{
  width?: number;
  height?: number;
  fullWidth?: boolean;
  squaresBackgroundColor?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  mainContainerStyle?: StyleProp<ViewStyle>;
  noBrokenCorners?: boolean;
  colors?: string[];
  noRightBrokenBorder?: boolean;
  children: ReactNode;
}> = ({
  width,
  height,
  fullWidth = false,
  squaresBackgroundColor = "#000000",
  disabled = false,
  style,
  mainContainerStyle,
  children,
  colors,
  noBrokenCorners,
  noRightBrokenBorder,
}) => {
  const flatMainContainerStyle = mainContainerStyle
    ? StyleSheet.flatten(mainContainerStyle)
    : {};
  const borderRadius = flatMainContainerStyle.borderRadius || 8;
  const backgroundColor = disabled
    ? neutral11
    : flatMainContainerStyle.backgroundColor || "#000000";

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
          {/*Main gradient*/}
          <LinearGradient
            // Be careful with these coordinates
            // TODO: Find dynamic values depending on the ratio width/height to get a correct gradient angle everytime
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0.7, 0.8]}
            style={[
              height ? { height } : null,
              width ? { width } : fullWidth ? { width: "100%" } : null,
              {
                opacity: disabled ? 0.5 : 1,
                borderRadius,
                padding: 1,
              },
            ]}
            colors={
              disabled
                ? [neutral67, "#B7B7B7"]
                : colors
                  ? colors
                  : ["#01B7C5", "#782C96"]
            }
          >
            {/* ---- Content container */}
            <View
              style={[
                height ? { height: height - 2 } : null,
                width
                  ? { width: width - 2 }
                  : fullWidth
                    ? { width: "100%" }
                    : null,
                {
                  backgroundColor,
                  borderRadius,
                  zIndex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                },
                mainContainerStyle,
              ]}
            >
              <>{children}</>
            </View>

            {!noBrokenCorners && (
              <>
                {/* Left top broken corner */}
                <View
                  style={{
                    width: 8,
                    height: 20,
                    left: -1,
                    top: -7,
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
                    left: 0,
                    top: -4.5,
                    backgroundColor: squaresBackgroundColor,
                    opacity: disabled ? 0.5 : 1,
                    transform: [{ rotate: "45deg" }],
                    position: "absolute",
                    zIndex: 2,
                  }}
                  // Approximate colors for the corners border, no inconvenient visible to naked eyes.
                  colors={
                    disabled
                      ? [neutral67, "#666666"]
                      : colors
                        ? [colors[0], colors[0]]
                        : ["#04B4C4", "#04B3C3"]
                  }
                />

                {/*Right bottom broken corner */}
                {!noRightBrokenBorder && (
                  <>
                    <View
                      style={{
                        width: 8,
                        height: 20,
                        right: -1,
                        bottom: -7,
                        transform: [{ rotate: "225deg" }],
                        backgroundColor: squaresBackgroundColor,
                        position: "absolute",
                        zIndex: 3,
                      }}
                    />

                    {/* Right bottom gradient (Be careful with the coordinates and the colors)*/}
                    <LinearGradient
                      start={{ x: -1, y: 0 }}
                      end={{ x: 1, y: -1 }}
                      style={{
                        width: 8,
                        height: 17,
                        right: 0,
                        bottom: -4.5,
                        backgroundColor: squaresBackgroundColor,
                        opacity: disabled ? 0.5 : 1,
                        transform: [{ rotate: "45deg" }],
                        position: "absolute",
                        zIndex: 2,
                      }}
                      // Approximate colors for the corners border, no inconvenient visible to naked eyes.
                      colors={
                        disabled
                          ? ["#B7B7B7", "#bebbbb"]
                          : colors
                            ? [
                                colors[colors.length - 1],
                                colors[colors.length - 1],
                              ]
                            : ["#7c31a0", "#7c2fa2"]
                      }
                    />
                  </>
                )}
              </>
            )}
          </LinearGradient>
        </View>
      </View>
    </View>
  );
};
