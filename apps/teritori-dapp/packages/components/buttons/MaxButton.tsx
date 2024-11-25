import React from "react";
import { Pressable, StyleSheet } from "react-native";

import { neutral22, primaryColor } from "../../utils/style/colors";
import { fontSemibold12 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";

type MaxButtonProps = {
  onPress: () => void;
};

export const MaxButton = ({ onPress }: MaxButtonProps) => {
  return (
    <Pressable onPress={onPress}>
      <BrandText style={styles.maxText}>max</BrandText>
    </Pressable>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  maxText: {
    ...StyleSheet.flatten(fontSemibold12),
    backgroundColor: primaryColor,
    color: neutral22,
    borderRadius: layout.borderRadius,
    paddingHorizontal: layout.spacing_x0_5,
  },
});
