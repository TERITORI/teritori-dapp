import { Decimal } from "@cosmjs/math";
import { MsgSendEncodeObject } from "@cosmjs/stargate";
import { GnoJSONRPCProvider, MsgSend } from "@gnolang/gno-js-client";
import { TxFee } from "@gnolang/tm2-js-client";
import { useQueryClient } from "@tanstack/react-query";
import Long from "long";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

import ModalBase from "./ModalBase";
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
import { prettyPrice } from "../../utils/coins";
import { neutral77, primaryColor } from "../../utils/style/colors";
import { fontSemibold13 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import FlexRow from "../FlexRow";
import { NetworkIcon } from "../NetworkIcon";
import { MaxButton } from "../buttons/MaxButton";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { DAOSelector } from "../dao/DAOSelector";
import { SearchNSInputContainer } from "../inputs/SearchNSInputContainer";
import { TextInputCustom } from "../inputs/TextInputCustom";
import { SpacerColumn, SpacerRow } from "../spacer";

import { useMultisigAuthToken } from "@/hooks/multisig/useMultisigAuthToken";
import { useMultisigClient } from "@/hooks/multisig/useMultisigClient";
import { multisigTransactionsQueryKey } from "@/hooks/multisig/useMultisigTransactions";
import { multisigTransactionsCountsQueryKey } from "@/hooks/multisig/useMultisigTransactionsCounts";
import { TransactionForm } from "@/utils/types/wallet";

type SendModalProps = {
  isVisible: boolean;
  nativeCurrency?: NativeCurrencyInfo;
  onClose: () => void;
  userId?: string;
  userKind: UserKind;
};

export const SendModal: React.FC<SendModalProps> = ({
  isVisible,
  onClose,
  nativeCurrency,
  userId,
  userKind,
}) => {
  const { setToastError, setToastSuccess } = useFeedbacks();
  const selectedWallet = useSelectedWallet();
  const { control, setValue, handleSubmit, watch } = useForm<TransactionForm>();
  const toAddress = watch("toAddress");
  const amount = watch("amount");
  const [selectedDAOId, setSelectedDAOId] = useState("");
  const selectedUserKind = selectedDAOId ? UserKind.Organization : userKind;
  const selectedUserId =
    selectedUserKind === UserKind.Single
      ? selectedWallet?.userId
      : selectedDAOId || userId;
  const runOrProposeTransaction = useRunOrProposeTransaction(
    selectedUserId,
    selectedUserKind,
  );
  const [userNetwork, userAddress] = parseUserId(selectedUserId);
  const networkId = userNetwork?.id;
  const { balances } = useBalances(userNetwork?.id, userAddress);
  const multisigAuthToken = useMultisigAuthToken(selectedWallet?.userId);
  const multisigClient = useMultisigClient(networkId);
  const queryClient = useQueryClient();

  const ModalHeader = useCallback(
    () => (
      <FlexRow alignItems="center" width="auto">
        <NetworkIcon networkId={networkId} size={32} />
        <SpacerRow size={3} />
        <BrandText>{`Send ${nativeCurrency?.displayName}`}</BrandText>
      </FlexRow>
    ),
    [networkId, nativeCurrency?.displayName],
  );

  const maxAtomics =
    balances.find((bal) => bal.denom === nativeCurrency?.denom)?.amount || "0";
  const max = Decimal.fromAtomics(
    maxAtomics,
    nativeCurrency?.decimals || 0,
  ).toString();

  const onPressSend = async (formData: TransactionForm) => {
    try {
      const receiver = formData.toAddress;
      //TODO: handle contacts
      if (!receiver) {
        throw new Error("no receiver");
      }
      if (!nativeCurrency) {
        throw new Error("no native target currency");
      }

      const amount = Decimal.fromUserInput(
        formData.amount,
        nativeCurrency.decimals,
      ).atomics;

      if (userNetwork?.kind === NetworkKind.Gno) {
        const sender = selectedWallet?.address;
        switch (userKind) {
          case UserKind.Single: {
            if (!sender) {
              throw new Error("no sender");
            }
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
            break;
          }

          case UserKind.Multisig: {
            const sender = userAddress;
            if (!sender) {
              throw new Error("no sender");
            }
            const client = new GnoJSONRPCProvider(userNetwork.endpoint);

            const account = await client.getAccount(userAddress);

            // XXX: find good values
            const fee = TxFee.create({
              gas_wanted: Long.fromString("500000"),
              gas_fee: "500ugnot",
            });

            const encodedMsg = MsgSend.encode({
              from_address: sender,
              to_address: receiver,
              amount: `${amount}ugnot`,
            }).finish();

            await multisigClient.CreateTransaction({
              chainType: userNetwork.kind.toLowerCase(),
              authToken: multisigAuthToken,
              multisigAddress: userAddress,
              chainId: userNetwork.chainId,
              feeJson: JSON.stringify(TxFee.toJSON(fee)),
              msgs: [
                {
                  typeUrl: "/bank.MsgSend",
                  value: encodedMsg,
                },
              ],
              sequence: parseInt(account.BaseAccount.sequence, 10),
              accountNumber: parseInt(account.BaseAccount.account_number, 10),
            });
            await queryClient.invalidateQueries([
              ...multisigTransactionsQueryKey(networkId, userId),
            ]);
            await queryClient.invalidateQueries([
              ...multisigTransactionsQueryKey(networkId, undefined),
            ]);
            await queryClient.invalidateQueries([
              ...multisigTransactionsCountsQueryKey(networkId),
            ]);
            break;
          }

          default: {
            throw new Error(`unexpected user kind ${userKind}`);
          }
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
            nativeCurrency.denom,
          )} to ${receiver}`,
        });
      }
      setToastSuccess({
        title: `${
          selectedUserKind === UserKind.Single ? "Sent" : "Proposed to send"
        } ${prettyPrice(
          networkId,
          amount,
          nativeCurrency.denom,
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
      <SearchNSInputContainer
        onPressName={(userId) => {
          const [, userAddress] = parseUserId(userId);
          setValue("toAddress", userAddress);
        }}
        searchText={toAddress}
      >
        <TextInputCustom<TransactionForm>
          height={48}
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

      <SpacerColumn size={2.5} />

      {!userId && (
        <DAOSelector
          onSelect={setSelectedDAOId}
          userId={selectedWallet?.userId}
          style={{ marginBottom: layout.spacing_x2_5 }}
        />
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
        disabled={max === "0" || !toAddress || !amount}
        loader
        onPress={handleSubmit(onPressSend)}
      />
      <SpacerColumn size={2.5} />
    </ModalBase>
  );
};
