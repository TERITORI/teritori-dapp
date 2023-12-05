import React from "react";
import { StyleSheet, View } from "react-native";

import LaunchpadBannerImage from "../../../../assets/banners/launchpad.jpg";
import LogoSimpleSvg from "../../../../assets/icons/logo-simple.svg";
import { BrandText } from "../../../components/BrandText";
import { OptimizedImage } from "../../../components/OptimizedImage";
import { SVG } from "../../../components/SVG";
import { SpacerColumn } from "../../../components/spacer";
import { useMaxResolution } from "../../../hooks/useMaxResolution";
import { fontSemibold28 } from "../../../utils/style/fonts";

export const LaunchpadBanner: React.FC = () => {
  const { width } = useMaxResolution();

  return (
    <View style={styles.container}>
      <OptimizedImage
        sourceURI={LaunchpadBannerImage}
        width={width}
        height={width / 2.5}
        style={{ width, height: width / 2.5, resizeMode: "contain" }}
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
