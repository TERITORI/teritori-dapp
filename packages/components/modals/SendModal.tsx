import { Decimal } from "@cosmjs/math";
import { isDeliverTxFailure } from "@cosmjs/stargate";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

import ModalBase from "./ModalBase";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useDAOMakeProposal } from "../../hooks/dao/useDAOMakeProposal";
import { useDAOs } from "../../hooks/dao/useDAOs";
import { useBalances } from "../../hooks/useBalances";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  getKeplrSigningStargateClient,
  getNetwork,
  keplrCurrencyFromNativeCurrencyInfo,
  NativeCurrencyInfo,
  parseUserId,
} from "../../networks";
import { TransactionForm } from "../../screens/WalletManager/types";
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

type SendModalProps = {
  isVisible: boolean;
  nativeCurrency?: NativeCurrencyInfo;
  networkId: string;
  onClose: () => void;
};

export const SendModal: React.FC<SendModalProps> = ({
  isVisible,
  onClose,
  nativeCurrency,
  networkId,
}) => {
  const { setToastError, setToastSuccess } = useFeedbacks();
  const selectedWallet = useSelectedWallet();
  const { control, setValue, handleSubmit, watch } = useForm<TransactionForm>();
  const toAddress = watch("toAddress");
  const amount = watch("amount");
  const [selectedDAOId, setSelectedDAOId] = useState("");
  const makeProposal = useDAOMakeProposal(selectedDAOId);
  const [, daoAddress] = parseUserId(selectedDAOId);
  const { daos } = useDAOs({
    networkId,
    memberAddress: selectedWallet?.address,
  });

  const balances = useBalances(
    networkId,
    daoAddress || selectedWallet?.address
  );

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

      if (selectedDAOId) {
        // DAO send
        const selectedDAO = daos?.find((dao) => dao.id === selectedDAOId);
        if (!selectedDAO) {
          throw new Error("no selected DAO");
        }
        await makeProposal(sender, {
          title: `Send ${prettyPrice(
            networkId,
            amount,
            nativeCurrency.denom
          )} to ${receiver}`,
          description: "",
          msgs: [
            {
              bank: {
                send: {
                  from_address: selectedDAOId,
                  to_address: receiver,
                  amount: [{ amount, denom: nativeCurrency.denom }],
                },
              },
            },
          ],
        });
        setToastSuccess({
          title: "Proposal created",
          message: "",
        });
      } else if (networkId === "gno-testnet") {
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
        const client = await getKeplrSigningStargateClient(networkId);

        const tx = await client.sendTokens(
          sender,
          receiver,
          [{ amount, denom: nativeCurrency.denom }],
          "auto"
        );
        if (isDeliverTxFailure(tx)) {
          throw new Error("Transaction failed");
        }
      }
      setToastSuccess({
        title: `Sent ${prettyPrice(
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

      <DAOSelector
        onSelect={setSelectedDAOId}
        userId={selectedWallet?.userId}
        style={{ marginBottom: layout.spacing_x2_5 }}
      />

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
        text={selectedDAOId ? "Propose" : "Send"}
        fullWidth
        disabled={max === "0" || !toAddress || !amount}
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
