import React from "react";
import { StyleSheet } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { neutralA3 } from "../../../utils/style/colors";
import {
  fontMedium10,
  fontMedium14,
  fontMedium16,
  fontSemibold15,
  fontSemibold20,
  fontSemibold24,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

interface InfoBoxProps {
  title: string;
  content: string;
  width?: number;
  height?: number;
  size?: "SM" | "MD" | "LG" | "XS";
}

export const InfoBox: React.FC<InfoBoxProps> = ({
  title,
  content,
  width,
  height,
  size,
}) => {
  let titleFont;
  let contentFont;

  switch (size) {
    case "XS":
      titleFont = fontMedium10;
      contentFont = fontMedium10;
      break;
    case "SM":
      titleFont = fontMedium10;
      contentFont = fontSemibold15;
      break;
    case "LG":
      titleFont = fontMedium16;
      contentFont = fontSemibold24;
      break;
    case "MD":
    default:
      titleFont = fontMedium14;
      contentFont = fontSemibold20;
  }

  return (
    <TertiaryBox
      width={width}
      height={height}
      style={styles.container}
      noBrokenCorners
      mainContainerStyle={{
        padding: layout.padding_x1_5,
        alignItems: "flex-start",
      }}
    >
      <BrandText style={[titleFont, { color: neutralA3 }]}>{title}</BrandText>
      <BrandText style={[contentFont, { marginTop: 5 }]}>{content}</BrandText>
    </TertiaryBox>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    marginHorizontal: layout.padding_x1,
  },
  title: {
    color: neutralA3,
    ...(fontMedium14 as object),
  },
  content: {
    marginTop: layout.padding_x0_5,
    ...(fontSemibold20 as object),
  },
});
