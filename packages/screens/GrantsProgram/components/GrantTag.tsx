import React from "react";
import { ViewStyle } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { neutral77 } from "../../../utils/style/colors";
import { fontMedium10 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const GrantTag: React.FC<{
  text: string;
  containerStyle?: ViewStyle;
}> = ({ text, containerStyle }) => {
  return (
    <TertiaryBox style={containerStyle} noBrokenCorners>
      <BrandText
        style={[
          fontMedium10,
          {
            color: neutral77,
            marginHorizontal: layout.padding_x1,
            marginVertical: layout.padding_x0_5,
          },
        ]}
      >
        {text}
      </BrandText>
    </TertiaryBox>
  );
};
