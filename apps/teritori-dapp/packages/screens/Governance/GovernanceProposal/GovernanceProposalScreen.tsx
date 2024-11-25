import moment from "moment";
import React, { useEffect } from "react";
import { View } from "react-native";

import { GovernanceDescription } from "./GovernanceDescription/GovernanceDescription";
import { GovernanceVoteDetails } from "./GovernanceVoteDetails/GovernanceVoteDetails";
import { GovernanceVoteHeader } from "./GovernanceVoteHeader/GovernanceVoteHeader";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SpacerColumn } from "@/components/spacer";
import { useGetProposal } from "@/hooks/governance/useGetProposal";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { NetworkKind } from "@/networks";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";
import { fontSemibold20 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const GovernanceProposalScreen: ScreenFC<"GovernanceProposal"> = ({
  route: {
    params: { id },
  },
}) => {
  const selectedNetworkId = useSelectedNetworkId();
  const navigation = useAppNavigation();
  const proposal = useGetProposal(selectedNetworkId, id);
  const headerTitle =
    "#" + proposal?.proposal_id + " " + proposal?.content.title;
  useEffect(() => {
    navigation.setOptions({
      title: `Teritori - Governance: ${headerTitle || ""}`,
    });
  }, [navigation, id, headerTitle]);

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
        <View>
          <SpacerColumn size={layout.spacing_x0_5} />
          <GovernanceVoteHeader proposal={proposal} />

          <SpacerColumn size={layout.spacing_x0_5} />
          <GovernanceVoteDetails
            result={proposal.final_tally_result}
            isVoteEnable={moment(proposal.voting_end_time).isAfter(moment())}
          />

          <SpacerColumn size={layout.spacing_x0_5} />
          <GovernanceDescription description={proposal.content.description} />
        </View>
      )}
    </ScreenContainer>
  );
};
