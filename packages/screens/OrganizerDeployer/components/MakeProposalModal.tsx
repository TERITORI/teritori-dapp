import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, StyleSheet, View } from "react-native";

import { ProposalApprovalModal } from "./ProposalApprovalModal";
import chevronRightSVG from "../../../../assets/icons/chevron-right.svg";
import { BrandText } from "../../../components/BrandText";
import { CustomMultipleSwitch } from "../../../components/CustomMultiSwitch";
import { SVG } from "../../../components/SVG";
import { Separator } from "../../../components/Separator";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { TextInputOutsideLabel } from "../../../components/inputs/TextInputOutsideLabel";
import GradientModalBase from "../../../components/modals/GradientModalBase";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { validateAddress } from "../../../utils/formRules";
import {
  neutral17,
  neutral33,
  neutral77,
  primaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { modalMarginPadding } from "../../../utils/style/modals";
import { toriCurrency } from "../../../utils/teritori";
import { MakeProposalFormType } from "../types";

type MakeProposalModalProps = {
  visible: boolean;
  onRequestClose: () => void;
};

export const MakeProposalModal: React.FC<MakeProposalModalProps> = ({
  visible,
  onRequestClose,
}) => {
  // variables
  const [isProposalApprovalVisible, setIsProposalApprovalVisible] =
    useState<boolean>(false);
  const { control, setValue, watch } = useForm<MakeProposalFormType>({
    defaultValues: {
      type: "transfer",
      networkFee: "0.00025",
      senderAccount: "0x9aB4v5954B4C8890b6eBf8495A6b5F462790347f",
    },
  });

  const typeValue = watch("type");

  // functions
  const toggleProposalModal = () =>
    setIsProposalApprovalVisible(!isProposalApprovalVisible);

  // returns
  const toriText = useCallback(
    () => (
      <BrandText style={[fontSemibold14, { color: neutral77 }]}>TORI</BrandText>
    ),
    []
  );

  return (
    <GradientModalBase
      visible={visible}
      onClose={onRequestClose}
      modalStatus="dark"
      label="Make a proposal"
      width={460}
      hideMainSeparator
      scrollable
    >
      <TextInputOutsideLabel label="Select proposal type" isAsterickSign />
      <CustomMultipleSwitch
        items={["transfer", "stake"]}
        value={typeValue}
        onChange={(val) => setValue("type", val)}
      />
      <SpacerColumn size={2.5} />

      <TextInputCustom<MakeProposalFormType>
        control={control}
        name="recipintAddress"
        variant="noCropBorder"
        label="Recipient address"
        // isAsterickSign
        // mainContainerStyle={styles.border}
        rules={{ required: true, validate: validateAddress }}
      />
      <SpacerColumn size={2.5} />
      <View style={styles.row}>
        <View>
          <TextInputCustom<MakeProposalFormType>
            control={control}
            name="amount"
            variant="noCropBorder"
            label="Amount"
            // isAsterickSign
            width={210}
            rules={{ required: true }}
            // mainContainerStyle={styles.border}
            currency={toriCurrency}
          >
            {toriText()}
          </TextInputCustom>
        </View>
        <SpacerRow size={2.5} />
        <View>
          <TextInputCustom<MakeProposalFormType>
            control={control}
            name="networkFee"
            variant="noCropBorder"
            label="Network Fee"
            width={163}
            disabled
            // inputStyle={{ color: neutral77 }}
          >
            {toriText()}
          </TextInputCustom>
        </View>
      </View>

      <SpacerColumn size={2.5} />
      <Separator color={neutral33} />
      <SpacerColumn size={2.5} />

      <TextInputCustom<MakeProposalFormType>
        control={control}
        name="senderAccount"
        variant="noCropBorder"
        label="Sender account"
        disabled
      />

      <SpacerColumn size={2.5} />

      <Pressable onPress={toggleProposalModal}>
        <TextInputCustom<MakeProposalFormType>
          control={control}
          name="approvalRequired"
          variant="noCropBorder"
          label="Approvals required"
          defaultValue="2 approvals of 2 participants"
          // isAsterickSign
          disabled
        >
          <SVG source={chevronRightSVG} width={16} height={16} />
        </TextInputCustom>
      </Pressable>
      <SpacerColumn size={2.5} />
      <View style={styles.footer}>
        <PrimaryButton
          size="M"
          text="Create Proposal"
          squaresBackgroundColor={neutral17}
        />
      </View>

      <ProposalApprovalModal
        visible={isProposalApprovalVisible}
        onRequestClose={toggleProposalModal}
      />
    </GradientModalBase>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row" },
  border: {
    borderWidth: 1,
    borderColor: primaryColor,
  },
  footer: {
    paddingTop: layout.padding_x2_5,
    paddingBottom: layout.padding_x1,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: neutral33,
    marginLeft: -12,
    width: 455 - modalMarginPadding * 2,
  },
});
