import Checkbox from "expo-checkbox";
import React from "react";
import { View } from "react-native";

import { gradientColorBlue, neutral44 } from "../../../utils/style/colors";

export function CheckboxDappStore({
  isChecked,
  styles,
}: {
  isChecked: boolean;
  styles: any;
}) {
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
