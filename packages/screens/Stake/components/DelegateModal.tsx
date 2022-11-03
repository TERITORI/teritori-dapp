import { Decimal } from "@cosmjs/math";
import { isDeliverTxFailure } from "@cosmjs/stargate";
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

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
import { prettyPrice } from "../../../utils/coins";
import { getKeplrOfflineSigner } from "../../../utils/keplr";
import { neutral77 } from "../../../utils/style/colors";
import {
  fontSemibold12,
  fontSemibold13,
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
import { WarningBox } from "./WarningBox";

interface DelegateModalProps {
  onClose?: () => void;
  visible?: boolean;
  data?: ValidatorInfo;
}

export const DelegateModal: React.FC<DelegateModalProps> = ({
  onClose,
  visible,
  data,
}) => {
  // variables
  const wallet = useSelectedWallet();
  const { setToastError, setToastSuccess } = useFeedbacks();
  const { triggerError } = useErrorHandler();
  const balances = useBalances(
    process.env.TERITORI_NETWORK_ID,
    wallet?.address
  );
  const toriBalance = balances.find((bal) => bal.denom === "utori");
  const toriBalanceDecimal = Decimal.fromAtomics(
    toriBalance?.amount || "0",
    toriCurrency.coinDecimals
  );
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
      const signer = await getKeplrOfflineSigner();
      const client = await getTeritoriSigningStargateClient(signer);
      const txResponse = await client.delegateTokens(
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

      setToastSuccess({ title: "Delegation success", message: "" });
      onClose && onClose();
    } catch (error) {
      triggerError({ error, callback: onClose });
    }
  };

  // returns
  const Header = useCallback(
    () => (
      <View>
        <BrandText style={fontSemibold20}>Stake Tokens</BrandText>
        <SpacerColumn size={0.5} />
        <BrandText style={[styles.alternateText, fontSemibold16]}>
          Select a validator and amount of {toriDisplayDenom} to stake.
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
            loader
            text="Stake"
            width={120}
            onPress={handleSubmit(onSubmit)}
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
          title="Staking will lock your funds for 21 days"
          description={`Once you undelegate your staked ${toriDisplayDenom}, you will need to wait 21 days for your tokens to be liquid.`}
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
            process.env.TERITORI_NETWORK_ID || "",
            toriBalanceDecimal.atomics,
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
    flexShrink: 1,
  },
});
