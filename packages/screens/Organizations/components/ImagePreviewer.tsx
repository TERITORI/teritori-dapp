import React from "react";
import { Image, StyleSheet, View } from "react-native";

import dorgSVG from "../../../../assets/icons/dorg-icon.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { ipfsURLToHTTPURL } from "../../../utils/ipfs";
import { neutral22, neutral33, neutralA3 } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

interface ImagePreviewerProps {
  uri?: string;
  onError?: () => void;
}

export const ImagePreviewer: React.FC<ImagePreviewerProps> = ({
  uri,
  onError,
}) => {
  return (
    <View>
      <View style={styles.imagePreviewer}>
        {uri ? (
          <Image
            source={{ uri: ipfsURLToHTTPURL(uri) }}
            style={styles.image}
            onError={onError}
          />
        ) : (
          <SVG
            source={dorgSVG}
            height={styles.image.height}
            width={styles.image.width}
          />
        )}
      </View>

      <BrandText style={styles.text}>Preview</BrandText>
    </View>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
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
    marginBottom: layout.spacing_x1_5,
    overflow: "hidden",
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
