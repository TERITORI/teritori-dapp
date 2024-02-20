import React from "react";
import { DimensionValue, StyleProp, View, ViewStyle } from "react-native";

import {
  additionalRed,
  additionalSuccess,
  errorColor,
  neutral33,
  neutral55,
} from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";
import { FinalTallyResult } from "@/utils/types/gov";

export const GovernanceProgressBar: React.FC<{
  viewStyle?: StyleProp<ViewStyle>;
  result: FinalTallyResult;
}> = ({ viewStyle, result }) => {
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
          alignItems: "center",
          backgroundColor: neutral33,
          borderRadius: layout.spacing_x0_5,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            width: percentageYes,
            height: 4,
            borderRadius: 4,
            left: 0,
            zIndex: 2,
            backgroundColor: additionalSuccess,
          }}
        />
        <View
          style={{
            width: percentageNo,
            height: 4,
            backgroundColor: errorColor,
            zIndex: 2,
          }}
        />
        <View
          style={{
            width: percentageNoWithVeto,
            height: 4,
            borderRadius: 4,
            zIndex: 2,
            backgroundColor: additionalRed,
          }}
        />
        <View
          style={{
            width: percentageAbstain,
            height: 4,
            borderRadius: 4,
            zIndex: 2,
            backgroundColor: neutral55,
          }}
        />
      </View>
    </>
  );
};
