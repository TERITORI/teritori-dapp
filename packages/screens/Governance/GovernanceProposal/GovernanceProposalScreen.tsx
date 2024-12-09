import moment from "moment";
import React, { useEffect } from "react";
import { View } from "react-native";

import { GovernanceDescription } from "./GovernanceDescription/GovernanceDescription";
import { GovernanceVoteDetails } from "./GovernanceVoteDetails/GovernanceVoteDetails";
import { GovernanceVoteHeader } from "./GovernanceVoteHeader/GovernanceVoteHeader";

import { ScreenContainer } from "@/components/ScreenContainer";
import { ScreenTitle } from "@/components/ScreenContainer/ScreenTitle";
import { SpacerColumn } from "@/components/spacer";
import { useAppConfig } from "@/context/AppConfigProvider";
import { useGetProposal } from "@/hooks/governance/useGetProposal";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { NetworkKind } from "@/networks";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";
import { layout } from "@/utils/style/layout";

export const GovernanceProposalScreen: ScreenFC<"GovernanceProposal"> = ({
  route: {
    params: { id },
  },
}) => {
  const selectedNetworkId = useSelectedNetworkId();
  const navigation = useAppNavigation();
  const { browserTabsPrefix } = useAppConfig();
  const proposal = useGetProposal(selectedNetworkId, id);
  const headerTitle =
    "#" + proposal?.proposal_id + " " + proposal?.content.title;
  useEffect(() => {
    navigation.setOptions({
      title: `${browserTabsPrefix}Governance: ${headerTitle || ""}`,
    });
  }, [navigation, id, headerTitle, browserTabsPrefix]);

  return (
    <ScreenContainer
      forceNetworkKind={NetworkKind.Cosmos}
      isLarge
      headerChildren={<ScreenTitle>{`Proposal #${id}`}</ScreenTitle>}
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
