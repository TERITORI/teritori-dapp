import React from "react";

import { neutral77 } from "../../utils/style/colors";
import { BrandText } from "../BrandText";

interface HelperTextProps {
  text: string;
}

export const HelperText: React.FC<HelperTextProps> = ({ text }) => {
  return (
    <BrandText
      style={{
        color: neutral77,
        fontSize: 12,
        marginTop: 20,
      }}
    >
      {text}
    </BrandText>
  );
};
