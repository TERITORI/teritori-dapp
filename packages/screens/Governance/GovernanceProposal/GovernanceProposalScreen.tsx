import moment from "moment";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { GovernanceAllValidators } from "./GovernanceAllValidators/GovernanceValidatorsReview";
import { GovernanceDescription } from "./GovernanceDescription/GovernanceDescription";
import { GovernanceValidatorsReview } from "./GovernanceValidatorsReview/GovernanceValidatorsReview";
import { GovernanceVoteDetails } from "./GovernanceVoteDetails/GovernanceVoteDetails";
import { GovernanceVoteHeader } from "./GovernanceVoteHeader/GovernanceVoteHeader";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SpacerColumn } from "@/components/spacer";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { mustGetCosmosNetwork, NetworkKind } from "@/networks";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";
import { fontSemibold20 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { Proposal } from "@/utils/types/gov";

export const GovernanceProposalScreen: ScreenFC<"GovernanceProposal"> = ({
  route: {
    params: { id },
  },
}) => {
  const [proposal, setProposal] = useState<Proposal>();
  const selectedNetworkId = useSelectedNetworkId();
  const navigation = useAppNavigation();

  useEffect(() => {
    const effect = async () => {
      try {
        const network = mustGetCosmosNetwork(selectedNetworkId);
        const res = await fetch(
          `${network.restEndpoint}/cosmos/gov/v1beta1/proposals/${id}`,
        );
        const data = await res.json();

        setProposal(data.proposal);
      } catch (err) {
        console.error(err);
      }
    };
    effect();
  }, [id, selectedNetworkId]);

  return (
    <ScreenContainer
      forceNetworkKind={NetworkKind.Cosmos}
      isLarge
      headerChildren={
        <BrandText style={fontSemibold20}>{`Proposal #${id}`}</BrandText>
      }
      onBackPress={() => navigation.navigate("Governance")}
    >
      {proposal && (
        <View
          style={{
            marginTop: layout.spacing_x3,
          }}
        >
          <GovernanceVoteHeader proposal={proposal} />

          <SpacerColumn size={4} />
          <GovernanceVoteDetails
            result={proposal.final_tally_result}
            isVoteEnable={moment(proposal.voting_end_time).isAfter(moment())}
          />

          <SpacerColumn size={4} />
          <GovernanceValidatorsReview validator={0} />

          <SpacerColumn size={4} />
          <GovernanceAllValidators validator={25} />

          <SpacerColumn size={4} />
          <GovernanceDescription description={proposal.content.description} />
        </View>
      )}
    </ScreenContainer>
  );
};
