import React from "react";
import { View } from "react-native";

import { VoteDetailsText } from "./VoteDetailsText";

import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import {
  additionalRed,
  additionalSuccess,
  errorColor,
  neutral17,
  neutral22,
  neutral77,
  neutralA3,
  secondaryColor,
} from "@/utils/style/colors";
import { fontSemibold16 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const VoteDetails: React.FC<{
  percentageTotalParticipant: string;
  percentageYes: number;
  percentageNo: number;
  percentageNoWithVeto: number;
  percentageAbstain: number;
}> = ({
  percentageTotalParticipant,
  percentageYes,
  percentageNo,
  percentageNoWithVeto,
  percentageAbstain,
}) => {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: layout.spacing_x0_5,
          backgroundColor: neutral17,
          borderRadius: layout.spacing_x0_75,
          borderWidth: 1,
          height: 36,
          gap: layout.spacing_x0_25,
          borderColor: neutral22,
          width: 147,
        }}
      >
        <BrandText
          style={[
            fontSemibold16,
            {
              paddingLeft: layout.spacing_x0_5,
              color: neutral77,
            },
          ]}
        >
          Turnout:
        </BrandText>
        <BrandText
          style={[
            fontSemibold16,
            {
              paddingLeft: layout.spacing_x0_5,
              color: secondaryColor,
            },
          ]}
        >
          {`${percentageTotalParticipant}%`}
        </BrandText>
      </View>

      <SpacerColumn size={1} />
      <View style={{ flexDirection: "row", gap: layout.spacing_x2 }}>
        <VoteDetailsText
          title="Yes"
          percentage={percentageYes}
          color={additionalSuccess}
        />

        <VoteDetailsText
          title="No"
          percentage={percentageNo}
          color={errorColor}
        />

        <VoteDetailsText
          title="NoWithVeto"
          percentage={percentageNoWithVeto}
          color={additionalRed}
        />

        <VoteDetailsText
          title="Abstain"
          percentage={percentageAbstain}
          color={neutralA3}
        />
      </View>
    </View>
  );
};
