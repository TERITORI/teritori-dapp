import { coin } from "@cosmjs/amino";
import { Decimal } from "@cosmjs/math";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { View } from "react-native";

import { signingSocialFeedClient } from "../../../client-creators/socialFeedClient";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useTeritoriSocialFeedTipPostMutation } from "../../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.react-query";
import { useBalances } from "../../../hooks/useBalances";
import {
  useSelectedNetworkId,
  useSelectedNetworkInfo,
} from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import {
  getStakingCurrency,
  keplrCurrencyFromNativeCurrencyInfo,
  NetworkKind,
  parseNetworkObjectId,
} from "../../../networks";
import { prettyPrice } from "../../../utils/coins";
import { defaultSocialFeedFee } from "../../../utils/fee";
import {
  adenaDoContract,
  AdenaDoContractMessageType,
} from "../../../utils/gno";
import { neutral77, primaryColor } from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";
import { MaxButton } from "../../buttons/MaxButton";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { TextInputCustom } from "../../inputs/TextInputCustom";
import ModalBase from "../../modals/ModalBase";
import { SpacerColumn } from "../../spacer";

import { Username } from "@/components/user/Username";
import { sanitizeFloatText } from "@/utils/text";

type TipFormType = {
  amount: string;
};

export const TipModal: React.FC<{
  authorId: string;
  postId: string;
  onClose: (addedTipAmount?: number) => void;
  isVisible: boolean;
}> = ({ authorId, postId, onClose, isVisible }) => {
  const selectedNetworkId = useSelectedNetworkId();
  const nativeCurrency = getStakingCurrency(selectedNetworkId);
  const {
    control,
    handleSubmit: formHandleSubmit,
    setValue,
    watch,
  } = useForm<TipFormType>({
    defaultValues: {
      amount: "",
    },
  });
  const formValues = watch();
  const amount = nativeCurrency
    ? Decimal.fromUserInput(
        sanitizeFloatText(formValues.amount),
        nativeCurrency.decimals,
      ).atomics
    : "0";

  const { mutate: postMutate, isLoading } =
    useTeritoriSocialFeedTipPostMutation({
      onMutate() {
        setLocalLoading(true);
      },
      onSuccess() {
        setToast({
          mode: "normal",
          type: "success",
          title: "Tip success",
          message: "",
        });
      },
      onError(error) {
        console.error(error);
        setToast({
          mode: "normal",
          type: "error",
          title: "Tip failed",
          message: error.message,
        });
      },

      onSettled() {
        onClose(+amount);
        setLocalLoading(false);
      },
    });
  const [islocalLoading, setLocalLoading] = useState(isLoading);
  const selectedWallet = useSelectedWallet();
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const { setToast } = useFeedbacks();
  const { balances } = useBalances(selectedNetworkId, selectedWallet?.address);
  const currencyBalance = balances.find(
    (bal) => bal.denom === nativeCurrency?.denom,
  );

  const handleSubmit: SubmitHandler<TipFormType> = async () => {
    if (
      !selectedWallet?.connected ||
      !selectedWallet.address ||
      !nativeCurrency
    ) {
      return;
    }

    if (selectedNetworkInfo?.kind === NetworkKind.Gno) {
      // We use Tip function from Social_feed contract to keep track of tip amount
      const vmCall = {
        caller: selectedWallet.address,
        send: `${amount}ugnot`,
        pkg_path: selectedNetworkInfo.socialFeedsPkgPath,
        func: "TipPost",
        args: [
          selectedNetworkInfo.socialFeedsFeedId || "",
          parseNetworkObjectId(postId)[1],
        ],
      };

      try {
        setLocalLoading(true);
        await adenaDoContract(
          selectedNetworkId || "",
          [{ type: AdenaDoContractMessageType.CALL, value: vmCall }],
          {
            gasWanted: 1_000_000,
          },
        );

        setToast({
          mode: "normal",
          type: "success",
          title: "Tip success",
          message: "",
        });
      } catch (err: any) {
        console.error(err);
        setToast({
          mode: "normal",
          type: "error",
          title: "Tip failed",
          message: err.message,
        });
      } finally {
        onClose(+amount);
        setLocalLoading(false);
      }
    } else {
      const client = await signingSocialFeedClient({
        networkId: selectedNetworkId,
        walletAddress: selectedWallet.address,
      });

      postMutate({
        client,
        msg: {
          identifier: parseNetworkObjectId(postId)[1],
        },
        args: {
          fee: defaultSocialFeedFee,
          memo: "",
          funds: [coin(amount, nativeCurrency.denom)],
        },
      });
    }
  };

  const maxAtomics =
    balances.find((bal) => bal.denom === nativeCurrency?.denom)?.amount || "0";
  const max = Decimal.fromAtomics(
    maxAtomics,
    nativeCurrency?.decimals || 0,
  ).toString();

  return (
    <ModalBase
      visible={isVisible}
      onClose={() => onClose()}
      width={400}
      label={`Your wallet has ${prettyPrice(
        selectedNetworkInfo?.id,
        currencyBalance?.amount || "0",
        nativeCurrency?.denom,
      )}`}
    >
      <View
        style={{
          alignItems: "center",
        }}
      >
        <BrandText style={fontSemibold14}>
          Send a tip to{" "}
          <Username textStyle={fontSemibold14} userId={authorId} />
        </BrandText>
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
          isLoading={islocalLoading}
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
