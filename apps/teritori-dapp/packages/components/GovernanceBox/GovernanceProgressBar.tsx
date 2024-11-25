import React from "react";
import { DimensionValue, View } from "react-native";

import {
  additionalRed,
  additionalSuccess,
  errorColor,
  neutral55,
} from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";
import { FinalTallyResult } from "@/utils/types/gov";

export const GovernanceProgressBar: React.FC<{
  result: FinalTallyResult;
}> = ({ result }) => {
  const percentageYesValue = parseFloat(result.yes);
  const percentageNoWithVetoValue = parseFloat(result.no_with_veto);
  const percentageNoValue = parseFloat(result.no);
  const percentageAbstainValue = parseFloat(result.abstain);

  const totalUsers =
    percentageYesValue +
    percentageNoValue +
    percentageNoWithVetoValue +
    percentageAbstainValue;

  const percentageYes: DimensionValue = `${(percentageYesValue / totalUsers) * 100}%`;
  const percentageNo: DimensionValue = `${(percentageNoValue / totalUsers) * 100}%`;
  const percentageNoWithVeto: DimensionValue = `${(percentageNoWithVetoValue / totalUsers) * 100}%`;
  const percentageAbstain: DimensionValue = `${(percentageAbstainValue / totalUsers) * 100}%`;

  return (
    <>
      <View
        style={{
          height: layout.spacing_x0_5,
          borderRadius: layout.spacing_x0_5,
          flexDirection: "row",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: percentageYes,
            backgroundColor: additionalSuccess,
          }}
        />
        <View
          style={{
            width: percentageNo,
            backgroundColor: errorColor,
          }}
        />
        <View
          style={{
            width: percentageNoWithVeto,
            backgroundColor: additionalRed,
          }}
        />
        <View
          style={{
            width: percentageAbstain,
            backgroundColor: neutral55,
          }}
        />
      </View>
    </>
  );
};
