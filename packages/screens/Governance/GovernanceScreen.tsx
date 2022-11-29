import React, { useMemo, useState } from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText/BrandText";
import { GovernanceBox } from "../../components/GovernanceBox/GovernanceBox";
import { ScreenContainer } from "../../components/ScreenContainer";
import { SecondaryButtonOutline } from "../../components/buttons/SecondaryButtonOutline";
import { useProposals } from "../../hooks/useProposals";
import { neutral00, primaryColor } from "../../utils/style/colors";
import { CreateProposalModal } from "./components/CreateProposalModal";
import { NavBarGovernance } from "./components/NavBarGovernance";
import { ProposalStatus } from "./types";

// FIXME: properly handle pagination

export const GovernanceScreen: React.FC = () => {
  const [filter, setFilter] = useState<ProposalStatus>();
  const { proposals, submitProposal } = useProposals();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const filteredProposals = useMemo(
    () =>
      (filter
        ? proposals.filter((p) => p.status === filter)
        : proposals
      ).reverse(),
    [filter, proposals]
  );

  const nextProposalId = () => {
    if (!proposals.length) return "";
    return (parseInt(proposals.reverse()[0].proposal_id, 10) + 1).toString();
  };

  return (
    <ScreenContainer>
      <View
        style={{
          flexDirection: "row",
          display: "flex",
          width: 1240,
          right: 75,
          justifyContent: "space-between",
          top: 55,
        }}
      >
        <BrandText style={{ fontSize: 28 }}>Decentralized Governance</BrandText>

        <View style={{ bottom: 10, right: 100 }}>
          <NavBarGovernance onChange={setFilter} />
        </View>

        <SecondaryButtonOutline
          backgroundColor={neutral00}
          size="SM"
          text="Create Proposal"
          onPress={() => setIsCreateModalVisible(true)}
        />
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: 110,
          marginLeft: -70,
          marginRight: -60,
        }}
      >
        {filteredProposals.map((proposal, index) => (
          <GovernanceBox
            key={index}
            numberProposal={proposal.proposal_id}
            titleProposal={proposal.content.title}
            descriptionProposal={proposal.content.description}
            votingEndTime={proposal.voting_end_time}
            votingStartTime={proposal.voting_start_time}
            votingSubmitTime={proposal.submit_time}
            votingDepositEndTime={proposal.deposit_end_time}
            colorMostVoted={primaryColor}
            percentageNoValue={parseFloat(proposal.final_tally_result.no)}
            percentageYesValue={parseFloat(proposal.final_tally_result.yes)}
            percentageNoWithVetoValue={parseFloat(
              proposal.final_tally_result.no_with_veto
            )}
            percentageAbstainValue={parseFloat(
              proposal.final_tally_result.abstain
            )}
            status={proposal.status}
          />
        ))}
      </View>

      <CreateProposalModal
        isVisible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSubmit={submitProposal}
        newId={nextProposalId()}
      />
    </ScreenContainer>
  );
};
