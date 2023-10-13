import React from "react";
import { TextStyle } from "react-native";
import { CreditCardIcon } from "react-native-heroicons/outline";

import { primaryColor } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { OmniLink } from "../OmniLink";

export const BuyTokens: React.FC<{
  flexDirection: "row" | "column";
  textStyle: TextStyle;
}> = ({ flexDirection, textStyle }) => {
  return (
    <OmniLink
      to={{
        screen: "Swap",
      }}
      style={{
        justifyContent: "center",
        alignItems: "center",
        marginBottom: layout.spacing_x1,
        flexDirection,
      }}
    >
      <CreditCardIcon
        color={primaryColor}
        style={{ marginRight: flexDirection === "row" ? layout.spacing_x1 : 0 }}
      />
      <BrandText style={textStyle}>Buy TORI</BrandText>
    </OmniLink>
  );
};
