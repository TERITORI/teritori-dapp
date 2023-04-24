import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import SideNotchSVG from "../../../../assets/sidebar/side-notch.svg";
import { SVG } from "../../SVG";

export const SideNotch: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  return (
    <View style={[styles.container, style]}>
      <SVG source={SideNotchSVG} />
    </View>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 18,
  },
});
