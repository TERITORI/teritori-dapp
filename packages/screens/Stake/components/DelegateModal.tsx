import { Decimal } from "@cosmjs/math";
import { isDeliverTxFailure } from "@cosmjs/stargate";
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

import { WarningBox } from "./WarningBox";
import { BrandText } from "../../../components/BrandText";
import { Separator } from "../../../components/Separator";
import { MaxButton } from "../../../components/buttons/MaxButton";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useBalances } from "../../../hooks/useBalances";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import {
  getKeplrSigningStargateClient,
  getStakingCurrency,
  keplrCurrencyFromNativeCurrencyInfo,
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
}

export const DelegateModal: React.FC<DelegateModalProps> = ({
  onClose,
  visible,
  validator,
}) => {
  // variables
  const wallet = useSelectedWallet();
  const { setToastError, setToastSuccess } = useFeedbacks();
  const { triggerError } = useErrorHandler();
  const networkId = wallet?.networkId || "";
  const balances = useBalances(networkId, wallet?.address);
  const stakingCurrency = getStakingCurrency(networkId);
  const toriBalance = balances.find((bal) => bal.denom === "utori");
  const toriBalanceDecimal = Decimal.fromAtomics(
    toriBalance?.amount || "0",
    stakingCurrency?.decimals || 0
  );
  const { control, setValue, handleSubmit, reset } =
    useForm<StakeFormValuesType>();

  // hooks
  useEffect(() => {
    reset();
  }, [reset, visible]);

  useEffect(() => {
    setValue("validatorName", validator?.moniker || "");
  }, [validator?.moniker, setValue]);

  // functions
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
        if (!wallet?.connected || !wallet.address) {
          console.warn("invalid wallet", wallet);
          setToastError({
            title: "Invalid wallet",
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
        const client = await getKeplrSigningStargateClient(wallet.networkId);
        const txResponse = await client.delegateTokens(
          wallet.address,
          validator.address,
          {
            amount: Decimal.fromUserInput(
              formData.amount,
              stakingCurrency.decimals
            ).atomics,
            denom: stakingCurrency.denom,
          },
          "auto"
        );

        if (isDeliverTxFailure(txResponse)) {
          console.error("tx failed", txResponse);
          onClose && onClose();
          setToastError({
            title: "Transaction failed",
            message: txResponse.rawLog || "",
          });
          return;
        }

        setToastSuccess({ title: "Delegation success", message: "" });
        onClose && onClose();
      } catch (error) {
        triggerError({ title: "Delegation failed!", error, callback: onClose });
      }
    },
    [
      validator,
      onClose,
      setToastError,
      setToastSuccess,
      stakingCurrency,
      triggerError,
      wallet,
    ]
  );

  // returns
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
    [stakingCurrency?.displayName]
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
            text="Stake"
            width={120}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </>
    ),
    [handleSubmit, onClose, onSubmit]
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
          rules={{ required: true, max: toriBalanceDecimal.toString() }}
        >
          <MaxButton
            onPress={() =>
              setValue("amount", toriBalanceDecimal.toString(), {
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
            toriBalanceDecimal.atomics,
            stakingCurrency?.denom || ""
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
    padding: layout.padding_x2_5,
  },
  alternateText: {
    ...StyleSheet.flatten(fontSemibold12),
    color: neutral77,
    flexShrink: 1,
  },
});
