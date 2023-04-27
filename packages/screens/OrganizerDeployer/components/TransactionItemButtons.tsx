import React, { useEffect, useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

import { ProposalTransactionItemProps } from "./ProposalTransactionItem";
import copySVG from "../../../../assets/icons/copy.svg";
import { BrandText } from "../../../components/BrandText";
import { useCopyToClipboard } from "../../../components/CopyToClipboard";
import { EmptyList } from "../../../components/EmptyList";
import { SVG } from "../../../components/SVG";
import { AnimationFadeIn } from "../../../components/animations";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import { SecondaryButtonOutline } from "../../../components/buttons/SecondaryButtonOutline";
import { MainConnectWalletButton } from "../../../components/connectWallet/MainConnectWalletButton";
import { SpacerRow } from "../../../components/spacer";
import {
  useApproveTransaction,
  useBrodcastTransaction,
  useDeclineTransaction,
} from "../../../hooks/multisig";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { DbSignature } from "../../../utils/founaDB/multisig/types";
import {
  errorColor,
  neutral00,
  neutral77,
  primaryColor,
  secondaryColor,
  successColor,
} from "../../../utils/style/colors";
import { fontMedium14, fontSemibold9 } from "../../../utils/style/fonts";
import { tinyAddress } from "../../../utils/text";

interface TransactionItemButtonsProps extends ProposalTransactionItemProps {
  currentSignatures: DbSignature[];
  currentDecliners: string[];
  addSignature: (signature: DbSignature) => void;
  addDecliner: (address: string) => void;
  isCompletedSignature: boolean;
  isCompletelyDeclined: boolean;
}

export const TransactionItemButtons: React.FC<TransactionItemButtonsProps> = ({
  btnSquaresBackgroundColor,
  currentDecliners,
  currentSignatures,
  addSignature,
  addDecliner,
  _id,
  isCompletedSignature,
  txHash,
  isCompletelyDeclined,
  multisig,
  isUserMultisig,
  fee,
  accountNumber,
  msgs,
  sequence,
  memo,
  shouldRetch,
}) => {
  // variables
  const { selectedWallet: wallet } = useSelectedWallet();
  const { mutate: approve } = useApproveTransaction();
  const { mutate: decline, isLoading: isDeclining } = useDeclineTransaction();
  const {
    mutate: broadcast,
    isLoading: isBroacasting,
    data: resTxHash,
  } = useBrodcastTransaction();
  const { copyToClipboard } = useCopyToClipboard();

  const hasSigned = useMemo(
    () => currentSignatures?.some((sig) => sig.address === wallet?.address),
    [currentSignatures, wallet?.address]
  );

  const hasDeclined = useMemo(
    () =>
      currentDecliners?.some((address) => address === wallet?.address) ||
      isCompletelyDeclined,
    [currentDecliners, isCompletelyDeclined, wallet?.address]
  );

  // hooks
  useEffect(() => {
    if (resTxHash) {
      shouldRetch && shouldRetch();
    }
  }, [resTxHash, shouldRetch]);

  // functions
  const onApprove = () =>
    approve({
      tx: {
        fee,
        accountNumber,
        msgs,
        sequence,
        memo,
      },
      currentSignatures,
      addSignature,
      transactionID: _id,
    });

  const onDecline = async () =>
    decline({
      currentDecliners,
      transactionID: _id,
      addDecliner,
    });

  const onBrodcast = () =>
    broadcast({
      tx: {
        fee,
        sequence,
      },
      currentSignatures,
      pubkey: JSON.parse(multisig.pubkeyJSON),
      transactionID: _id,
    });

  // returns
  if (wallet?.address === undefined) {
    return <MainConnectWalletButton size="M" />;
  }

  if (isUserMultisig === undefined) {
    return (
      <AnimationFadeIn style={styles.container}>
        <ActivityIndicator color={secondaryColor} />
      </AnimationFadeIn>
    );
  }

  if (isUserMultisig === false) {
    return (
      <View style={styles.container}>
        <EmptyList text="Connected wallet address doesn't to match any available multisig user address." />
      </View>
    );
  }

  if (
    (hasDeclined && !isCompletedSignature) ||
    (hasSigned && !isCompletedSignature) ||
    txHash ||
    resTxHash
  ) {
    const color = (() => {
      if (txHash || resTxHash) return successColor;
      if (hasDeclined) return errorColor;
      if (hasSigned) return primaryColor;
    })();

    const resultText = (() => {
      if (txHash || resTxHash) return "BROADCASTED";
      if (hasDeclined) return "DECLINED";
      if (hasSigned) return "APPROVED";
    })();

    return (
      <AnimationFadeIn style={styles.container}>
        <Pressable
          onPress={() => copyToClipboard(txHash || resTxHash || "")}
          style={[
            styles.resultContainer,
            {
              borderColor: color,
            },
          ]}
        >
          <BrandText style={[styles.resultText, { color }]}>
            {resultText}
          </BrandText>
          {(txHash || resTxHash) && (
            <View style={styles.txHashTextContainer}>
              <SVG width={20} height={20} source={copySVG} />
              <SpacerRow size={0.5} />
              <BrandText style={styles.txHashText}>
                {tinyAddress(txHash || resTxHash, 14)}
              </BrandText>
            </View>
          )}
        </Pressable>
      </AnimationFadeIn>
    );
  }

  if (isCompletedSignature) {
    return (
      <AnimationFadeIn style={styles.container}>
        <SecondaryButtonOutline
          text="Broadcast"
          size="M"
          squaresBackgroundColor={btnSquaresBackgroundColor}
          color={successColor}
          borderColor={successColor}
          isLoading={isBroacasting}
          onPress={onBrodcast}
        />
      </AnimationFadeIn>
    );
  }

  return (
    <AnimationFadeIn style={styles.container}>
      <SecondaryButton
        text="Approve"
        size="M"
        squaresBackgroundColor={btnSquaresBackgroundColor}
        loader
        onPress={onApprove}
      />
      <SpacerRow size={2} />
      <SecondaryButtonOutline
        text="Decline"
        size="M"
        squaresBackgroundColor={btnSquaresBackgroundColor}
        color={errorColor}
        borderColor={errorColor}
        backgroundColor={neutral00}
        onPress={onDecline}
        autoLoader
        isLoading={isDeclining}
      />
    </AnimationFadeIn>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  resultContainer: {
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  resultText: StyleSheet.flatten([
    fontMedium14,
    { textTransform: "uppercase" },
  ]),
  txHashTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  txHashText: StyleSheet.flatten([
    fontSemibold9,
    {
      color: neutral77,
      flexWrap: "wrap",
      width: "100%",
      textAlign: "center",
    },
  ]),
});
