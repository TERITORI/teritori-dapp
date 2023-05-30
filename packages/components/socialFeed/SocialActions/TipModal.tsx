import { coin } from "@cosmjs/amino";
import { Decimal } from "@cosmjs/math";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { View } from "react-native";

import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useTeritoriSocialFeedTipPostMutation } from "../../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.react-query";
import { useBalances } from "../../../hooks/useBalances";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { useWalletSocialFeedClient } from "../../../hooks/wallets/useWalletClients";
import {
  getStakingCurrency,
  keplrCurrencyFromNativeCurrencyInfo,
} from "../../../networks";
import { prettyPrice } from "../../../utils/coins";
import { defaultSocialFeedFee } from "../../../utils/fee";
import { neutral77, primaryColor } from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";
import { MaxButton } from "../../buttons/MaxButton";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { TextInputCustom } from "../../inputs/TextInputCustom";
import ModalBase from "../../modals/ModalBase";
import { SpacerColumn } from "../../spacer";

type TipFormType = {
  amount: string;
};

export const TipModal: React.FC<{
  author: string;
  postId: string;
  onClose: () => void;
  isVisible: boolean;
}> = ({ author, postId, onClose, isVisible }) => {
  const {
    control,
    handleSubmit: formHandleSubmit,
    setValue,
    watch,
  } = useForm<TipFormType>();
  const { mutate: postMutate, isLoading } =
    useTeritoriSocialFeedTipPostMutation({
      onSuccess() {
        onClose();
        setToastSuccess({ title: "Tip success", message: "" });
      },
      onError(error) {
        console.error(error);
        setToastError({ title: "Tip failed", message: error.message });
      },
    });
  const selectedWallet = useSelectedWallet();
  const selectedNetworkId = useSelectedNetworkId();
  const nativeCurrency = getStakingCurrency(selectedNetworkId);
  const { setToastError, setToastSuccess } = useFeedbacks();
  const balances = useBalances(selectedNetworkId, selectedWallet?.address);
  const currencyBalance = balances.find(
    (bal) => bal.denom === nativeCurrency?.denom
  );
  const getClient = useWalletSocialFeedClient(selectedWallet?.id);
  const formValues = watch();

  const handleSubmit: SubmitHandler<TipFormType> = async (fieldValues) => {
    if (!nativeCurrency) {
      return;
    }
    const amount = Decimal.fromUserInput(
      fieldValues.amount,
      nativeCurrency.decimals
    ).atomics;
    postMutate({
      client: await getClient(),
      msg: {
        identifier: postId,
      },
      args: {
        fee: defaultSocialFeedFee,
        memo: "",
        funds: [coin(amount, nativeCurrency.denom)],
      },
    });
  };

  const maxAtomics =
    balances.find((bal) => bal.denom === nativeCurrency?.denom)?.amount || "0";
  const max = Decimal.fromAtomics(
    maxAtomics,
    nativeCurrency?.decimals || 0
  ).toString();

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
        <BrandText style={fontSemibold14}>Send a tip to {author}</BrandText>
        <SpacerColumn size={2.5} />
        <TextInputCustom<TipFormType>
          name="amount"
          label={`${nativeCurrency?.displayName} AMOUNT ?`}
          control={control}
          placeHolder="Type your amount here"
          rules={{
            required: true,
            max,
          }}
          currency={keplrCurrencyFromNativeCurrencyInfo(nativeCurrency)}
          containerStyle={{ width: "100%" }}
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
          size="M"
          text="Send"
          fullWidth
          loader
          isLoading={isLoading}
          onPress={formHandleSubmit(handleSubmit)}
          disabled={
            max === "0" || !formValues.amount || formValues.amount === "0"
          }
        />
        <SpacerColumn size={2.5} />
      </View>
    </ModalBase>
  );
};
