import React from "react";
import { Image, StyleSheet, View } from "react-native";

import addSVG from "../../../../assets/icons/add.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { neutral22, neutral33, neutralA3 } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

interface ImagePreviewerProps {
  uri?: string;
}

export const ImagePreviewer: React.FC<ImagePreviewerProps> = ({ uri }) => {
  return (
    <View>
      <View style={styles.imagePreviewer}>
        {uri ? (
          <Image source={{ uri }} style={styles.image} />
        ) : (
          <SVG source={addSVG} height={32} width={32} />
        )}
      </View>

      <BrandText style={styles.text}>Preview</BrandText>
    </View>
  );
};

const styles = StyleSheet.create({
  imagePreviewer: {
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
  image: {
    height: 140,
    width: 140,
    borderRadius: 12,
  },
  text: StyleSheet.flatten([
    fontSemibold14,
    { color: neutralA3, textAlign: "center" },
  ]),
});
