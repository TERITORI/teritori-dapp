import React from "react";
import { View } from "react-native";

import { VoteTimeDetailsBox } from "./components/VoteTimeDetailsBox";
import expireSVG from "@/assets/icons/expires.svg";
import PassedSVG from "@/assets/icons/passed.svg";
import RejectSVG from "@/assets/icons/reject.svg";
import VotingSVG from "@/assets/icons/voting.svg";

import { BrandText } from "@/components/BrandText";
import { GovernanceExpire } from "@/components/GovernanceBox/GovernanceExpire";
import { GovernanceTitle } from "@/components/GovernanceBox/GovernanceTitle";
import { SpacerColumn } from "@/components/spacer";
import {
  additionalSuccess,
  errorColor,
  primaryColor,
  secondaryColor,
  withAlpha,
} from "@/utils/style/colors";
import { fontSemibold20 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { Proposal } from "@/utils/types/gov";

export const GovernanceVoteHeader: React.FC<{
  proposal: Proposal;
}> = ({ proposal }) => {
  return (
    <>
      {proposal.status === "PROPOSAL_STATUS_DEPOSIT_PERIOD" && (
        <View style={{ flexDirection: "row" }}>
          <GovernanceTitle
            title="Voting Period"
            titleColor={primaryColor}
            iconSVG={VotingSVG}
          />
          <GovernanceExpire
            style={{ marginLeft: layout.spacing_x1 }}
            votingEndTime={proposal.deposit_end_time}
            iconSVG={expireSVG}
          />
        </View>
      )}

      {proposal.status === "PROPOSAL_STATUS_REJECTED" && (
        <GovernanceTitle
          title="Rejected"
          titleColor={errorColor}
          iconSVG={RejectSVG}
          hasBorder
          borderColor={withAlpha(errorColor, 0.1)}
        />
      )}

      {proposal.status === "PROPOSAL_STATUS_PASSED" && (
        <GovernanceTitle
          title="Passed"
          titleColor={additionalSuccess}
          iconSVG={PassedSVG}
          hasBorder
          borderColor={withAlpha(additionalSuccess, 0.1)}
        />
      )}

      <SpacerColumn size={2} />

      <BrandText
        style={[
          fontSemibold20,
          {
            color: secondaryColor,
          },
        ]}
      >
        {"#" + proposal.proposal_id + " " + proposal.content.title}
      </BrandText>

      <SpacerColumn size={2} />

      <VoteTimeDetailsBox
        submit_time={proposal.submit_time}
        deposit_end_time={proposal.deposit_end_time}
        voting_start_time={proposal.voting_start_time}
        voting_end_time={proposal.voting_end_time}
      />
    </>
  );
};
