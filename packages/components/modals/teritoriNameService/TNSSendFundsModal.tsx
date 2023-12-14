import { Decimal } from "@cosmjs/math";
import { isDeliverTxFailure } from "@cosmjs/stargate";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { View } from "react-native";

import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useTNS } from "../../../context/TNSProvider";
import { TeritoriNameServiceQueryClient } from "../../../contracts-clients/teritori-name-service/TeritoriNameService.client";
import { useBalances } from "../../../hooks/useBalances";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import {
  getKeplrSigningStargateClient,
  mustGetNonSigningCosmWasmClient,
  mustGetCosmosNetwork,
  getStakingCurrency,
  keplrCurrencyFromNativeCurrencyInfo,
} from "../../../networks";
import { prettyPrice } from "../../../utils/coins";
import { layout } from "../../../utils/style/layout";
import { TNSSendFundsFormType } from "../../../utils/types/tns";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { TextInputCustom } from "../../inputs/TextInputCustom";
import ModalBase from "../ModalBase";

export const TNSSendFundsModal: React.FC<{
  onClose: () => void;
  isVisible: boolean;
}> = ({ onClose, isVisible }) => {
  const { name } = useTNS();
  const { control, handleSubmit: formHandleSubmit } =
    useForm<TNSSendFundsFormType>();
  const selectedWallet = useSelectedWallet();
  const networkId = selectedWallet?.networkId;
  const nativeCurrency = getStakingCurrency(networkId);
  const { setToastError, setToastSuccess } = useFeedbacks();
  const balances = useBalances(networkId, selectedWallet?.address);
  const currencyBalance = balances.find(
    (bal) => bal.denom === nativeCurrency?.denom,
  );

  const handleSubmit: SubmitHandler<TNSSendFundsFormType> = async (
    fieldValues,
  ) => {
    try {
      if (!nativeCurrency) {
        setToastError({
          title: "Internal error",
          message: "Currency not found",
        });
        onClose();
        return;
      }

      if (!networkId) {
        setToastError({
          title: "Internal error",
          message: "Invalid teritori network id",
        });
        onClose();
        return;
      }

      // get contract address
      const network = mustGetCosmosNetwork(networkId);
      const contractAddress = network.nameServiceContractAddress;

      if (!contractAddress) {
        setToastError({
          title: "Internal error",
          message: "No TNS contract address",
        });
        onClose();
        return;
      }

      // get sender address
      const sender = selectedWallet?.address;
      if (!sender) {
        setToastError({
          title: "Internal error",
          message: "No sender address",
        });
        onClose();
        return;
      }

      // get token id
      const tokenId = name + network.nameServiceTLD || "";

      // get tns client
      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(networkId);
      const tnsClient = new TeritoriNameServiceQueryClient(
        cosmwasmClient,
        contractAddress,
      );

      // get recipient address
      const { owner: recipientAddress } = await tnsClient.ownerOf({ tokenId });

      // get stargate client
      const client = await getKeplrSigningStargateClient(networkId);

      // send tokens
      const response = await client.sendTokens(
        sender,
        recipientAddress,
        [
          {
            denom: nativeCurrency.denom,
            amount: Decimal.fromUserInput(
              fieldValues.amount,
              nativeCurrency.decimals,
            ).atomics,
          },
        ],
        "auto",
        fieldValues.comment,
      );
      if (isDeliverTxFailure(response)) {
        setToastError({ title: "Send failed", message: response.rawLog || "" });
        onClose();
        return;
      }

      // signal success
      setToastSuccess({ title: "Send success", message: "" });
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setToastError({ title: "Send failed", message: err.message });
      }
    }
    onClose();
  };

  return (
    <ModalBase
      visible={isVisible}
      onClose={onClose}
      width={400}
      label={`Your wallet has ${prettyPrice(
        selectedWallet?.networkId || "",
        currencyBalance?.amount || "0",
        currencyBalance?.denom || "",
      )}`}
    >
      <View
        style={{
          alignItems: "center",
        }}
      >
        <TextInputCustom<TNSSendFundsFormType>
          name="comment"
          label="COMMENT ?"
          control={control}
          defaultValue="Sent from Teritori"
          placeHolder="Type your comment here"
          containerStyle={{ marginBottom: layout.spacing_x1_5, width: "100%" }}
        />

        <TextInputCustom<TNSSendFundsFormType>
          name="amount"
          label={`${nativeCurrency?.displayName} AMOUNT ?`}
          control={control}
          placeHolder="Type your amount here"
          rules={{
            max: Decimal.fromAtomics(
              currencyBalance?.amount || "0",
              nativeCurrency?.decimals || 0,
            ).toString(),
            required: true,
          }}
          currency={keplrCurrencyFromNativeCurrencyInfo(nativeCurrency)}
          containerStyle={{ width: "100%" }}
        />
        <PrimaryButton
          size="M"
          text="Send"
          boxStyle={{
            marginVertical: 20,
          }}
          fullWidth
          loader
          onPress={formHandleSubmit(handleSubmit)}
        />
      </View>
    </ModalBase>
  );
};
