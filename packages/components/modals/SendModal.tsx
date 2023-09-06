import { Decimal } from "@cosmjs/math";
import { MsgSendEncodeObject } from "@cosmjs/stargate";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, TouchableOpacity } from "react-native";

import ModalBase from "./ModalBase";
import contactsSVG from "../../../assets/icons/contacts.svg";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useBalances } from "../../hooks/useBalances";
import { useRunOrProposeTransaction } from "../../hooks/useRunOrProposeTransaction";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  getNetwork,
  keplrCurrencyFromNativeCurrencyInfo,
  NativeCurrencyInfo,
  NetworkKind,
  parseUserId,
  UserKind,
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
import { DAOSelector } from "../dao/DAOSelector";
import { SearchNSInputContainer } from "../inputs/SearchNSInputContainer";
import { TextInputCustom } from "../inputs/TextInputCustom";
import { SpacerColumn, SpacerRow } from "../spacer";

type SendModalProps = {
  isVisible: boolean;
  nativeCurrency?: NativeCurrencyInfo;
  onClose: () => void;
  userId?: string;
  userKind: UserKind;
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
  userId,
  userKind,
}) => {
  const { setToastError, setToastSuccess } = useFeedbacks();
  const { selectedWallet } = useSelectedWallet();
  const { control, setValue, handleSubmit, watch } = useForm<TransactionForm>();
  const [selectedDAOId, setSelectedDAOId] = useState("");
  const selectedUserKind = selectedDAOId ? UserKind.Organization : userKind;
  const selectedUserId =
    selectedUserKind === UserKind.Single
      ? selectedWallet?.userId
      : selectedDAOId || userId;
  const runOrProposeTransaction = useRunOrProposeTransaction(
    selectedUserId,
    selectedUserKind
  );
  const [userNetwork, userAddress] = parseUserId(selectedUserId);
  const networkId = userNetwork?.id;
  const balances = useBalances(userNetwork?.id, userAddress);

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
      const sender = selectedWallet?.address;
      const receiver = formData.toAddress;
      if (!sender) {
        throw new Error("no sender");
      }
      //TODO: handle contacts
      if (!receiver) {
        throw new Error("no receiver");
      }
      if (!nativeCurrency) {
        throw new Error("no native target currency");
      }

      const amount = Decimal.fromUserInput(
        formData.amount,
        nativeCurrency.decimals
      ).atomics;

      if (userNetwork?.kind === NetworkKind.Gno) {
        const adena = (window as any).adena;
        const res = await adena.DoContract({
          messages: [
            {
              type: "/bank.MsgSend",
              value: {
                from_address: sender,
                to_address: receiver,
                amount: `${amount}ugnot`,
              },
            },
          ],
          gasFee: 1,
          gasWanted: 50000,
        });
        if (res.status !== "success") {
          throw new Error(res.message);
        }
      } else {
        const cosmosMsg: MsgSendEncodeObject = {
          typeUrl: "/cosmos.bank.v1beta1.MsgSend",
          value: {
            fromAddress: userAddress,
            toAddress: receiver,
            amount: [{ amount, denom: nativeCurrency.denom }],
          },
        };
        await runOrProposeTransaction({
          msgs: [cosmosMsg],
          title: `Send ${prettyPrice(
            networkId,
            amount,
            nativeCurrency.denom
          )} to ${receiver}`,
        });
      }
      setToastSuccess({
        title: `${
          selectedUserKind === UserKind.Single ? "Sent" : "Proposed to send"
        } ${prettyPrice(
          networkId,
          amount,
          nativeCurrency.denom
        )} to ${receiver}`,
        message: "",
      });
    } catch (err) {
      console.error("Failed to send tokens", err);
      if (err instanceof Error) {
        setToastError({
          title: "Failed to send tokens",
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
          <SearchNSInputContainer
            onPressName={(userId) => {
              const [, userAddress] = parseUserId(userId);
              setValue("toAddress", userAddress);
            }}
            searchText={watch("toAddress")}
          >
            <TextInputCustom<TransactionForm>
              height={48}
              width={320}
              control={control}
              variant="labelOutside"
              label="Receiver"
              name="toAddress"
              rules={{ required: true }}
              placeHolder={`Enter a ${
                getNetwork(networkId)?.displayName || networkId
              } name or address`}
              defaultValue=""
            />
          </SearchNSInputContainer>
        </FlexCol>
        <ContactButton />
      </FlexRow>

      <SpacerColumn size={2.5} />

      {!userId && (
        <>
          <DAOSelector
            value={selectedDAOId}
            onSelect={setSelectedDAOId}
            userId={selectedWallet?.userId}
          />
          <SpacerColumn size={2.5} />
        </>
      )}

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
        text={selectedUserKind === UserKind.Single ? "Send" : "Propose"}
        fullWidth
        disabled={max === "0"}
        loader
        onPress={handleSubmit(onPressSend)}
      />
      <SpacerColumn size={2.5} />
    </ModalBase>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
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
    marginLeft: layout.spacing_x1_5,
    //TODO: Remove that when contacts are handled
    opacity: 0.5,
  },
});
