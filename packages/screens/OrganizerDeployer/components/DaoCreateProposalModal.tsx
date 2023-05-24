import React from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn } from "../../../components/spacer";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { DaoCoreQueryClient } from "../../../contracts-clients/dao-core/DaoCore.client";
import { DaoPreProposeSingleClient } from "../../../contracts-clients/dao-pre-propose-single/DaoPreProposeSingle.client";
import { DaoProposalSingleQueryClient } from "../../../contracts-clients/dao-proposal-single/DaoProposalSingle.client";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import {
  getKeplrSigningCosmWasmClient,
  mustGetNonSigningCosmWasmClient,
} from "../../../networks";
import { neutral33 } from "../../../utils/style/colors";
import { CreateDaoProposalFormType } from "../types";

export const DaoCreateProposalModal: React.FC<{
  visible?: boolean;
  onClose: () => void;
  daoAddress: string;
}> = ({ visible, onClose, daoAddress }) => {
  const { setToastSuccess, setToastError } = useFeedbacks();
  const selectedWallet = useSelectedWallet();

  const {
    control,
    watch,
    formState: { isValid },
  } = useForm<CreateDaoProposalFormType>({
    defaultValues: {
      proposalName: "",
      proposalDescription: "",
    },
    mode: "all",
  });
  const publishProposal = async () => {
    if (!isValid) return;
    const proposalName = watch("proposalName");
    const proposalDescription = watch("proposalDescription");
    if (!selectedWallet) return;
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
      const daoProposalClient = new DaoProposalSingleQueryClient(
        cosmwasmClient,
        proposalModuleAddress
      );
      const policy = await daoProposalClient.proposalCreationPolicy();
      if (!("module" in policy)) throw new Error("Invalid policy");
      const daoProposalBaseClient = new DaoPreProposeSingleClient(
        signingClient,
        walletAddress,
        policy.module.addr
      );

      const createProposalRes = await daoProposalBaseClient.propose(
        {
          msg: {
            propose: {
              title: proposalName,
              description: proposalDescription,
              msgs: [],
            },
          },
        },
        "auto"
      );
      if (createProposalRes) {
        onClose();
        setToastSuccess({
          title: "Created proposal successfully",
          message: "Created proposal successfully",
        });
      } else {
        onClose();
        setToastError({
          title: "Failed to create proposal",
          message: "Failed to create proposal",
        });
      }
    } catch (err: any) {
      console.log(err.message);
      onClose();
      setToastError({
        title: "Failed to create proposal",
        message: err.message,
      });
    }
  };

  return (
    <ModalBase
      onClose={() => {
        onClose();
      }}
      label="New Proposal"
      visible={visible}
      width={800}
    >
      <View style={styles.container}>
        <View style={styles.body}>
          <TextInputCustom<CreateDaoProposalFormType>
            control={control}
            variant="noCropBorder"
            placeHolder="Type your proposal name here"
            name="proposalName"
            label="Proposal name"
            rules={{ required: true }}
            // isAsterickSign
          />
          <SpacerColumn size={2.5} />
          <TextInputCustom<CreateDaoProposalFormType>
            control={control}
            variant="noCropBorder"
            placeHolder="Type your proposal description here"
            name="proposalDescription"
            label="Proposal Description"
            multiline
            numberOfLines={3}
            rules={{ required: true }}
            // isAsterickSign
          />
        </View>
        <View style={styles.footer}>
          <View style={{ flexDirection: "row-reverse" }}>
            <PrimaryButton
              size="M"
              text="Publish"
              onPress={() => {
                publishProposal();
              }}
              disabled={!isValid}
            />
          </View>
        </View>
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
  },
  footer: {
    borderColor: neutral33,
    borderTopWidth: 1,
    paddingVertical: 10,
  },
});
