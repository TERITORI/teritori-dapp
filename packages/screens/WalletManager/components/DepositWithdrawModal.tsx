import { Decimal } from "@cosmjs/math";
import { isDeliverTxFailure } from "@cosmjs/stargate";
import { bech32 } from "bech32";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

import arrowDivideSVG from "../../../../assets/icons/arrow-divide.svg";
import { BrandText } from "../../../components/BrandText";
import { NetworkIcon } from "../../../components/NetworkIcon";
import { SVG } from "../../../components/SVG";
import { MaxButton } from "../../../components/buttons/MaxButton";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useBalances } from "../../../hooks/useBalances";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import {
  getCosmosNetwork,
  getIBCCurrency,
  getKeplrSigningStargateClient,
  getNativeCurrency,
  getNetwork,
  keplrCurrencyFromNativeCurrencyInfo,
} from "../../../networks";
import { neutral77, primaryColor } from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { capitalize, tinyAddress } from "../../../utils/text";
import { TransactionForm } from "../types";

type DepositModalProps = {
  variation: "deposit" | "withdraw";
  isVisible: boolean;
  targetCurrency?: string;
  networkId: string;
  onClose: () => void;
};

export const DepositWithdrawModal: React.FC<DepositModalProps> = ({
  variation,
  isVisible,
  onClose,
  targetCurrency: targetCurrencyDenom,
  networkId,
}) => {
  const { setToastError } = useFeedbacks();

  const selectedWallet = useSelectedWallet(); // FIXME: this could not match networkId

  const ibcTargetCurrency = getIBCCurrency(networkId, targetCurrencyDenom);

  const nativeTargetCurrency = getNativeCurrency(
    ibcTargetCurrency?.sourceNetwork,
    ibcTargetCurrency?.sourceDenom,
  );

  const sourceNetworkId =
    variation === "withdraw" ? networkId : ibcTargetCurrency?.sourceNetwork;
  const sourceNetwork = getNetwork(sourceNetworkId);
  const destinationNetworkId =
    variation === "withdraw" ? ibcTargetCurrency?.sourceNetwork : networkId;
  const destinationNetwork = getNetwork(destinationNetworkId);

  const fromAccount =
    variation === "withdraw"
      ? selectedWallet?.address
      : convertCosmosAddress(selectedWallet?.address, sourceNetworkId);
  const toAccount =
    variation === "withdraw"
      ? convertCosmosAddress(selectedWallet?.address, destinationNetworkId)
      : selectedWallet?.address;

  const balances = useBalances(sourceNetworkId, fromAccount);

  const { control, setValue, handleSubmit } = useForm<TransactionForm>();

  const ModalHeader = useCallback(
    () => (
      <View style={styles.rowCenter}>
        <NetworkIcon networkId={networkId} size={32} />
        <SpacerRow size={3} />
        <BrandText>
          {variation === "deposit" ? "Deposit on" : "Withdraw from"}{" "}
          {getNetwork(networkId)?.displayName || "Unknown"}
        </BrandText>
      </View>
    ),
    [variation, networkId],
  );

  const maxAtomics =
    (variation === "withdraw"
      ? balances.find((bal) => bal.denom === ibcTargetCurrency?.denom)
      : balances.find((bal) => bal.denom === ibcTargetCurrency?.sourceDenom)
    )?.amount || "0";
  const max = Decimal.fromAtomics(
    maxAtomics,
    nativeTargetCurrency?.decimals || 0,
  ).toString();

  return (
    <ModalBase
      visible={isVisible}
      onClose={onClose}
      Header={ModalHeader}
      width={460}
    >
      <View style={styles.container}>
        <BrandText style={[fontSemibold14, styles.selfCenter]}>
          {capitalize(variation)} {nativeTargetCurrency?.displayName}
        </BrandText>
        <SpacerColumn size={1.5} />
        <View style={[styles.rowCenter, styles.w100, { zIndex: 2 }]}>
          <View style={[styles.jcCenter, { zIndex: 2, flex: 1 }]}>
            <View style={[styles.rowAllCenter, { zIndex: 2 }]}>
              <NetworkIcon size={64} networkId={sourceNetworkId || "unknown"} />
            </View>
            <SpacerColumn size={1.5} />
            <BrandText style={fontSemibold14}>
              From {sourceNetwork?.displayName || "Unknown"}
            </BrandText>
            <SpacerColumn size={1} />
            <TextInputCustom<TransactionForm>
              control={control}
              variant="labelOutside"
              name="fromAddress"
              label=""
              defaultValue={tinyAddress(fromAccount, 19)}
              rules={{ required: true }}
              disabled
            />
          </View>

          <SpacerRow size={1} />
          <View style={styles.arrow}>
            <SVG source={arrowDivideSVG} width={36} height={6} />
          </View>
          <SpacerRow size={1} />

          <View style={[styles.jcCenter, { flex: 1 }]}>
            <View style={[styles.rowAllCenter, { zIndex: 2 }]}>
              <NetworkIcon
                size={64}
                networkId={destinationNetworkId || "unknown"}
              />
            </View>
            <SpacerColumn size={1.5} />
            <BrandText style={fontSemibold14}>
              To {destinationNetwork?.displayName || "Unknown"}
            </BrandText>
            <SpacerColumn size={1} />
            <TextInputCustom<TransactionForm>
              control={control}
              variant="labelOutside"
              name="toAddress"
              defaultValue={tinyAddress(toAccount, 19)}
              label=""
              rules={{ required: true }}
              disabled
            />
          </View>
        </View>
        <SpacerColumn size={4} />
        {ibcTargetCurrency && (
          <TextInputCustom<TransactionForm>
            control={control}
            variant="labelOutside"
            label="Select Amount"
            name="amount"
            currency={keplrCurrencyFromNativeCurrencyInfo(nativeTargetCurrency)}
            rules={{ required: true, max }}
            placeHolder="0"
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
        )}
        <SpacerColumn size={4} />
        <BrandText style={styles.estimatedText}>
          Estimated Time: 20 Seconds
        </BrandText>
        <SpacerColumn size={1} />
        <PrimaryButton
          size="M"
          text={capitalize(variation)}
          fullWidth
          disabled={max === "0"}
          loader
          onPress={handleSubmit(async (formValues) => {
            try {
              const sender = fromAccount;
              if (!sender) {
                throw new Error("no sender");
              }

              const receiver = toAccount;
              if (!receiver) {
                throw new Error("no receiver");
              }

              if (!nativeTargetCurrency) {
                throw new Error("no native target currency");
              }

              if (!ibcTargetCurrency) {
                throw new Error("no target currency");
              }

              if (!sourceNetwork) {
                throw new Error("no source network");
              }

              if (!sourceNetworkId) {
                throw new Error("missing source network id");
              }

              if (!destinationNetworkId) {
                throw new Error("missing destination network id");
              }

              const denom =
                variation === "withdraw"
                  ? ibcTargetCurrency.denom
                  : ibcTargetCurrency.sourceDenom;

              if (!denom) {
                throw new Error("no source denom");
              }

              const amount = Decimal.fromUserInput(
                formValues.amount,
                nativeTargetCurrency.decimals,
              ).atomics;

              const timeoutSeconds = 30;

              const port =
                variation === "withdraw"
                  ? ibcTargetCurrency.destinationChannelPort
                  : ibcTargetCurrency.sourceChannelPort;

              const channelId =
                variation === "withdraw"
                  ? ibcTargetCurrency.destinationChannelId
                  : ibcTargetCurrency.sourceChannelId;

              const client =
                await getKeplrSigningStargateClient(sourceNetworkId);

              const tx = await client.sendIbcTokens(
                sender,
                receiver,
                { amount, denom },
                port,
                channelId,
                undefined,
                (Date.now() + timeoutSeconds * 1000) * 1000000,
                "auto",
              );

              if (isDeliverTxFailure(tx)) {
                console.error(variation, "tx failed", tx);
                setToastError({ title: "Transaction failed", message: "" });
              }

              // FIXME: find out if it's possible to check for ibc ack
            } catch (err) {
              console.error(variation, "failed", err);
              if (err instanceof Error) {
                setToastError({
                  title: "Failed to " + variation,
                  message: err.message,
                });
              }
            }

            onClose();
          })}
        />
      </View>
    </ModalBase>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  selfCenter: {
    alignSelf: "center",
  },
  w100: { width: "100%" },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftChevron: {
    position: "absolute",
    left: -(layout.spacing_x3 * 2),
  },
  rightChevron: {
    position: "absolute",
    right: -(layout.spacing_x3 * 2),
  },
  jcCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  rowAllCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  arrow: {
    alignSelf: "flex-start",
    marginTop: 64 / 2,
  },
  container: {
    paddingBottom: layout.spacing_x3,
  },
  estimatedText: StyleSheet.flatten([
    fontSemibold14,
    {
      color: neutral77,
    },
  ]),
});

const convertCosmosAddress = (
  sourceAddress: string | undefined,
  targetNetworkId: string | undefined,
) => {
  if (!sourceAddress) {
    return undefined;
  }
  const targetNetwork = getCosmosNetwork(targetNetworkId);
  if (!targetNetwork) {
    return undefined;
  }
  try {
    const decoded = bech32.decode(sourceAddress);
    return bech32.encode(targetNetwork.addressPrefix, decoded.words);
  } catch (err) {
    console.warn("failed to convert cosmos address", sourceAddress, err);
    return undefined;
  }
};
