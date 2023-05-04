import React from "react";
import { StyleSheet, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn } from "../../../components/spacer";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { TeritoriDaoProposalClient } from "../../../contracts-clients/teritori-dao/TeritoriDaoProposal.client";
import { ProposalInfo as ContractProposalInfo } from "../../../contracts-clients/teritori-dao/TeritoriDaoProposal.types";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { getKeplrSigningCosmWasmClient } from "../../../networks";
import { neutral33, secondaryColor } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { tinyAddress } from "../../../utils/text";
import { DaoInfo } from "../types";

enum VoteType {
  YES = 0,
  NO = 1,
  ABSTRAIN = 2,
}

export const DaoProposalModal: React.FC<{
  visible?: boolean;
  onClose: () => void;
  daoInfo: DaoInfo;
  proposalInfo: ContractProposalInfo;
}> = ({ visible, onClose, daoInfo, proposalInfo }) => {
  const { setToastSuccess, setToastError } = useFeedbacks();
  const selectedWallet = useSelectedWallet();
  const vote = async (v: VoteType) => {
    if (
      !selectedWallet ||
      proposalInfo.proposal.status !== "open" ||
      daoInfo.proposalModuleAddress === ""
    )
      return;
    let vs = "yes";
    if (v === VoteType.NO) {
      vs = "no";
    } else if (v === VoteType.ABSTRAIN) {
      vs = "abstrain";
    }
    try {
      const walletAddress = selectedWallet.address;
      const networkId = selectedWallet.networkId;
      const signingClient = await getKeplrSigningCosmWasmClient(networkId);
      const daoProposalClient = new TeritoriDaoProposalClient(
        signingClient,
        walletAddress,
        daoInfo.proposalModuleAddress
      );
      const createVoteRes = await daoProposalClient.vote(
        { proposalId: proposalInfo.id, vote: vs },
        "auto"
      );
      if (createVoteRes) {
        onClose();
        setToastSuccess({ title: "Success Vote", message: "Success Vote" });
      } else {
        onClose();
        setToastError({
          title: "Failed to vote",
          message: "Failed to vote",
        });
      }
    } catch (err: any) {
      onClose();
      setToastError({
        title: "Failed to vote",
        message: err.message,
      });
    }
  };
  return (
    <ModalBase
      onClose={() => {
        onClose();
      }}
      label={`${daoInfo.name} - ${proposalInfo.id}`}
      visible={visible}
      width={800}
    >
      <View style={styles.container}>
        <View style={styles.body}>
          <View style={styles.row}>
            <BrandText style={fontSemibold14}>Name: </BrandText>
            <BrandText style={styles.textGray}>
              {proposalInfo.proposal.title}
            </BrandText>
          </View>
          <SpacerColumn size={2.5} />
          <View style={styles.row}>
            <BrandText style={fontSemibold14}>Status: </BrandText>
            <BrandText style={styles.textGray}>
              {proposalInfo.proposal.status}
            </BrandText>
          </View>
          <SpacerColumn size={2.5} />
          <View style={styles.row}>
            <BrandText style={fontSemibold14}>Creator: </BrandText>
            <BrandText style={styles.textGray}>
              {tinyAddress(proposalInfo.proposal.proposer)}
            </BrandText>
          </View>
          <SpacerColumn size={2.5} />
          <View style={styles.row}>
            <BrandText style={styles.textGray}>
              {proposalInfo.proposal.description}
            </BrandText>
          </View>
        </View>
        {proposalInfo.proposal.status === "open" && (
          <View style={styles.footer}>
            <View style={{ flexDirection: "row-reverse" }}>
              <PrimaryButton
                size="M"
                text="Abstrain"
                onPress={() => {
                  vote(VoteType.ABSTRAIN);
                }}
                style={{ marginLeft: 10 }}
              />
              <PrimaryButton
                size="M"
                text="No"
                onPress={() => {
                  vote(VoteType.NO);
                }}
                style={{ marginLeft: 10 }}
              />
              <PrimaryButton
                size="M"
                text="Yes"
                onPress={() => {
                  vote(VoteType.YES);
                }}
              />
            </View>
          </View>
        )}
      </View>
    </ModalBase>
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