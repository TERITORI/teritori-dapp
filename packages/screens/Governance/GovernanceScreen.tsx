import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

import { NavBarGovernance } from "./NavBarGovernance";
import { Proposal, ProposalStatus } from "./types";
import { BrandText } from "../../components/BrandText/BrandText";
import { GovernanceBox } from "../../components/GovernanceBox/GovernanceBox";
import { ScreenContainer } from "../../components/ScreenContainer";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { NetworkKind, mustGetCosmosNetwork } from "../../networks";

// FIXME: properly handle pagination

export const GovernanceScreen: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filter, setFilter] = useState<ProposalStatus>();
  const selectedNetworkId = useSelectedNetworkId();

  useEffect(() => {
    const effect = async () => {
      try {
        const network = mustGetCosmosNetwork(selectedNetworkId);
        const res = await fetch(
          `${network.restEndpoint}/cosmos/gov/v1beta1/proposals`,
        );
        const data = await res.json();

        setProposals(data.proposals.reverse());
      } catch (err) {
        console.error(err);
      }
    };
    effect();
  }, [selectedNetworkId]);

  const filteredProposals = useMemo(
    () => (filter ? proposals.filter((p) => p.status === filter) : proposals),
    [filter, proposals],
  );

  return (
    <ScreenContainer forceNetworkKind={NetworkKind.Cosmos}>
      <BrandText style={{ fontSize: 28 }}>Decentralized Governance</BrandText>

      <NavBarGovernance onChange={setFilter} />

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
        {filteredProposals.map((proposals, index) => (
          <GovernanceBox
            key={index}
            numberProposal={proposals.proposal_id}
            titleProposal={proposals.content.title}
            descriptionProposal={proposals.content.description}
            votingEndTime={proposals.voting_end_time}
            votingStartTime={proposals.voting_start_time}
            votingSubmitTime={proposals.submit_time}
            votingDepositEndTime={proposals.deposit_end_time}
            colorMostVoted="#16BBFF"
            percentageNoValue={parseFloat(proposals.final_tally_result.no)}
            percentageYesValue={parseFloat(proposals.final_tally_result.yes)}
            percentageNoWithVetoValue={parseFloat(
              proposals.final_tally_result.no_with_veto,
            )}
            percentageAbstainValue={parseFloat(
              proposals.final_tally_result.abstain,
            )}
            status={proposals.status}
          />
        ))}
      </View>
    </ScreenContainer>
  );
};
