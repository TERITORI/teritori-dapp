import { Decimal } from "@cosmjs/math";
import { isDeliverTxFailure } from "@cosmjs/stargate";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, TouchableOpacity } from "react-native";

import ModalBase from "./ModalBase";
import contactsSVG from "../../../assets/icons/contacts.svg";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useBalances } from "../../hooks/useBalances";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { useWalletStargateClient } from "../../hooks/wallets/useWalletClients";
import {
  getNetwork,
  keplrCurrencyFromNativeCurrencyInfo,
  NativeCurrencyInfo,
} from "../../networks";
import { TransactionForm } from "../../screens/WalletManager/types";
import { prettyPrice } from "../../utils/coins";
import {
  neutral22,
  neutral33,
  neutral77,
  primaryColor,
} from "../../utils/style/colors";
import { fontSemibold13 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import FlexCol from "../FlexCol";
import FlexRow from "../FlexRow";
import { NetworkIcon } from "../NetworkIcon";
import { SVG } from "../SVG";
import { MaxButton } from "../buttons/MaxButton";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { TextInputCustom } from "../inputs/TextInputCustom";
import { SpacerColumn, SpacerRow } from "../spacer";

type SendModalProps = {
  isVisible: boolean;
  nativeCurrency?: NativeCurrencyInfo;
  networkId: string;
  onClose: () => void;
};

//TODO: Make a reusable component for that, or use an existing one (Which one ? Which other usage for ContactButton ?)
const ContactButton: React.FC<{ onPress?: () => void }> = ({ onPress }) => {
  //TODO: Remove disabled when contacts are handled
  return (
    <TouchableOpacity style={styles.contactsButton} onPress={onPress} disabled>
      <SVG source={contactsSVG} width={16} height={16} />
    </TouchableOpacity>
  );
};

export const SendModal: React.FC<SendModalProps> = ({
  isVisible,
  onClose,
  nativeCurrency,
  networkId,
}) => {
  const { setToastError, setToastSuccess } = useFeedbacks();
  const selectedWallet = useSelectedWallet();
  const { control, setValue, handleSubmit } = useForm<TransactionForm>();
  const stargateClient = useWalletStargateClient(selectedWallet?.id);

  const balances = useBalances(networkId, selectedWallet?.address);

  const ModalHeader = useCallback(
    () => (
      <FlexRow alignItems="center" width="auto">
        <NetworkIcon networkId={networkId} size={32} />
        <SpacerRow size={3} />
        <BrandText>{`Send ${nativeCurrency?.displayName}`}</BrandText>
      </FlexRow>
    ),
    [networkId, nativeCurrency?.displayName]
  );

  const maxAtomics =
    balances.find((bal) => bal.denom === nativeCurrency?.denom)?.amount || "0";
  const max = Decimal.fromAtomics(
    maxAtomics,
    nativeCurrency?.decimals || 0
  ).toString();

  const onPressSend = async (formData: TransactionForm) => {
    try {
      if (!stargateClient) {
        throw new Error("no stargate client");
      }
      if (!selectedWallet) {
        throw new Error("no selected wallet");
      }
      if (!nativeCurrency) {
        throw new Error("no native target currency");
      }
      const receiver = formData.toAddress;
      if (!receiver) {
        throw new Error("no receiver");
      }
      const sender = selectedWallet?.address;
      if (!sender) {
        throw new Error("no sender");
      }

      const amount = Decimal.fromUserInput(
        formData.amount,
        nativeCurrency.decimals
      ).atomics;

      const tx = await stargateClient.sendTokens(
        sender,
        receiver,
        [{ amount, denom: nativeCurrency.denom }],
        "auto"
      );

      if (isDeliverTxFailure(tx)) {
        console.error("Send Tokens tx failed", tx);
        setToastError({ title: "Transaction failed", message: "" });
        throw new Error("failure");
      }

      setToastSuccess({
        title: `${prettyPrice(
          networkId,
          amount,
          nativeCurrency.denom
        )} succesfully sent to ${formData.toAddress}`,
        message: "",
      });
      // FIXME: find out if it's possible to check for ibc ack
    } catch (err) {
      console.error("Send Tokens failed", err);
      if (err instanceof Error) {
        setToastError({
          title: "Failed to Send Tokens",
          message: err.message,
        });
      }
    }
    onClose();
  };

  return (
    <ModalBase
      visible={isVisible}
      onClose={onClose}
      Header={ModalHeader}
      width={456}
    >
      <FlexRow alignItems="flex-end">
        <FlexCol alignItems="flex-start" width={356}>
          <TextInputCustom<TransactionForm>
            height={48}
            control={control}
            variant="labelOutside"
            label="Receiver"
            name="toAddress"
            rules={{ required: true }}
            placeHolder={`Enter a ${
              getNetwork(networkId)?.displayName
            } address`}
            defaultValue=""
          />
        </FlexCol>
        <ContactButton />
      </FlexRow>

      <SpacerColumn size={2.5} />

      <TextInputCustom<TransactionForm>
        height={48}
        control={control}
        variant="labelOutside"
        label="Amount"
        name="amount"
        currency={keplrCurrencyFromNativeCurrencyInfo(nativeCurrency)}
        rules={{ required: true, max }}
        placeHolder="0"
        defaultValue=""
        subtitle={
          <BrandText style={[fontSemibold13, { color: neutral77 }]}>
            Available:{" "}
            <BrandText style={[fontSemibold13, { color: primaryColor }]}>
              {max}
            </BrandText>
          </BrandText>
        }
      >
        <MaxButton onPress={() => setValue("amount", max)} />
      </TextInputCustom>

      <SpacerColumn size={2.5} />

      <PrimaryButton
        size="XL"
        text="Send"
        fullWidth
        disabled={max === "0"}
        loader
        onPress={handleSubmit(onPressSend)}
      />
      <SpacerColumn size={2.5} />
    </ModalBase>
  );
};

const styles = StyleSheet.create({
  contactsButton: {
    width: 48,
    height: 48,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: neutral33,
    backgroundColor: neutral22,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: layout.padding_x1_5,
    //TODO: Remove that when contacts are handled
    opacity: 0.5,
  },
});
