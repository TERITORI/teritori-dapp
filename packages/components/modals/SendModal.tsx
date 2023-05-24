import { Decimal } from "@cosmjs/math";
import { isDeliverTxFailure } from "@cosmjs/stargate";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, TouchableOpacity } from "react-native";

import ModalBase from "./ModalBase";
import contactsSVG from "../../../assets/icons/contacts.svg";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { DaoCoreQueryClient } from "../../contracts-clients/dao-core/DaoCore.client";
import { DaoPreProposeSingleClient } from "../../contracts-clients/dao-pre-propose-single/DaoPreProposeSingle.client";
import { DaoProposalSingleQueryClient } from "../../contracts-clients/dao-proposal-single/DaoProposalSingle.client";
import { useDAOs } from "../../hooks/dao/useDAOs";
import { useBalances } from "../../hooks/useBalances";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  getKeplrSigningCosmWasmClient,
  getKeplrSigningStargateClient,
  keplrCurrencyFromNativeCurrencyInfo,
  mustGetNonSigningCosmWasmClient,
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
import { DAOSelector } from "../dao/DAOSelector";
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
  const [selectedDAOAddress, setSelectedDAOAddress] = useState("");
  const { daos } = useDAOs(networkId, {
    MemberAddress: selectedWallet?.address,
  });

  const balances = useBalances(
    networkId,
    selectedDAOAddress || selectedWallet?.address
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
      if (!sender) {
        throw new Error("no sender");
      }
      //TODO: handle contacts
      const receiver = formData.toAddress;
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

      if (selectedDAOAddress) {
        // DAO send
        const selectedDAO = daos?.find(
          (dao) => dao.address === selectedDAOAddress
        );
        if (!selectedDAO) {
          throw new Error("no selected DAO");
        }
        const cosmwasmClient = await mustGetNonSigningCosmWasmClient(networkId);
        const daoCoreClient = new DaoCoreQueryClient(
          cosmwasmClient,
          selectedDAOAddress
        );
        const proposalModuleAddress = (
          await daoCoreClient.proposalModules({})
        )[0].address;
        const proposalModuleClient = new DaoProposalSingleQueryClient(
          cosmwasmClient,
          proposalModuleAddress
        );
        const policy = await proposalModuleClient.proposalCreationPolicy();
        if (!("module" in policy)) throw new Error("Invalid policy");
        const signingClient = await getKeplrSigningCosmWasmClient(networkId);
        const daoProposalBaseClient = new DaoPreProposeSingleClient(
          signingClient,
          sender,
          policy.module.addr
        );
        await daoProposalBaseClient.propose(
          {
            msg: {
              propose: {
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
                        from_address: selectedDAOAddress,
                        to_address: receiver,
                        amount: [{ amount, denom: nativeCurrency.denom }],
                      },
                    },
                  },
                ],
              },
            },
          },
          "auto"
        );
        setToastSuccess({
          title: "Proposal created",
          message: "",
        });
      } else {
        // simple send
        const client = await getKeplrSigningStargateClient(networkId);

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
        setToastSuccess({
          title: `TORI succeeded sent to ${receiver}`,
          message: "",
        });
        // FIXME: find out if it's possible to check for ibc ack
      }
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
            placeHolder="Enter a TERITORI address"
            defaultValue=""
          />
        </FlexCol>
        <ContactButton />
      </FlexRow>

      <SpacerColumn size={2.5} />

      <DAOSelector
        value={selectedDAOAddress}
        onSelect={setSelectedDAOAddress}
        userId={selectedWallet?.userId}
      />

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
        text={selectedDAOAddress ? "Propose" : "Send"}
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
