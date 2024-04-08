import React, { useState } from "react";
import { View } from "react-native";

import { VoteChart } from "./VoteChart";
import { VoteDetails } from "./VoteDetails";
import { VoteModel } from "./VoteModal";

import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SpacerRow } from "@/components/spacer";
import { useIsMobile } from "@/hooks/useIsMobile";
import { neutral17 } from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";
import { FinalTallyResult } from "@/utils/types/gov";

export const VoteDetailsBox: React.FC<{
  result: FinalTallyResult;
  isVoteEnable: boolean;
}> = ({ result, isVoteEnable }) => {
  const [voteModalVisible, setVoteModalVisible] = useState(false);
  const percentageYesValue = parseFloat(result.yes);
  const percentageNoWithVetoValue = parseFloat(result.no_with_veto);
  const percentageNoValue = parseFloat(result.no);
  const percentageAbstainValue = parseFloat(result.abstain);
  const isMobile = useIsMobile();

  const totalUsers =
    percentageYesValue +
    percentageNoValue +
    percentageNoWithVetoValue +
    percentageAbstainValue;

  const totalParticipant = totalUsers - percentageAbstainValue;

  const percentageTotalParticipant = (
    (totalParticipant / totalUsers) *
    100
  ).toFixed(2);

  const percentageYes = parseFloat(
    ((percentageYesValue / totalUsers) * 100).toFixed(2),
  );
  const percentageNo = parseFloat(
    ((percentageNoValue / totalUsers) * 100).toFixed(2),
  );
  const percentageNoWithVeto = parseFloat(
    ((percentageNoWithVetoValue / totalUsers) * 100).toFixed(2),
  );
  const percentageAbstain = parseFloat(
    ((percentageAbstainValue / totalUsers) * 100).toFixed(2),
  );

  return (
    <>
      <PrimaryBox
        style={{
          borderRadius: layout.spacing_x1_5,
          borderWidth: 0,
          backgroundColor: neutral17,
          width: "98%",
          flex: isMobile ? 0.8 : 0.4,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: layout.spacing_x2,
        }}
      >
        <View
          style={{
            paddingHorizontal: layout.spacing_x2,
            alignItems: "center",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <VoteChart
            percentageYes={percentageYes}
            percentageNo={percentageNo}
            percentageNoWithVeto={percentageNoWithVeto}
            percentageAbstain={percentageAbstain}
          />

          <SpacerRow size={1} />

          <VoteDetails
            percentageTotalParticipant={percentageTotalParticipant}
            percentageYes={percentageYes}
            percentageNo={percentageNo}
            percentageNoWithVeto={percentageNoWithVeto}
            percentageAbstain={percentageAbstain}
          />

          <View style={{ flex: 1, alignItems: "flex-end" }}>
            {isVoteEnable && (
              <PrimaryButton
                width={104}
                size="M"
                text="Vote"
                onPress={() => setVoteModalVisible(true)}
              />
            )}
          </View>
          <VoteModel
            percentageYes={percentageYes}
            percentageNo={percentageNo}
            percentageNoWithVeto={percentageNoWithVeto}
            percentageAbstain={percentageAbstain}
            visible={voteModalVisible}
            onClose={() => setVoteModalVisible(false)}
          />
        </View>
      </PrimaryBox>
    </>
  );
};
