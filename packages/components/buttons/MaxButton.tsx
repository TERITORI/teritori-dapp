// libraries
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
  // returns
  return (
    <Pressable onPress={onPress}>
      <BrandText style={styles.maxText}>max</BrandText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  maxText: {
    ...StyleSheet.flatten(fontSemibold12),
    backgroundColor: primaryColor,
    color: neutral22,
    borderRadius: layout.borderRadius,
    paddingHorizontal: layout.padding_x0_5,
  },
});
