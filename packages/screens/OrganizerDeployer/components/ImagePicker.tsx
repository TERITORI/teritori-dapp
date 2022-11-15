import React from "react";
import { StyleSheet, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { neutral22, neutral33, neutralA3 } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const ImagePicker = () => {
  return (
    <View>
      <View style={styles.imagePicker} />
      <BrandText style={styles.text}>Set an image</BrandText>
    </View>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    height: 140,
    width: 140,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: neutral33,
    backgroundColor: neutral22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: layout.padding_x1_5,
  },
  text: StyleSheet.flatten([
    fontSemibold14,
    { color: neutralA3, textAlign: "center" },
  ]),
});
