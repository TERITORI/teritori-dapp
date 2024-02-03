import React from "react";

import { BrandText } from "../../../components/BrandText";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { neutral77 } from "../../../utils/style/colors";
import { fontSemibold12, fontSemibold14 } from "../../../utils/style/fonts";

export const ApplicationCard: React.FC<{
  rowData: { title: string; value: string };
}> = ({ rowData }) => {
  return (
    <TertiaryBox style={{ borderRadius: 6, padding: 12, width: 132 }}>
      <BrandText style={[fontSemibold12, { color: neutral77 }]}>
        {rowData?.title}
      </BrandText>
      <BrandText style={[fontSemibold14, { marginTop: 6 }]}>
        {rowData?.value}
      </BrandText>
    </TertiaryBox>
  );
};
