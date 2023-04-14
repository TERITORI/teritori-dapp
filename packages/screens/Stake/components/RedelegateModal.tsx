import { Decimal } from "@cosmjs/math";
import { isDeliverTxFailure } from "@cosmjs/stargate";
import { MsgBeginRedelegate } from "osmojs/types/codegen/cosmos/staking/v1beta1/tx";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, StyleSheet, View } from "react-native";

import { ValidatorsTable } from "./ValidatorsList";
import checkSVG from "../../../../assets/icons/check.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
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
import { useValidators } from "../../../hooks/useValidators";
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
  fontSemibold14,
  fontSemibold16,
  fontSemibold20,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { StakeFormValuesType, ValidatorInfo } from "../types";

interface RedelegateModalProps {
  onClose?: () => void;
  visible?: boolean;
  validator?: ValidatorInfo;
}

export const RedelegateModal: React.FC<RedelegateModalProps> = ({
  onClose,
  visible,
  validator,
}) => {
  // variables
  const wallet = useSelectedWallet();
  const networkId = wallet?.networkId || "";
  const { bondedTokens, refreshBondedTokens } = useCosmosValidatorBondedAmount(
    wallet?.userId,
    validator?.address
  );
  const [selectedValidator, setSelectedValidator] = useState<ValidatorInfo>();
  const { setToastError, setToastSuccess } = useFeedbacks();
  const {
    data: { allValidators },
  } = useValidators(networkId);
  const { triggerError } = useErrorHandler();
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

  const modifiedValidators = useMemo(() => {
    if (!validator?.moniker) {
      return [];
    }
    let currentValidators = allValidators;
    if (bondedTokens.atomics && bondedTokens.atomics !== "0") {
      currentValidators = currentValidators.filter(
        (d) => d.moniker !== validator.moniker
      );
    }
    return currentValidators;
  }, [allValidators, bondedTokens.atomics, validator?.moniker]);

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
        if (!selectedValidator) {
          setToastError({
            title: "Internal error",
            message: "No validator selected",
          });
          return;
        }
        const client = await getKeplrSigningStargateClient(wallet.networkId);
        const msg: MsgBeginRedelegate = {
          delegatorAddress: wallet.address,
          validatorSrcAddress: validator.address,
          validatorDstAddress: selectedValidator.address,
          amount: {
            amount: Decimal.fromUserInput(
              formData.amount,
              stakingCurrency.decimals
            ).atomics,
            denom: stakingCurrency.denom,
          },
        };

        const txResponse = await client.signAndBroadcast(
          wallet.address,
          [
            {
              typeUrl: "/cosmos.staking.v1beta1.MsgBeginRedelegate",
              value: msg,
            },
          ],
          "auto"
        );
        if (isDeliverTxFailure(txResponse)) {
          onClose && onClose();
          console.error("tx failed", txResponse);
          setToastError({
            title: "Transaction failed",
            message: txResponse.rawLog || "",
          });
          return;
        }

        setToastSuccess({ title: "Redelegation success", message: "" });
        refreshBondedTokens();
        onClose && onClose();
      } catch (error) {
        triggerError({
          title: "Redelegation failed!",
          error,
          callback: onClose,
        });
      }
    },
    [
      validator,
      onClose,
      refreshBondedTokens,
      selectedValidator,
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
        <BrandText style={fontSemibold20}>Redelegate Tokens</BrandText>
        <SpacerColumn size={0.5} />
        <BrandText style={[styles.alternateText, fontSemibold16]}>
          Select an amount of {stakingCurrency?.displayName} to redelegate
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
            text="Redelegate"
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
        <TextInputCustom<StakeFormValuesType>
          name="validatorName"
          control={control}
          variant="labelOutside"
          label="Source Validator"
          disabled
          rules={{ required: true }}
        />
        <SpacerColumn size={2.5} />
        <View>
          <BrandText style={[fontSemibold14, { color: neutral77 }]}>
            Destination Validator
          </BrandText>
          <SpacerColumn size={1} />
        </View>
        <ValidatorsTable
          validators={modifiedValidators}
          style={{ height: 200 }}
          actions={(validator) => {
            if (validator.address === selectedValidator?.address) {
              return [
                {
                  renderComponent: () => (
                    <SVG
                      source={checkSVG}
                      width={layout.iconButton}
                      height={layout.iconButton}
                      fill={primaryColor}
                    />
                  ),
                },
              ];
            }
            return [
              { label: "Select", onPress: (val) => setSelectedValidator(val) },
            ];
          }}
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
          Tokens bonded to source validator:{" "}
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
    width: 700,
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
