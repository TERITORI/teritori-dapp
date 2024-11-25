import React from "react";

import { ChartText } from "./ChartText";

import {
  additionalRed,
  additionalSuccess,
  errorColor,
  neutralA3,
} from "@/utils/style/colors";

export const VoteChartText: React.FC<{
  percentageYes: number;
  percentageNo: number;
  percentageNoWithVeto: number;
  percentageAbstain: number;
}> = ({
  percentageYes,
  percentageNo,
  percentageNoWithVeto,
  percentageAbstain,
}) => {
  const MaxValue = Math.max(
    percentageYes,
    percentageNo,
    percentageNoWithVeto,
    percentageAbstain,
  );

  switch (MaxValue) {
    case percentageYes:
      return (
        <ChartText text={`Yes\n ${MaxValue}%`} textColor={additionalSuccess} />
      );
    case percentageNo:
      return <ChartText text={`No\n ${MaxValue}%`} textColor={errorColor} />;
    case percentageNoWithVeto:
      return (
        <ChartText
          text={`NoWithVeto\n ${MaxValue}%`}
          textColor={additionalRed}
        />
      );
    case percentageAbstain:
      return (
        <ChartText text={`Abstain\n ${MaxValue}%`} textColor={neutralA3} />
      );
    default:
      return <></>;
  }
};
