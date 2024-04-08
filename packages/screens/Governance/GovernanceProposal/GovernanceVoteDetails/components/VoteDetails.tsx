import React from "react";
import { View } from "react-native";

import { VoteDetailsText } from "./VoteDetailsText";

import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import { useIsMobile } from "@/hooks/useIsMobile";
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
  const isMobile = useIsMobile();
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          width: 154,
          alignSelf: isMobile ? "center" : "flex-start",
          marginVertical: isMobile ? layout.spacing_x1_25 : 0,
          justifyContent: "center",
          paddingHorizontal: isMobile ? layout.spacing_x1_25 : 0,
        }}
      >
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
            alignSelf: "center",
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
                paddingHorizontal: layout.spacing_x0_5,
                color: secondaryColor,
              },
            ]}
          >
            {`${percentageTotalParticipant}%`}
          </BrandText>
        </View>
        <View style={{ flex: 1 }} />
      </View>
      <SpacerColumn size={1} />
      <View
        style={{
          flexDirection: "row",
          gap: layout.spacing_x2,
          flexWrap: "wrap",
        }}
      >
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
