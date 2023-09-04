import React from "react";
import { ViewStyle } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { neutral77 } from "../../../utils/style/colors";
import { fontMedium10, fontMedium13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const GrantTag: React.FC<{
  text: string;
  containerStyle?: ViewStyle;
  size?: "SM" | "M";
}> = ({ text, containerStyle, size = "M" }) => {
  let marginVertical, marginHorizontal, font;
  switch (size) {
    case "SM":
      marginHorizontal = layout.spacing_x1;
      marginVertical = layout.spacing_x0_5;
      font = fontMedium10;
      break;
    case "M":
    default:
      marginHorizontal = layout.spacing_x2;
      marginVertical = layout.spacing_x1;
      font = fontMedium13;
      break;
  }

  return (
    <TertiaryBox style={containerStyle} noBrokenCorners>
      <BrandText
        style={[
          font,
          {
            color: neutral77,
            marginHorizontal,
            marginVertical,
          },
        ]}
      >
        {text}
      </BrandText>
    </TertiaryBox>
  );
};
