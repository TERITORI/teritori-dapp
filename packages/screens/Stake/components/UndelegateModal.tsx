import { Decimal } from "@cosmjs/math";
import { isDeliverTxFailure } from "@cosmjs/stargate";
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Pressable, StyleSheet, View } from "react-native";

import { WarningBox } from "./WarningBox";
import { BrandText } from "../../../components/BrandText";
import { Separator } from "../../../components/Separator";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useCosmosValidatorBondedAmount } from "../../../hooks/useCosmosValidatorBondedAmount";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import {
  getKeplrSigningStargateClient,
  getStakingCurrency,
  keplrCurrencyFromNativeCurrencyInfo,
} from "../../../networks";
import { prettyPrice } from "../../../utils/coins";
import {
  neutral22,
  neutral77,
  primaryColor,
} from "../../../utils/style/colors";
import {
  fontSemibold12,
  fontSemibold13,
  fontSemibold16,
  fontSemibold20,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { StakeFormValuesType, ValidatorInfo } from "../types";

interface UndelegateModalProps {
  onClose?: () => void;
  visible?: boolean;
  validator?: ValidatorInfo;
}

export const UndelegateModal: React.FC<UndelegateModalProps> = ({
  onClose,
  visible,
  validator,
}) => {
  const { selectedWallet: wallet } = useSelectedWallet();
  const networkId = wallet?.networkId || "";
  const { bondedTokens, refreshBondedTokens } = useCosmosValidatorBondedAmount(
    wallet?.userId,
    validator?.address
  );
  const { setToastError, setToastSuccess } = useFeedbacks();
  const { triggerError } = useErrorHandler();

  // variables
  const { control, setValue, handleSubmit, reset } =
    useForm<StakeFormValuesType>();
  const stakingCurrency = getStakingCurrency(networkId);

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
        const txResponse = await client.undelegateTokens(
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
        setToastSuccess({ title: "Undelegation success", message: "" });
        refreshBondedTokens();
      } catch (error) {
        triggerError({
          title: "Undelegation failed!",
          error,
          callback: onClose,
        });
      }
    },
    [
      validator,
      onClose,
      refreshBondedTokens,
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
        <BrandText style={fontSemibold20}>Undelegate Tokens</BrandText>
        <SpacerColumn size={0.5} />
        <BrandText style={[styles.alternateText, fontSemibold16]}>
          Select an amount of {stakingCurrency?.displayName} to undelegate
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
            text="Undelegate"
            width={120}
            onPress={handleSubmit(onSubmit)}
            loader
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
          title="Undelegating will keep your funds locked for 21 days"
          description={`Once you undelegate your staked ${stakingCurrency?.displayName}, you will need to wait 21 days for your tokens to be liquid and you won't receive rewards during this time`}
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
          rules={{ required: true, max: bondedTokens.toString() }}
        >
          <Pressable
            onPress={() =>
              setValue("amount", bondedTokens.toString(), {
                shouldValidate: true,
              })
            }
          >
            <BrandText style={styles.maxText}>max</BrandText>
          </Pressable>
        </TextInputCustom>
        <SpacerColumn size={1} />

        <BrandText style={fontSemibold13}>
          Bonded tokens:{" "}
          {prettyPrice(
            networkId,
            bondedTokens.atomics,
            stakingCurrency?.denom || ""
          )}
        </BrandText>
        <SpacerColumn size={2.5} />
      </View>
    </ModalBase>
  );
};

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
  },
  maxText: {
    ...StyleSheet.flatten(fontSemibold12),
    backgroundColor: primaryColor,
    color: neutral22,
    borderRadius: layout.borderRadius,
    paddingHorizontal: layout.padding_x0_5,
  },
});
