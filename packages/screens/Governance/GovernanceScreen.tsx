import React, { useEffect, useMemo, useState } from "react";
import { FlatList, View } from "react-native";

import { NavBarGovernance } from "./NavBarGovernance";
import { Proposal, ProposalStatus } from "./types";
import { BrandText } from "../../components/BrandText";
import { GovernanceBox } from "../../components/GovernanceBox/GovernanceBox";
import { ScreenContainer } from "../../components/ScreenContainer";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { NetworkKind, mustGetCosmosNetwork } from "../../networks";
import { fontSemibold20, fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

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
    <ScreenContainer
      headerChildren={<BrandText style={fontSemibold20}>Governance</BrandText>}
      responsive
      forceNetworkKind={NetworkKind.Cosmos}
    >
      <View
        style={{
          marginTop: layout.spacing_x4,
        }}
      >
        <BrandText style={fontSemibold28}>Decentralized Governance</BrandText>

        <NavBarGovernance onChange={setFilter} />

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginTop: layout.spacing_x4,
          }}
        >
          <FlatList
            data={filteredProposals}
            columnWrapperStyle={{ flexWrap: "wrap", flex: 1, marginTop: 5 }}
            numColumns={99} // needed to deal with wrap via css
            renderItem={({ item: proposals, index }) => (
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
                percentageYesValue={parseFloat(
                  proposals.final_tally_result.yes,
                )}
                percentageNoWithVetoValue={parseFloat(
                  proposals.final_tally_result.no_with_veto,
                )}
                percentageAbstainValue={parseFloat(
                  proposals.final_tally_result.abstain,
                )}
                status={proposals.status}
              />
            )}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};
