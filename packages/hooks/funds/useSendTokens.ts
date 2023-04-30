import { Decimal } from "@cosmjs/math";
import { isDeliverTxFailure } from "@cosmjs/stargate";
import { useCallback } from "react";

import { useFeedbacks } from "../../context/FeedbacksProvider";
import { NetworkKind, getNativeCurrency, getNetwork } from "../../networks";
import { prettyPrice } from "../../utils/coins";
import { useWallet } from "../wallets/useWallet";
import { useWalletStargateClient } from "../wallets/useWalletClients";

export const useSendTokens = (senderWalletId: string | undefined) => {
  const stargateClient = useWalletStargateClient(senderWalletId);
  const wallet = useWallet(senderWalletId);
  const { setToastSuccess, setToastError } = useFeedbacks();
  return useCallback(
    async (
      targetAddress: string | null | undefined,
      denom: string | undefined,
      quantity: string,
      memo?: string
    ) => {
      try {
        if (getNetwork(wallet?.networkId)?.kind !== NetworkKind.Cosmos) {
          throw new Error("invalid wallet network");
        }
        if (!denom) {
          throw new Error("invalid denom");
        }
        if (!stargateClient) {
          throw new Error("no stargate client");
        }
        const sender = wallet?.address;
        if (!sender) {
          throw new Error("no sender");
        }
        const receiver = targetAddress;
        if (!receiver) {
          throw new Error("no receiver");
        }
        const nativeCurrency = getNativeCurrency(wallet?.networkId, denom);
        if (!nativeCurrency) {
          throw new Error("no native target currency");
        }

        const amount = Decimal.fromUserInput(
          quantity,
          nativeCurrency.decimals
        ).atomics;

        const tx = await stargateClient.sendTokens(
          sender,
          receiver,
          [{ amount, denom: nativeCurrency.denom }],
          "auto",
          memo
        );

        if (isDeliverTxFailure(tx)) {
          throw new Error("Transaction delivery failed");
        }

        setToastSuccess({
          title: `${prettyPrice(
            wallet?.networkId,
            amount,
            nativeCurrency.denom
          )} succesfully sent to ${receiver}`,
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
    },
    [
      setToastError,
      setToastSuccess,
      stargateClient,
      wallet?.address,
      wallet?.networkId,
    ]
  );
};
