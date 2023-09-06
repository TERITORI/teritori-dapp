import React from "react";
import { Image, StyleSheet, View } from "react-native";

import LaunchpadBannerImage from "../../../../assets/banners/launchpad.jpg";
import LogoSimpleSvg from "../../../../assets/icons/logo-simple.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { SpacerColumn } from "../../../components/spacer";
import { useImageResizer } from "../../../hooks/useImageResizer";
import { useMaxResolution } from "../../../hooks/useMaxResolution";
import { fontSemibold28 } from "../../../utils/style/fonts";

export const LaunchpadBanner: React.FC = () => {
  const { width: maxWidth } = useMaxResolution();
  const { height, width } = useImageResizer({
    image: LaunchpadBannerImage,
    maxSize: { width: maxWidth },
  });

  return (
    <View style={styles.container}>
      <Image
        source={LaunchpadBannerImage}
        style={{ width, height, resizeMode: "contain" }}
      />
      <View style={styles.detailContainer}>
        <SVG source={LogoSimpleSvg} width={88} height={88} />
        <SpacerColumn size={1} />
        <BrandText style={fontSemibold28}>Launchpad Submission Form</BrandText>
      </View>
    </View>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  detailContainer: {
    position: "absolute",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
