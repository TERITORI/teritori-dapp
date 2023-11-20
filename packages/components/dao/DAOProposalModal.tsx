import React from "react";
import { View, ViewStyle } from "react-native";

import { ProposalActions } from "./ProposalActions";
import { AppProposalResponse } from "../../hooks/dao/useDAOProposals";
import { getUserId, parseUserId } from "../../networks";
import { neutral77 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { modalMarginPadding } from "../../utils/style/modals";
import { BrandText } from "../BrandText";
import ModalBase from "../modals/ModalBase";
import { SpacerColumn } from "../spacer";
import { MessagesPreviewList } from "../transactions/MessagesPreviewList";
import { Username } from "../user/Username";

export const DAOProposalModal: React.FC<{
  visible?: boolean;
  onClose: () => void;
  daoId: string | undefined;
  proposalInfo: AppProposalResponse;
}> = ({ visible, onClose, daoId, proposalInfo }) => {
  const [network] = parseUserId(daoId);
  const networkId = network?.id;
  const creatorId = getUserId(networkId, proposalInfo.proposal.proposer);
  return (
    <ModalBase
      onClose={() => {
        onClose();
      }}
      label={`Proposal #${proposalInfo.id}`}
      visible={visible}
      scrollable
      width={800}
      closeOnBlur
    >
      <View style={containerCStyle}>
        <View style={bodyCStyle}>
          {proposalInfo.proposal.title && (
            <>
              <BrandText style={fontSemibold14}>
                {proposalInfo.proposal.title}
              </BrandText>
              <SpacerColumn size={2.5} />
            </>
          )}
          <View style={rowCStyle}>
            <BrandText style={fontSemibold14}>Creator: </BrandText>
            <Username userId={creatorId} textStyle={fontSemibold14} />
          </View>
          {!!proposalInfo.proposal.description && (
            <>
              <SpacerColumn size={2.5} />
              <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                {proposalInfo.proposal.description}
              </BrandText>
            </>
          )}
          <SpacerColumn size={2.5} />
          {proposalInfo.proposal.msgs.length +
            proposalInfo.proposal.actions.length >
          0 ? (
            <>
              <BrandText style={fontSemibold14}>Actions:</BrandText>
              <SpacerColumn size={2.5} />
              <MessagesPreviewList
                networkId={network?.id}
                msgs={proposalInfo.proposal.msgs}
              />
            </>
          ) : (
            <BrandText style={fontSemibold14}>Sentiment proposal</BrandText>
          )}
        </View>
        <SpacerColumn size={2.5} />
        <View style={{ marginBottom: modalMarginPadding }}>
          <ProposalActions daoId={daoId} proposal={proposalInfo} />
        </View>
      </View>
    </ModalBase>
  );
};

const containerCStyle: ViewStyle = {
  marginTop: 10,
  flexDirection: "column",
};

const bodyCStyle: ViewStyle = {
  flexDirection: "column",
  marginBottom: 10,
};

const rowCStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};
