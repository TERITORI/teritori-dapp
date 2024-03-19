import React from "react";

import { BrandText } from "@/components/BrandText";
import { fontSemibold16 } from "@/utils/style/fonts";

export const ChartText: React.FC<{
  textColor: string;
  text: string;
}> = ({ text, textColor }) => {
  return (
    <BrandText
      style={[
        fontSemibold16,
        {
          color: textColor,
          height: 148,
          width: 148,
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          textAlign: "center",
        },
      ]}
    >
      {text}
    </BrandText>
  );
};
