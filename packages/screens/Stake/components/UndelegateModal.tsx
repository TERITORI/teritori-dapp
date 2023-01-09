import { Decimal } from "@cosmjs/math";
import { isDeliverTxFailure } from "@cosmjs/stargate";
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Pressable, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

import { BrandText } from "../../../components/BrandText";
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
import { getNetwork } from "../../../networks";
import { selectSelectedNetworkId } from "../../../store/slices/settings";
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
  fontSemibold16,
  fontSemibold20,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import {
  getSigningStargateClient,
  toriCurrency,
  toriDisplayDenom,
} from "../../../utils/teritori";
import { StakeFormValuesType, ValidatorInfo } from "../types";
import { WarningBox } from "./WarningBox";

interface UndelegateModalProps {
  onClose?: () => void;
  visible?: boolean;
  data?: ValidatorInfo;
}

export const UndelegateModal: React.FC<UndelegateModalProps> = ({
  onClose,
  visible,
  data,
}) => {
  const wallet = useSelectedWallet();
  const selectedNetworkId = useSelector(selectSelectedNetworkId);
  const selectedNetwork = getNetwork(selectedNetworkId);

  const { bondedTokens, refreshBondedTokens } = useSelectedWalletBondedToris(
    data?.address,
    selectedNetwork
  );
  const { setToastError, setToastSuccess } = useFeedbacks();
  const { triggerError } = useErrorHandler();

  // variables
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
      const signer = await getKeplrOfflineSigner(selectedNetwork);
      const client = await getSigningStargateClient(signer, selectedNetwork);
      const txResponse = await client.undelegateTokens(
        wallet.address,
        data.address,
        {
          amount: Decimal.fromUserInput(
            formData.amount,
            toriCurrency.coinDecimals
          ).atomics,
          denom: toriCurrency.coinMinimalDenom,
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
      onClose && onClose();
    } catch (error) {
      triggerError({ error, callback: onClose });
    }
  };

  // returns
  const Header = useCallback(
    () => (
      <View>
        <BrandText style={fontSemibold20}>Undelegate Tokens</BrandText>
        <SpacerColumn size={0.5} />
        <BrandText style={[styles.alternateText, fontSemibold16]}>
          Select an amount of {toriDisplayDenom} to undelegate
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
            text="Undelegate"
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
        <WarningBox
          title="Undelegating will keep your funds locked for 21 days"
          description={`Once you undelegate your staked ${toriDisplayDenom}, you will need to wait 21 days for your tokens to be liquid and you won't receive rewards during this time`}
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
          Bonded tokens:{" "}
          {prettyPrice(
            selectedNetworkId,
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
