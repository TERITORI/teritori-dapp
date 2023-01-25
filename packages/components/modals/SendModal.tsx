import { Decimal } from "@cosmjs/math";
import { isDeliverTxFailure } from "@cosmjs/stargate";
import React, {useCallback, useState} from "react";
import { useForm } from "react-hook-form";
import {StyleSheet, TouchableOpacity} from "react-native";
import {useFeedbacks} from "../../context/FeedbacksProvider";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  getKeplrSigningStargateClient,
  keplrCurrencyFromNativeCurrencyInfo, NativeCurrencyInfo
} from "../../networks";
import {useBalances} from "../../hooks/useBalances";
import {SpacerColumn, SpacerRow} from "../spacer";
import {BrandText} from "../BrandText";
import {NetworkIcon} from "../NetworkIcon";
import {TransactionForm} from "../../screens/WalletManager/types";
import ModalBase from "./ModalBase";
import FlexRow from "../containers/FlexRow";
import {TextInputCustom} from "../inputs/TextInputCustom";
import {neutral22, neutral33} from "../../utils/style/colors";
import {SVG} from "../SVG";
import contactsSVG from "../../../assets/icons/contacts.svg"
import {layout} from "../../utils/style/layout";
import {MaxButton} from "../buttons/MaxButton";
import {PrimaryButton} from "../buttons/PrimaryButton";
import FlexCol from "../containers/FlexCol";

type SendModalProps = {
  isVisible: boolean;
  nativeCurrency?: NativeCurrencyInfo;
  networkId: string;
  onClose: () => void;
};

//TODO: Make a reusable component for that, or use an existing one (Which one ? Which other usage for ContactButton ?)
const ContactButton: React.FC<{onPress: () => void;}> = ({onPress}) => {
  return (
    <TouchableOpacity style={styles.contactsButton} onPress={onPress}>
      <SVG source={contactsSVG} width={16} height={16}/>
    </TouchableOpacity>
  )
}

export const SendModal: React.FC<SendModalProps> = ({
                                                                    isVisible,
                                                                    onClose,
                                                                    nativeCurrency,
                                                                    networkId,
                                                                  }) => {
  const { setToastError } = useFeedbacks();
  const selectedWallet = useSelectedWallet(); // FIXME: this could not match networkId
  const [isContactsVisible, setContactsVisible] = useState(false)
  const { control, setValue, handleSubmit } = useForm<TransactionForm>();

  const balances = useBalances(networkId, selectedWallet?.address);

  const ModalHeader = useCallback(
    () => (
      <FlexRow alignItems="center" width="auto">
        <NetworkIcon networkId={networkId} size={32} />
        <SpacerRow size={3} />
        <BrandText>{`Send ${nativeCurrency?.displayName}`}</BrandText>
      </FlexRow>
    ),
    [networkId]
  );

  const maxAtomics = balances.find((bal) => bal.denom === nativeCurrency?.denom)?.amount || "0";
  const max = Decimal.fromAtomics(
    maxAtomics,
    nativeCurrency?.decimals || 0
  ).toString();

  const onPressSend = () => {
    handleSubmit(async (formValues) => {
      try {
        const client = await getKeplrSigningStargateClient(networkId);
        const sender = selectedWallet?.address;
        if (!sender) {
          throw new Error("no sender");
        }
        //TODO: handle contacts
        const receiver = "tori1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad";
        if (!receiver) {
          throw new Error("no receiver");
        }
        if (!nativeCurrency) {
          throw new Error("no native target currency");
        }

        const amount = Decimal.fromUserInput(
          formValues.amount,
          nativeCurrency.decimals
        ).atomics;
        const tx = await client.sendTokens(
          sender,
          receiver,
          [{ amount, denom: nativeCurrency.denom }],
          "auto"
        );
        if (isDeliverTxFailure(tx)) {
          console.error("Send Tokens tx failed", tx);
          setToastError({ title: "Transaction failed", message: "" });
        }
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
    })
  }

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
            placeHolder="Enter a TERITORI address"
          />
        </FlexCol>
        <ContactButton onPress={() => setContactsVisible(isIt => !isIt)}/>
      </FlexRow>

      <SpacerColumn size={2.5}/>

      <TextInputCustom<TransactionForm>
        height={48}
        control={control}
        variant="labelOutside"
        label="Amount"
        name="amount"
        currency={keplrCurrencyFromNativeCurrencyInfo(nativeCurrency)}
        rules={{ required: true, max }}
        placeHolder="0"
        subtitle={`Available: ${max}`}
      >
        <MaxButton onPress={() => setValue("amount", max)} />
      </TextInputCustom>

      <SpacerColumn size={2.5}/>

      <PrimaryButton
        size="XL"
        text={"Send"}
        fullWidth
        disabled={max === "0"}
        loader
        onPress={onPressSend}
      />
      <SpacerColumn size={2.5}/>
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
    marginLeft: layout.padding_x1_5
  },
  receiverInput: {

  },
  amountInput: {

  }
});
