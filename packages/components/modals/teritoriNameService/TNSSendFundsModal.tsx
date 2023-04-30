import { Decimal } from "@cosmjs/math";
import React, { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { View } from "react-native";

import { useTNS } from "../../../context/TNSProvider";
import { useSendTokens } from "../../../hooks/funds/useSendTokens";
import { useNSNameOwner } from "../../../hooks/name-service/useNSNameOwner";
import { useBalances } from "../../../hooks/useBalances";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import {
  getStakingCurrency,
  keplrCurrencyFromNativeCurrencyInfo,
  getCosmosNetwork,
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
  const stakingCurrency = getStakingCurrency(networkId);
  const balances = useBalances(networkId, selectedWallet?.address);
  const currencyBalance = balances.find(
    (bal) => bal.denom === stakingCurrency?.denom
  );
  const sendTokens = useSendTokens(selectedWallet?.id);
  const network = getCosmosNetwork(networkId);
  const tokenId = name + network?.nameServiceTLD || "";
  const { nameOwner } = useNSNameOwner(network?.id, tokenId);

  const handleSubmit: SubmitHandler<TNSSendFundsFormType> = useCallback(
    async (fieldValues) => {
      await sendTokens(
        nameOwner,
        stakingCurrency?.denom,
        fieldValues.amount,
        fieldValues.comment
      );
      onClose();
    },
    [nameOwner, stakingCurrency?.denom, onClose, sendTokens]
  );

  return (
    <ModalBase
      visible={isVisible}
      onClose={onClose}
      width={400}
      label={`Your wallet has ${prettyPrice(
        selectedWallet?.networkId || "",
        currencyBalance?.amount || "0",
        currencyBalance?.denom || ""
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
          containerStyle={{ marginBottom: layout.padding_x1_5, width: "100%" }}
        />

        <TextInputCustom<TNSSendFundsFormType>
          name="amount"
          label={`${stakingCurrency?.displayName} AMOUNT ?`}
          control={control}
          placeHolder="Type your amount here"
          rules={{
            max: Decimal.fromAtomics(
              currencyBalance?.amount || "0",
              stakingCurrency?.decimals || 0
            ).toString(),
            required: true,
          }}
          currency={keplrCurrencyFromNativeCurrencyInfo(stakingCurrency)}
          containerStyle={{ width: "100%" }}
        />

        <PrimaryButton
          size="M"
          text="Send"
          style={{
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
