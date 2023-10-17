import { Decimal } from "@cosmjs/math";
import { MsgDelegateEncodeObject } from "@cosmjs/stargate";
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

import { WarningBox } from "./WarningBox";
import { BrandText } from "../../../components/BrandText";
import { MaxButton } from "../../../components/buttons/MaxButton";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import ModalBase from "../../../components/modals/ModalBase";
import { Separator } from "../../../components/separators/Separator";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useBalances } from "../../../hooks/useBalances";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { useRunOrProposeTransaction } from "../../../hooks/useRunOrProposeTransaction";
import {
  UserKind,
  getStakingCurrency,
  keplrCurrencyFromNativeCurrencyInfo,
  parseUserId,
} from "../../../networks";
import { prettyPrice } from "../../../utils/coins";
import { neutral77 } from "../../../utils/style/colors";
import {
  fontSemibold12,
  fontSemibold13,
  fontSemibold16,
  fontSemibold20,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { StakeFormValuesType, ValidatorInfo } from "../types";

interface DelegateModalProps {
  onClose?: () => void;
  visible?: boolean;
  validator?: ValidatorInfo;
  userKind: UserKind;
  userId: string | undefined;
}

export const DelegateModal: React.FC<DelegateModalProps> = ({
  onClose,
  visible,
  validator,
  userKind,
  userId,
}) => {
  const runOrProposeTransaction = useRunOrProposeTransaction(userId, userKind);
  const { setToastError, setToastSuccess } = useFeedbacks();
  const { triggerError } = useErrorHandler();
  const [network, userAddress] = parseUserId(userId);
  const networkId = network?.id;
  const balances = useBalances(networkId, userAddress);
  const stakingCurrency = getStakingCurrency(networkId);
  const stakingCurrencyBalance =
    stakingCurrency &&
    balances.find((bal) => bal.denom === stakingCurrency.denom);
  const stakingCurrencyBalanceDecimal = Decimal.fromAtomics(
    stakingCurrencyBalance?.amount || "0",
    stakingCurrency?.decimals || 0,
  );
  const { control, setValue, handleSubmit, reset } =
    useForm<StakeFormValuesType>();

  useEffect(() => {
    reset();
  }, [reset, visible]);

  useEffect(() => {
    setValue("validatorName", validator?.moniker || "");
  }, [validator?.moniker, setValue]);

  const onSubmit = useCallback(
    async (formData: StakeFormValuesType) => {
      try {
        if (!stakingCurrency) {
          console.warn("staking currency not found");
          setToastError({
            title: "Staking currency not found",
            message: "",
          });
          return;
        }
        if (!validator) {
          setToastError({
            title: "Internal error",
            message: "No data",
          });
          return;
        }
        const amount = Decimal.fromUserInput(
          formData.amount,
          stakingCurrency.decimals,
        ).atomics;
        const msg: MsgDelegateEncodeObject = {
          typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
          value: {
            amount: {
              amount,
              denom: stakingCurrency.denom,
            },
            delegatorAddress: userAddress,
            validatorAddress: validator.address,
          },
        };
        await runOrProposeTransaction({
          msgs: [msg],
          navigateToProposals: true,
        });
        const toastTitle =
          userKind === UserKind.Single
            ? "Delegation success"
            : "Proposed to delegate";
        setToastSuccess({
          title: toastTitle,
          message: `${prettyPrice(
            networkId,
            amount,
            stakingCurrency.denom,
          )} to ${validator.moniker}`,
        });
        onClose && onClose();
      } catch (error) {
        triggerError({ title: "Delegation failed!", error, callback: onClose });
      }
    },
    [
      networkId,
      onClose,
      runOrProposeTransaction,
      setToastError,
      setToastSuccess,
      stakingCurrency,
      triggerError,
      userAddress,
      userKind,
      validator,
    ],
  );

  const Header = useCallback(
    () => (
      <View>
        <BrandText style={fontSemibold20}>Stake Tokens</BrandText>
        <SpacerColumn size={0.5} />
        <BrandText style={[styles.alternateText, fontSemibold16]}>
          Select a validator and amount of {stakingCurrency?.displayName} to
          stake.
        </BrandText>
      </View>
    ),
    [stakingCurrency?.displayName],
  );

  const Footer = useCallback(
    () => (
      <>
        <Separator />
        <View style={styles.footerRow}>
          <SecondaryButton
            size="XS"
            text="Cancel"
            width={120}
            onPress={onClose}
          />
          <SpacerRow size={2} />
          <PrimaryButton
            size="XS"
            loader
            text={userKind === UserKind.Single ? "Stake" : "Propose stake"}
            width={140}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </>
    ),
    [handleSubmit, onClose, onSubmit, userKind],
  );

  return (
    <ModalBase
      onClose={onClose}
      visible={visible}
      Header={Header}
      childrenBottom={Footer()}
      hideMainSeparator
    >
      <View style={styles.container}>
        <Separator />
        <SpacerColumn size={2.5} />
        <WarningBox
          title="Staking will lock your funds for 21 days"
          description={`Once you undelegate your staked ${stakingCurrency?.displayName}, you will need to wait 21 days for your tokens to be liquid.`}
        />
        <SpacerColumn size={2.5} />
        <TextInputCustom<StakeFormValuesType>
          name="validatorName"
          control={control}
          variant="labelOutside"
          label="Validator Name"
          disabled
          rules={{ required: true }}
        />
        <SpacerColumn size={2.5} />
        <TextInputCustom<StakeFormValuesType>
          name="amount"
          variant="labelOutside"
          label="Amount"
          control={control}
          placeHolder="0"
          currency={keplrCurrencyFromNativeCurrencyInfo(stakingCurrency)}
          defaultValue=""
          rules={{
            required: true,
            max: stakingCurrencyBalanceDecimal.toString(),
          }}
        >
          <MaxButton
            onPress={() =>
              setValue("amount", stakingCurrencyBalanceDecimal.toString(), {
                shouldValidate: true,
              })
            }
          />
        </TextInputCustom>
        <SpacerColumn size={1} />

        <BrandText style={fontSemibold13}>
          Available balance:{" "}
          {prettyPrice(
            networkId,
            stakingCurrencyBalance?.amount,
            stakingCurrency?.denom,
          )}
        </BrandText>
        <SpacerColumn size={2.5} />
      </View>
    </ModalBase>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    width: 446,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: layout.spacing_x2_5,
  },
  alternateText: {
    ...StyleSheet.flatten(fontSemibold12),
    color: neutral77,
    flexShrink: 1,
  },
});
