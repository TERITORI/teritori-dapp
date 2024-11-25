import React, { FC, useEffect, useMemo } from "react";
import { Linking, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { MultisigTransactionItemProps } from "./MultisigTransactionItem";
import { useApproveTransaction } from "../../hooks/multisig/useApproveTransaction";
import { useBroadcastTransaction } from "../../hooks/multisig/useBroadcastTransaction";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { txExplorerLink } from "../../networks";
import {
  neutral77,
  primaryColor,
  successColor,
} from "../../utils/style/colors";
import { fontMedium14, fontSemibold9 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { tinyAddress } from "../../utils/text";
import { BrandText } from "../BrandText";
import { AnimationFadeIn } from "../animations/AnimationFadeIn";
import { SecondaryButton } from "../buttons/SecondaryButton";
import { SecondaryButtonOutline } from "../buttons/SecondaryButtonOutline";
import { MainConnectWalletButton } from "../connectWallet/MainConnectWalletButton";

export const MultisigTransactionActions: React.FC<
  MultisigTransactionItemProps
> = ({
  btnSquaresBackgroundColor,
  signatures,
  chainId,
  multisigPubkeyJson,
  id,
  finalHash: txHash,
  multisigAddress,
  threshold,
  fee,
  accountNumber,
  msgs,
  sequence,
  memo,
  shouldRetch,
}) => {
  const wallet = useSelectedWallet();
  const selectedNetworkId = useSelectedNetworkId();
  const approve = useApproveTransaction();
  const {
    mutate: broadcast,
    isLoading: isBroacasting,
    data: resTxHash,
  } = useBroadcastTransaction();

  const hasSigned = useMemo(
    () => signatures?.some((sig) => sig.userAddress === wallet?.address),
    [signatures, wallet?.address],
  );

  const isCompletedSignature = signatures.length >= threshold;

  useEffect(() => {
    if (resTxHash) {
      shouldRetch && shouldRetch();
    }
  }, [resTxHash, shouldRetch]);

  const onApprove = () =>
    approve({
      tx: {
        chainId,
        multisigAddress,
        fee,
        accountNumber,
        msgs,
        sequence,
        memo,
      },
      currentSignatures: signatures,
      transactionId: id,
    });

  const onBroadcast = () =>
    broadcast({
      tx: {
        fee,
        sequence,
        chainId,
        multisigAddress,
      },
      currentSignatures: signatures,
      // FIXME: sanitize
      // eslint-disable-next-line no-restricted-syntax
      pubkey: JSON.parse(multisigPubkeyJson),
      transactionId: id,
    });

  if (wallet?.address === undefined) {
    return <MainConnectWalletButton size="M" />;
  }

  if ((hasSigned && !isCompletedSignature) || txHash || resTxHash) {
    const color = (() => {
      if (txHash || resTxHash) return successColor;
      if (hasSigned) return primaryColor;
    })();

    const resultText = (() => {
      if (txHash || resTxHash) return "EXECUTED";
      if (hasSigned) return "APPROVED";
    })();

    const Result: FC = () => (
      <View
        style={{
          width: 200,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <BrandText
          style={[
            StyleSheet.flatten([fontMedium14, { textTransform: "uppercase" }]),
            { color },
          ]}
        >
          {resultText}
        </BrandText>
      </View>
    );

    return (
      <AnimationFadeIn style={containerStyles}>
        {txHash || resTxHash ? (
          <Pressable
            onPress={() =>
              Linking.openURL(
                txExplorerLink(selectedNetworkId, txHash || resTxHash || ""),
              )
            }
          >
            <Result />
            <BrandText
              style={StyleSheet.flatten([
                fontSemibold9,
                {
                  marginTop: layout.spacing_x0_25,
                  color: neutral77,
                  flexWrap: "wrap",
                  width: "100%",
                  textAlign: "center",
                },
              ])}
            >
              {tinyAddress(txHash || resTxHash, 14)}
            </BrandText>
          </Pressable>
        ) : (
          <Result />
        )}
      </AnimationFadeIn>
    );
  }

  if (isCompletedSignature) {
    return (
      <AnimationFadeIn style={containerStyles}>
        <SecondaryButtonOutline
          text="Broadcast"
          size="M"
          squaresBackgroundColor={btnSquaresBackgroundColor}
          color={successColor}
          borderColor={successColor}
          isLoading={isBroacasting}
          onPress={onBroadcast}
        />
      </AnimationFadeIn>
    );
  }

  return (
    <AnimationFadeIn style={containerStyles}>
      <SecondaryButton text="Approve" size="M" loader onPress={onApprove} />
    </AnimationFadeIn>
  );
};

const containerStyles: ViewStyle = {
  width: 200,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
};
