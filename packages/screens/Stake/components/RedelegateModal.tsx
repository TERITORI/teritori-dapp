import { Decimal } from "@cosmjs/math";
import { isDeliverTxFailure } from "@cosmjs/stargate";
import { MsgBeginRedelegate } from "cosmjs-types/cosmos/staking/v1beta1/tx";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, StyleSheet, View } from "react-native";

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
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { useSelectedWalletBondedToris } from "../../../hooks/useSelectedWalletBondedToris";
import { useValidators } from "../../../hooks/useValidators";
import { prettyPrice } from "../../../utils/coins";
import { getKeplrOfflineSigner } from "../../../utils/keplr";
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
import {
  getTeritoriSigningStargateClient,
  toriCurrency,
  toriDisplayDenom,
} from "../../../utils/teritori";
import { StakeFormValuesType, ValidatorInfo } from "../types";
import { ValidatorsTable } from "./ValidatorsList";

interface RedelegateModalProps {
  onClose?: () => void;
  visible?: boolean;
  data?: ValidatorInfo;
}

export const RedelegateModal: React.FC<RedelegateModalProps> = ({
  onClose,
  visible,
  data,
}) => {
  // variables
  const wallet = useSelectedWallet();
  const { bondedTokens, refreshBondedTokens } = useSelectedWalletBondedToris(
    data?.address
  );
  const [modifiedValidators, setModifiedValidators] = useState<ValidatorInfo[]>(
    []
  );
  const [selectedValidator, setSelectedValidator] = useState<ValidatorInfo>();
  const { setToastError, setToastSuccess } = useFeedbacks();
  const {
    data: { allValidators },
  } = useValidators();
  const { triggerError } = useErrorHandler();
  const { control, setValue, handleSubmit, watch, reset } =
    useForm<StakeFormValuesType>();
  const watchAll = watch();

  // hooks
  useEffect(() => {
    reset();
  }, [visible]);

  useEffect(() => {
    setValue("validatorName", data?.moniker || "");
  }, [data?.moniker]);

  useEffect(() => {
    if (data?.moniker) {
      let currentValidators = allValidators;
      if (bondedTokens.atomics && bondedTokens.atomics !== "0") {
        currentValidators = currentValidators.filter(
          (d) => d.moniker !== data?.moniker
        );
      }
      setModifiedValidators(currentValidators);
    }
  }, [bondedTokens]);

  // functions
  const onSubmit = async (formData: StakeFormValuesType) => {
    try {
      if (!wallet?.connected || !wallet.address) {
        console.warn("invalid wallet", wallet);
        setToastError({
          title: "Invalid wallet",
          message: "",
        });
        return;
      }
      if (!data) {
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
      const signer = await getKeplrOfflineSigner();
      const client = await getTeritoriSigningStargateClient(signer);
      const msg: MsgBeginRedelegate = {
        delegatorAddress: wallet.address,
        validatorSrcAddress: data.address,
        validatorDstAddress: selectedValidator.address,
        amount: {
          amount: Decimal.fromUserInput(
            formData.amount,
            toriCurrency.coinDecimals
          ).atomics,
          denom: toriCurrency.coinMinimalDenom,
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
      triggerError({ title: "Redelegation failed!", error, callback: onClose });
    }
  };

  // returns
  const Header = useCallback(
    () => (
      <View>
        <BrandText style={fontSemibold20}>Redelegate Tokens</BrandText>
        <SpacerColumn size={0.5} />
        <BrandText style={[styles.alternateText, fontSemibold16]}>
          Select an amount of {toriDisplayDenom} to redelegate
        </BrandText>
      </View>
    ),
    [data]
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
    [watchAll]
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
          currency={toriCurrency}
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
            process.env.TERITORI_NETWORK_ID || "",
            bondedTokens.atomics,
            toriCurrency.coinMinimalDenom
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
