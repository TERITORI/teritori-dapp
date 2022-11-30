// libraries
import { Decimal } from "@cosmjs/math";
import React from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { Separator } from "../../../components/Separator";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { MainConnectWalletButton } from "../../../components/connectWallet/MainConnectWalletButton";
import {
  SelectInputCustom,
  SelectInputItem,
} from "../../../components/inputs/SelectInputCustom";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useBalances } from "../../../hooks/useBalances";
import { useProposals } from "../../../hooks/useProposals";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import {
  getNativeCurrency,
} from "../../../networks";
import { decimalFromAtomics } from "../../../utils/coins";
import {
  patternOnlyFloatNumbers,
  patternOnlyNumbers,
} from "../../../utils/formRules";
import { neutral33, neutral77 } from "../../../utils/style/colors";
import { fontMedium10, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { modalMarginPadding } from "../../../utils/style/modals";
import { toriCurrency } from "../../../utils/teritori";
import { ProposalForm, ProposalType } from "../types";

type CreateProposalModalProps = {
  newId: string;
  isVisible?: boolean;
  onClose: () => void;
};

const proposalTypes: SelectInputItem[] = Object.values(ProposalType).map(value => {return { value }})

export const CreateProposalModal: React.FC<CreateProposalModalProps> = ({
  newId,
  isVisible,
  onClose,
  // onSubmit,
}) => {
  const selectedWallet = useSelectedWallet();
  const currency = getNativeCurrency(
    process.env.TERITORI_NETWORK_ID,
    process.env.PUBLIC_STAKING_DENOM
  );
  const balances = useBalances(
    process.env.TERITORI_NETWORK_ID,
    selectedWallet?.address
  );
  const toriBalance = balances.find(
    (bal) => bal.denom === toriCurrency.coinMinimalDenom
  );
  const { handleSubmit, control, watch, setError } = useForm<ProposalForm>();
  const { submitProposal, loading } = useProposals();

  const canDepositInitialAmount = () =>
    watch("initialDeposit") &&
    patternOnlyFloatNumbers.value.test(watch("initialDeposit")) &&
    toriBalance &&
    currency &&
    decimalFromAtomics(toriBalance.amount, toriBalance.denom).isGreaterThan(
      Decimal.fromUserInput(watch("initialDeposit"), currency.decimals)
    );

  const onPressSubmit = handleSubmit(async (formValues) => {
    if (!canDepositInitialAmount()) {
      setError("initialDeposit", { message: "Insufficient funds" });
    } else {
      await submitProposal(formValues);
      onClose();
    }
  });

  return (
    <ModalBase
      visible={isVisible}
      onClose={onClose}
      Header={() => (
        <BrandText>
          Create Proposal{" "}
          <BrandText style={{ color: neutral77 }}>{`#${newId}`}</BrandText>
        </BrandText>
      )}
      width={480}
    >
      <TextInputCustom<ProposalForm>
        height={48}
        control={control}
        label="TITLE"
        placeHolder="Title"
        name="title"
        rules={{ required: true }}
      />

      <SpacerColumn size={2.5} />
      <TextInputCustom<ProposalForm>
        labelStyle={{ marginTop: -4 }}
        control={control}
        label="DESCRIPTION"
        placeHolder="Description"
        name="description"
        rules={{ required: true }}
        multiline
        numberOfLines={3}
      />

      <SpacerColumn size={2.5} />
      <SelectInputCustom<ProposalForm>
        style={{ zIndex: 1 }}
        defaultValue={
          proposalTypes.find((type) => type.value === ProposalType.TEXT)?.value
        }
        height={48}
        control={control}
        label="TYPE"
        name="type"
        rules={{ required: true }}
        items={proposalTypes}
      />

      <SpacerColumn size={2.5} />
      <View style={styles.inputsRowContainer}>
        <View style={styles.fill}>
          <TextInputCustom<ProposalForm>
            height={48}
            control={control}
            label="MINIMUM DEPOSIT"
            placeHolder="Type amount here"
            name="minimumDeposit"
            rules={{ required: true, pattern: patternOnlyFloatNumbers }}
          />
        </View>
        <SpacerRow size={1.5} />
        <View style={styles.fill}>
          <TextInputCustom<ProposalForm>
            height={48}
            control={control}
            label="INITIAL DEPOSIT"
            placeHolder="Type amount here"
            name="initialDeposit"
            rules={{ required: true, pattern: patternOnlyFloatNumbers }}
          />
        </View>
      </View>

      <SpacerColumn size={2.5} />
      <BrandText style={styles.periodText}>DEPOSIT PERIOD</BrandText>
      <SpacerColumn size={0.5} />
      <View style={styles.inputsRowContainer}>
        <View style={styles.fill}>
          <TextInputCustom<ProposalForm>
            defaultValue={10}
            height={48}
            name="depositPeriodDays"
            control={control}
            rules={{ required: true, pattern: patternOnlyNumbers }}
          >
            <BrandText style={styles.durationLabel}>Days</BrandText>
          </TextInputCustom>
        </View>
        <SpacerRow size={1.5} />
        <View style={styles.fill}>
          <TextInputCustom<ProposalForm>
            defaultValue={0}
            height={48}
            name="depositPeriodHours"
            control={control}
            rules={{ required: true, pattern: patternOnlyNumbers }}
          >
            <BrandText style={styles.durationLabel}>Hours</BrandText>
          </TextInputCustom>
        </View>
        <SpacerRow size={1.5} />
        <View style={styles.fill}>
          <TextInputCustom<ProposalForm>
            defaultValue={0}
            height={48}
            name="depositPeriodMinutes"
            control={control}
            rules={{ required: true, pattern: patternOnlyNumbers }}
          >
            <BrandText style={styles.durationLabel}>Minutes</BrandText>
          </TextInputCustom>
        </View>
      </View>

      <SpacerColumn size={2.5} />
      <BrandText style={styles.periodText}>VOTING PERIOD</BrandText>
      <SpacerColumn size={0.5} />
      <View style={styles.inputsRowContainer}>
        <View style={styles.fill}>
          <TextInputCustom<ProposalForm>
            defaultValue={10}
            height={48}
            name="votingPeriodDays"
            control={control}
            rules={{ required: true, pattern: patternOnlyNumbers }}
          >
            <BrandText style={styles.durationLabel}>Days</BrandText>
          </TextInputCustom>
        </View>
        <SpacerRow size={1.5} />
        <View style={styles.fill}>
          <TextInputCustom<ProposalForm>
            defaultValue={0}
            height={48}
            name="votingPeriodHours"
            control={control}
            rules={{ required: true, pattern: patternOnlyNumbers }}
          >
            <BrandText style={styles.durationLabel}>Hours</BrandText>
          </TextInputCustom>
        </View>
        <SpacerRow size={1.5} />
        <View style={styles.fill}>
          <TextInputCustom<ProposalForm>
            defaultValue={0}
            height={48}
            name="votingPeriodMinutes"
            control={control}
            rules={{ required: true, pattern: patternOnlyNumbers }}
          >
            <BrandText style={styles.durationLabel}>Minutes</BrandText>
          </TextInputCustom>
        </View>
      </View>

      <SpacerColumn size={2.5} />
      <Separator style={styles.separator} />
      <SpacerColumn size={2.5} />
      {!selectedWallet?.address ? (
        <MainConnectWalletButton size="M" fullWidth />
      ) : (
        <PrimaryButton
          loader={loading}
          size="M"
          text="Create Proposal"
          fullWidth
          onPress={onPressSubmit}
        />
      )}
      <SpacerColumn size={2.5} />
    </ModalBase>
  );
};

const styles = StyleSheet.create({
  separator: {
    marginHorizontal: -modalMarginPadding,
  },
  periodText: StyleSheet.flatten([
    fontMedium10,
    {
      color: neutral77,
    },
  ]),
  inputsRowContainer: {
    flexDirection: "row",
  },
  durationLabel: StyleSheet.flatten([
    fontSemibold14,
    {
      color: neutral77,
    },
  ]),
  fill: { flex: 1 },
  footer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingVertical: layout.padding_x1_5,
    paddingHorizontal: layout.padding_x2_5,
    borderTopWidth: 1,
    borderColor: neutral33,
  },
});
