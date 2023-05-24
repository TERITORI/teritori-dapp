import { cloneDeep } from "lodash";
import React from "react";
import { StyleSheet, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn } from "../../../components/spacer";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { DaoCoreQueryClient } from "../../../contracts-clients/dao-core/DaoCore.client";
import { DaoProposalSingleClient } from "../../../contracts-clients/dao-proposal-single/DaoProposalSingle.client";
import {
  ProposalResponse,
  Vote,
} from "../../../contracts-clients/dao-proposal-single/DaoProposalSingle.types";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import {
  getKeplrSigningCosmWasmClient,
  mustGetNonSigningCosmWasmClient,
} from "../../../networks";
import { neutral33, secondaryColor } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { tinyAddress } from "../../../utils/text";

export const DaoProposalModal: React.FC<{
  visible?: boolean;
  onClose: () => void;
  daoAddress: string;
  proposalInfo: ProposalResponse;
}> = ({ visible, onClose, daoAddress, proposalInfo }) => {
  const { setToastSuccess, setToastError } = useFeedbacks();
  const selectedWallet = useSelectedWallet();
  const vote = async (v: Vote) => {
    if (
      !selectedWallet ||
      proposalInfo.proposal.status !== "open" ||
      !daoAddress
    )
      return;
    try {
      const walletAddress = selectedWallet.address;
      const networkId = selectedWallet.networkId;
      const signingClient = await getKeplrSigningCosmWasmClient(networkId);
      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(
        selectedWallet.networkId
      );
      const coreClient = new DaoCoreQueryClient(cosmwasmClient, daoAddress);
      const proposalModuleAddress = (await coreClient.proposalModules({}))[0]
        .address;
      const daoProposalClient = new DaoProposalSingleClient(
        signingClient,
        walletAddress,
        proposalModuleAddress
      );
      const createVoteRes = await daoProposalClient.vote(
        { proposalId: proposalInfo.id, vote: v },
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
  const execute = async () => {
    if (
      !selectedWallet ||
      proposalInfo.proposal.status !== "passed" ||
      !daoAddress
    )
      return;
    try {
      const walletAddress = selectedWallet.address;
      const networkId = selectedWallet.networkId;
      const signingClient = await getKeplrSigningCosmWasmClient(networkId);
      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(
        selectedWallet.networkId
      );
      const coreClient = new DaoCoreQueryClient(cosmwasmClient, daoAddress);
      const proposalModuleAddress = (await coreClient.proposalModules({}))[0]
        .address;
      const daoProposalClient = new DaoProposalSingleClient(
        signingClient,
        walletAddress,
        proposalModuleAddress
      );
      const createVoteRes = await daoProposalClient.execute({
        proposalId: proposalInfo.id,
      });
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
      label={`TODO - ${proposalInfo.id}`}
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
          <SpacerColumn size={2.5} />
          <BrandText style={[styles.textGray, {}]}>
            {JSON.stringify(
              proposalInfo.proposal.msgs.map((mm) => {
                const m = cloneDeep(mm);
                if ("wasm" in m && "execute" in m.wasm) {
                  m.wasm.execute.msg = JSON.parse(
                    Buffer.from(m.wasm.execute.msg, "base64").toString()
                  );
                }
                return m;
              }),
              null,
              4
            )}
          </BrandText>
        </View>
        {proposalInfo.proposal.status === "open" && (
          <View style={styles.footer}>
            <View style={{ flexDirection: "row-reverse" }}>
              <PrimaryButton
                size="M"
                text="Abstrain"
                onPress={() => {
                  vote("abstain");
                }}
                style={{ marginLeft: 10 }}
              />
              <PrimaryButton
                size="M"
                text="No"
                onPress={() => {
                  vote("no");
                }}
                style={{ marginLeft: 10 }}
              />
              <PrimaryButton
                size="M"
                text="Yes"
                onPress={() => {
                  vote("yes");
                }}
                style={{ marginLeft: 10 }}
              />
              <PrimaryButton
                size="M"
                text="Execute"
                onPress={() => {
                  execute();
                }}
              />
            </View>
          </View>
        )}
        {proposalInfo.proposal.status === "passed" && (
          <View style={styles.footer}>
            <View style={{ flexDirection: "row-reverse" }}>
              <PrimaryButton
                size="M"
                text="Execute"
                onPress={() => {
                  execute();
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
