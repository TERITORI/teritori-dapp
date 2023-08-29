import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, ViewStyle, StyleProp, StyleSheet } from "react-native";

import { neutral11, neutral67 } from "../../utils/style/colors";

export const PrimaryBox: React.FC<{
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
    <View style={[styles.mainContainer, fullWidth && styles.fullWidth, style]}>
      <View style={fullWidth && styles.fullWidthSubContainer}>
        <View style={styles.fullWidth}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0.7, 0.8]}
            style={[styles.gradient]}
            colors={
              disabled
                ? [neutral67, "#B7B7B7"]
                : colors
                ? colors
                : ["#01B7C5", "#782C96"]
            }
          >
            <View
              style={[
                styles.contentContainer,
                { backgroundColor, borderRadius },
                mainContainerStyle,
              ]}
            >
              {children}
            </View>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
  },
  fullWidth: {
    width: "100%",
  },
  fullWidthSubContainer: {
    width: "100%",
  },
  gradient: {
    "--edge-size": "0.8em",
    padding: 1,
    clipPath:
      "polygon( var(--edge-size) 0%, 100% 0, 100% calc(100% - var(--edge-size)), calc(100% - var(--edge-size)) 100%, 0 100%, 0% var(--edge-size)\n  )",
    borderRadius: 8,
  },
  contentContainer: {
    "--edge-size": "0.8em",
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
    clipPath:
      "polygon( var(--edge-size) 0%, 100% 0, 100% calc(100% - var(--edge-size)), calc(100% - var(--edge-size)) 100%, 0 100%, 0% var(--edge-size)\n  )",
    borderRadius: 8,
  },
});
