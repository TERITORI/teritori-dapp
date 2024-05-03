import React from "react";
import { View } from "react-native";
import { VictoryPie } from "victory-native";

import { VoteChartText } from "./VoteChartText";

import { useIsMobile } from "@/hooks/useIsMobile";
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
  const isMobile = useIsMobile();
  return (
    <>
      <View
        style={{
          width: 148,
          height: 148,
        }}
      >
        {isMobile && (
          <View style={{ flex: 1 }}>
            <VictoryPie
              innerRadius={60}
              colorScale={[
                additionalSuccess,
                errorColor,
                additionalRed,
                neutral55,
              ]}
              data={[
                { x: "Yes", y: percentageYes },
                { x: "No", y: percentageNo },
                { x: "NoWithVeto", y: percentageNoWithVeto },
                { x: "Abstain", y: percentageAbstain },
              ]}
              height={148}
              width={148}
              radius={70}
            />
          </View>
        )}
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
        {!isMobile && (
          <VictoryPie
            innerRadius={60}
            colorScale={[
              additionalSuccess,
              errorColor,
              additionalRed,
              neutral55,
            ]}
            data={[
              { x: "Yes", y: percentageYes },
              { x: "No", y: percentageNo },
              { x: "NoWithVeto", y: percentageNoWithVeto },
              { x: "Abstain", y: percentageAbstain },
            ]}
            radius={70}
            height={148}
            width={148}
          />
        )}
      </View>
    </>
  );
};
