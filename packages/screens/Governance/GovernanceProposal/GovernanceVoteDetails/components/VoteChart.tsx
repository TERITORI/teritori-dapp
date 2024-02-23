import React from "react";
import { View } from "react-native";
import { VictoryPie } from "victory-native";

import { VoteChartText } from "./VoteChartText";

import {
  additionalRed,
  additionalSuccess,
  errorColor,
  neutral55,
} from "@/utils/style/colors";

export const VoteChart: React.FC<{
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
  return (
    <>
      <View
        style={{
          width: 148,
          height: 148,
        }}
      >
        <View
          style={{
            position: "absolute",
          }}
        >
          <VoteChartText
            percentageYes={percentageYes}
            percentageNo={percentageNo}
            percentageNoWithVeto={percentageNoWithVeto}
            percentageAbstain={percentageAbstain}
          />
        </View>

        <VictoryPie
          innerRadius={700}
          colorScale={[additionalSuccess, errorColor, additionalRed, neutral55]}
          data={[
            { x: "Yes", y: percentageYes },
            { x: "No", y: percentageNo },
            { x: "NoWithVeto", y: percentageNoWithVeto },
            { x: "Abstain", y: percentageAbstain },
          ]}
        />
      </View>
    </>
  );
};
