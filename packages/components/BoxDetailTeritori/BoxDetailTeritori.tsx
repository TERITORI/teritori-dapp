import React from "react";

import { neutral77 } from "../../utils/style/colors";
import { fontSemibold12, fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const BoxDetailTeritori: React.FC<{
  title: string;
  descripation: string;
}> = ({ title, descripation }) => {
  return (
    <TertiaryBox
      style={{
        borderRadius: 6,
        padding: layout.spacing_x1_5,
        flex: 1,
      }}
    >
      <BrandText style={[fontSemibold12, { color: neutral77 }]}>
        {title}
      </BrandText>
      <BrandText style={[fontSemibold14, { marginTop: layout.spacing_x0_75 }]}>
        {descripation}
      </BrandText>
    </TertiaryBox>
  );
};
