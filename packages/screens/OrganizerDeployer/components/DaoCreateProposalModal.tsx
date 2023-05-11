import React from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn } from "../../../components/spacer";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { TeritoriDaoProposalBaseClient } from "../../../contracts-clients/teritori-dao/TeritoriDaoProposalBase.client";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { getKeplrSigningCosmWasmClient } from "../../../networks";
import { neutral33 } from "../../../utils/style/colors";
import { CreateDaoProposalFormType, DaoInfo } from "../types";

export const DaoCreateProposalModal: React.FC<{
  visible?: boolean;
  onClose: () => void;
  daoInfo: DaoInfo;
}> = ({ visible, onClose, daoInfo }) => {
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
      const daoProposalBaseClient = new TeritoriDaoProposalBaseClient(
        signingClient,
        walletAddress,
        daoInfo.proposalBaseModuleAddress
      );

      const createProposalRes = await daoProposalBaseClient.createProposal(
        { title: proposalName, description: proposalDescription, msgs: [] },
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
