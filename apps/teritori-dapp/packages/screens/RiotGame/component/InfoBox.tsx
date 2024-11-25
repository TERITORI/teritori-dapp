import React from "react";

import { BrandText } from "@/components/BrandText";
import { LegacyTertiaryBox } from "@/components/boxes/LegacyTertiaryBox";
import { neutralA3 } from "@/utils/style/colors";
import {
  fontMedium10,
  fontMedium14,
  fontMedium16,
  fontSemibold15,
  fontSemibold20,
  fontSemibold24,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

interface InfoBoxProps {
  title: string;
  content: string;
  width?: number;
  height?: number;
  size?: "SM" | "MD" | "LG";
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
    <LegacyTertiaryBox
      width={width}
      height={height}
      style={{
        borderRadius: 5,
        marginHorizontal: layout.spacing_x1,
      }}
      noBrokenCorners
      mainContainerStyle={{
        padding: layout.spacing_x1_5,
        alignItems: "flex-start",
      }}
    >
      <BrandText style={[titleFont, { color: neutralA3 }]}>{title}</BrandText>
      <BrandText style={[contentFont, { marginTop: 5 }]}>{content}</BrandText>
    </LegacyTertiaryBox>
  );
};
