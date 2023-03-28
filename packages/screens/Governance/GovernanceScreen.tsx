import React, { useEffect, useMemo, useState } from "react";
import { View, useWindowDimensions } from "react-native";

import { BrandText } from "../../components/BrandText/BrandText";
import { GovernanceBox } from "../../components/GovernanceBox/GovernanceBox";
import { ScreenContainer } from "../../components/ScreenContainer";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { NetworkKind, mustGetCosmosNetwork } from "../../networks";
import { NavBarGovernance } from "./NavBarGovernance";
import { Proposal, ProposalStatus } from "./types";

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
          `${network.restEndpoint}/cosmos/gov/v1beta1/proposals`
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
    [filter, proposals]
  );

  const { width } = useWindowDimensions();

  return (
    <ScreenContainer forceNetworkKind={NetworkKind.Cosmos}>
      <View
        style={{
          flexDirection: "row",
          display: "flex",
          flexWrap: "wrap",
          width: "100%",
          margin: "auto",
          justifyContent: "space-between",
          top: 55,
        }}
      >
        <BrandText
          style={{
            fontSize: 28,
            width: width < 1200 ? "100%" : "",
            textAlign: "center",
          }}
        >
          Decentralized Governance
        </BrandText>

        <View
          style={{
            bottom: 10,
            width: width < 1200 ? "100%" : "",
            minWidth: 250,
            flexDirection: "row",
            justifyContent: "center",
            paddingTop: width < 1200 ? 10 : 0,
          }}
        >
          <NavBarGovernance onChange={setFilter} />
        </View>
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          flexWrap: "wrap",
          marginTop: 110,
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
              proposals.final_tally_result.no_with_veto
            )}
            percentageAbstainValue={parseFloat(
              proposals.final_tally_result.abstain
            )}
            status={proposals.status}
          />
        ))}
      </View>
    </ScreenContainer>
  );
};
