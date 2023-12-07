import React, { ReactNode } from "react";
import { View, ViewStyle, StyleProp, StyleSheet } from "react-native";

import { neutral11 } from "../../utils/style/colors";

/**
 * @deprecated use SecondaryBox or Box instead
 */
export const LegacySecondaryBox: React.FC<{
  width?: number;
  height?: number;
  fullWidth?: boolean;
  cornerWidth?: number;
  squaresBackgroundColor?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  mainContainerStyle?: StyleProp<ViewStyle>;
  noBrokenCorners?: boolean;
  squaresBorderColor?: string;
  children: ReactNode;
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
  noBrokenCorners,
  squaresBorderColor,
  children,
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
          {/* ---- Content container */}
          <View
            style={[
              width ? { width } : fullWidth ? { width: "100%" } : null,
              height ? { height } : null,
              {
                backgroundColor,
                borderRadius,
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
                style={[
                  {
                    width: cornerWidth,
                    height: 18,
                    left: -0.5,
                    top: -5.5,
                    backgroundColor: squaresBackgroundColor,
                    transform: [{ rotate: "45deg" }],
                    position: "absolute",
                    zIndex: 2,
                  },
                  squaresBorderColor
                    ? {
                        borderColor: squaresBorderColor,
                        borderRightWidth: 1,
                      }
                    : {},
                ]}
              />

              {/* Right bottom broken corner */}
              <View
                style={[
                  {
                    width: cornerWidth,
                    height: 18,
                    right: -0.5,
                    bottom: -5.5,
                    transform: [{ rotate: "225deg" }],
                    backgroundColor: squaresBackgroundColor,
                    position: "absolute",
                    zIndex: 2,
                  },
                  squaresBorderColor
                    ? {
                        borderColor: squaresBorderColor,
                        borderRightWidth: 1,
                      }
                    : {},
                ]}
              />
            </>
          )}
        </View>
      </View>
    </View>
  );
};
