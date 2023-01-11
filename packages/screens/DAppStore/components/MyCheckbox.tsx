import Checkbox from "expo-checkbox";
import React from "react";
import { StyleSheet, View } from "react-native";

import { gradientColorBlue, neutral44 } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";

export function MyCheckbox({ isChecked }: { isChecked: boolean }) {
  return (
    <View style={styles.container}>
      <Checkbox
        style={[styles.checkbox]}
        value={isChecked}
        color={isChecked ? gradientColorBlue : neutral44}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: layout.padding_x2,
    marginVertical: layout.padding_x4,
  },
  checkbox: {
    margin: layout.padding_x1,
    width: layout.padding_x2_5,
    height: layout.padding_x2_5,
    borderRadius: 4,
    borderWidth: 1,
  },
});
