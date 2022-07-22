import React from "react";
import { View, ViewStyle } from "react-native";
import { primaryColor } from "../../utils/colors";
import { BrandText } from "../BrandText";
import { LabelCard } from "./LabelCard";

export const BalanceCard: React.FC<{
  label?: string;
  highlighted?: boolean;
  balanceTitle?: string;
  balanceText?: string;
  balanceIcon?: React.ReactNode;
  style?: ViewStyle;
}> = ({
  highlighted,
  label,
  balanceTitle,
  balanceText,
  balanceIcon,
  style,
}) => {
  const balanceTitleFontSize = 14;
  return (
    <View style={[{ alignItems: "center" }, style]}>
      <LabelCard label={label} highlighted={highlighted} />
      <BrandText
        style={{
          fontSize: balanceTitleFontSize,
          letterSpacing: -(balanceTitleFontSize * 0.04),
          marginTop: 16,
          fontWeight: "500",
        }}
      >
        {balanceTitle}
      </BrandText>
      <View style={{ flexDirection: "row", marginTop: 8 }}>
        <>
          {balanceIcon}
          <BrandText style={{ color: primaryColor, fontSize: 14 }}>
            {balanceText}
          </BrandText>
        </>
      </View>
    </View>
  );
};
