import React from "react";
import { View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { neutralA3 } from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "../../../utils/style/fonts";

export const CurrencyAmount: React.FC<{
  amount: number;
  amountUsd: number;
  isApproximate?: boolean;
}> = ({ amount, amountUsd, isApproximate }) => {
  return (
    <View>
      <BrandText
        style={[
          { textAlign: "right" },
          fontSemibold20,
          (!amount || !isApproximate) && { color: neutralA3 },
        ]}
      >
        {isApproximate && "≈ "}
        {!amount ? "0" : parseFloat(amount.toFixed(6)).toString()}
      </BrandText>
      <BrandText
        style={[
          {
            color: neutralA3,
            textAlign: "right",
          },
          fontSemibold14,
        ]}
      >
        {isApproximate && "≈ "} ${parseFloat(amountUsd.toFixed(2).toString())}
      </BrandText>
    </View>
  );
};
