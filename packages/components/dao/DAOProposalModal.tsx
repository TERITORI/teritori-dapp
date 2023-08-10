import { cloneDeep } from "lodash";
import React from "react";
import { StyleSheet, View } from "react-native";

import { ProposalActions } from "./ProposalActions";
import { CosmosMsgForEmpty } from "../../contracts-clients/dao-proposal-single/DaoProposalSingle.types";
import { AppProposalResponse } from "../../hooks/dao/useDAOProposals";
import { useNSPrimaryAlias } from "../../hooks/useNSPrimaryAlias";
import { getCosmosNetwork, getUserId, parseUserId } from "../../networks";
import { neutral33, neutral77, secondaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { modalMarginPadding } from "../../utils/style/modals";
import { BrandText } from "../BrandText";
import ModalBase from "../modals/ModalBase";
import { SocialMessageContent } from "../socialFeed/SocialThread/SocialMessageContent";
import { SpacerColumn } from "../spacer";

export const DAOProposalModal: React.FC<{
  visible?: boolean;
  onClose: () => void;
  daoId: string | undefined;
  proposalInfo: AppProposalResponse;
}> = ({ visible, onClose, daoId, proposalInfo }) => {
  const [network] = parseUserId(daoId);
  const networkId = network?.id;
  const { primaryAlias } = useNSPrimaryAlias(
    getUserId(networkId, proposalInfo.proposal.proposer)
  );
  return (
    <ModalBase
      onClose={() => {
        onClose();
      }}
      label={`Proposal #${proposalInfo.id}`}
      visible={visible}
      scrollable
      width={800}
    >
      <View style={styles.container}>
        <View style={styles.body}>
          {proposalInfo.proposal.title && (
            <>
              <BrandText style={fontSemibold14}>
                {proposalInfo.proposal.title}
              </BrandText>
              <SpacerColumn size={2.5} />
            </>
          )}
          <View style={styles.row}>
            <BrandText style={fontSemibold14}>Creator: </BrandText>
            <BrandText style={styles.textGray}>
              {primaryAlias
                ? `@${primaryAlias}`
                : proposalInfo.proposal.proposer}
            </BrandText>
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
              <ProposalMessagesList
                networkId={network?.id}
                proposal={proposalInfo}
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

const ProposalMessagesList: React.FC<{
  networkId: string | undefined;
  proposal: AppProposalResponse;
}> = ({ networkId, proposal }) => {
  return (
    <>
      {[...proposal.proposal.msgs, ...proposal.proposal.actions].map(
        (message, index) => {
          return (
            <>
              {index !== 0 && <SpacerColumn size={2.5} />}
              <View
                style={{
                  borderWidth: 1,
                  borderColor: neutral77,
                  borderRadius: 8,
                  padding: 8,
                }}
              >
                <MessagePreview
                  networkId={networkId}
                  message={message}
                  key={index}
                />
              </View>
            </>
          );
        }
      )}
    </>
  );
};

const MessagePreview: React.FC<{
  networkId: string | undefined;
  message: CosmosMsgForEmpty | string;
}> = ({ networkId, message }) => {
  const socialFeedContractAddress =
    getCosmosNetwork(networkId)?.socialFeedContractAddress;
  const m = cloneDeep(message);
  if (typeof m === "object" && "wasm" in m && "execute" in m.wasm) {
    const msg = JSON.parse(
      Buffer.from(m.wasm.execute.msg, "base64").toString()
    );
    const action = Object.keys(msg)[0];
    const payload = msg[action];

    if (m.wasm.execute.contract_addr === socialFeedContractAddress) {
      if (action === "create_post") {
        return (
          <View>
            <BrandText>Post on social feed</BrandText>
            <SpacerColumn size={2.5} />
            <SocialMessageContent
              postCategory={payload.category}
              metadata={JSON.parse(payload.metadata)}
              isPreview
            />
          </View>
        );
      }
    } else {
      m.wasm.execute.msg = payload;
    }
  }
  return (
    <BrandText style={styles.textGray}>
      {typeof message === "string" ? message : JSON.stringify(m, null, 4)}
    </BrandText>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flexDirection: "column",
  },
  body: {
    flexDirection: "column",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  textGray: StyleSheet.flatten([
    fontSemibold14,
    {
      color: secondaryColor,
      opacity: 0.5,
    },
  ]),
  footer: {
    borderColor: neutral33,
    borderTopWidth: 1,
    paddingVertical: 10,
  },
});
