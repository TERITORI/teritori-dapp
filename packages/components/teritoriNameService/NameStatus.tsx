import React from "react";

import availableSVG from "../../../assets/icons/available.svg";
import mintedSVG from "../../../assets/icons/minted.svg";
import { errorColor, neutral17, successColor } from "../../utils/style/colors";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";

// A custom TextInput. You can add children (Ex: An icon or a small container)
export const NameStatus: React.FC<{
  available?: boolean;
  hasError?: boolean;
}> = ({ available, hasError }) => {
  return (
    <TertiaryBox
      mainContainerStyle={{
        flexDirection: "row",
        justifyContent: "flex-start",
        paddingHorizontal: 12,
        borderColor: hasError
          ? errorColor
          : available
          ? successColor
          : errorColor,
      }}
      height={48}
      fullWidth
      squaresBackgroundColor={neutral17}
    >
      <SVG
        width={24}
        height={24}
        source={available ? availableSVG : mintedSVG}
      />
      <BrandText style={{ fontSize: 14, marginLeft: 4 }}>
        {hasError ? "error" : available ? "available" : "minted"}
      </BrandText>
    </TertiaryBox>
  );
};
