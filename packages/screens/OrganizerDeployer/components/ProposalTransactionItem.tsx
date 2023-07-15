import { capitalize } from "lodash";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

import { ProposalTransactionModal } from "./ProposalTransactionModal";
import { TransactionItemButtons } from "./TransactionItemButtons";
import multisigWhiteSVG from "../../../../assets/icons/multisig_white.svg";
import { BrandText } from "../../../components/BrandText";
import { useCopyToClipboard } from "../../../components/CopyToClipboard";
import { SVG } from "../../../components/SVG";
import { Separator } from "../../../components/Separator";
import { AnimationFadeIn } from "../../../components/animations";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import {
  MultisigTransactionListType,
  useMultisigHelpers,
} from "../../../hooks/multisig";
import { useTNSMetadata } from "../../../hooks/useTNSMetadata";
import { DbSignature } from "../../../utils/faunaDB/multisig/types";
import {
  neutral17,
  neutral33,
  neutral55,
  neutral77,
  primaryColor,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { tinyAddress } from "../../../utils/text";
import { MultisigTransactionType } from "../../Multisig/types";

export interface ProposalTransactionItemProps
  extends MultisigTransactionListType {
  btnSquaresBackgroundColor?: string;
  isUserMultisig?: boolean;
  shouldRetch?: () => void;
}

export const ProposalTransactionItem: React.FC<ProposalTransactionItemProps> = (
  props
) => {
  const {
    type,
    msgs,
    createdAt,
    createdBy,
    signatures,
    decliners,
    recipientAddress,
    multisig,
    fee,
  } = props;
  const tnsMetadata = useTNSMetadata(createdBy);
  const [currentSignatures, setCurrentSignatures] = useState(
    signatures?.data || []
  );
  const [currentDecliners, setCurrentDecliners] = useState(decliners || []);
  const { coinSimplified } = useMultisigHelpers();
  const feeSimple = coinSimplified(fee.amount?.[0]);
  const { copyToClipboard } = useCopyToClipboard();
  const [isHovered, setHovered] = useState(false);
  const [isProposalModalVisible, setProposalModalVisible] = useState(false);

  const amount =
    type === MultisigTransactionType.STAKE
      ? coinSimplified(msgs[0].value.amount)
      : type === MultisigTransactionType.TRANSFER
      ? coinSimplified(msgs[0].value.amount)
      : { value: "", ticker: "" };
  const approvedByCount = currentSignatures?.length || 0;
  const approvalRequiredCount = parseInt(
    JSON.parse(multisig.pubkeyJSON)?.value.threshold || "0",
    10
  );
  const completedPercent =
    ((approvedByCount > approvalRequiredCount
      ? approvalRequiredCount
      : approvedByCount) /
      approvalRequiredCount) *
    100;
  const isCompletelyDeclined =
    (multisig.userAddresses?.length || 0) -
      approvedByCount -
      currentDecliners.length <
    approvalRequiredCount - approvedByCount;

  const getIcon = useMemo(() => {
    //TODO: Add white icons and use them for each TX type
    switch (type) {
      // case MultisigTransactionType.STAKE:
      //   return stakingWhiteSVG;
      default:
        return multisigWhiteSVG;
    }
  }, [type]);

  // hooks
  useEffect(() => {
    setCurrentSignatures(signatures?.data || []);
  }, [signatures?.data]);

  // functions
  const addSignature = (signature: DbSignature) => {
    setCurrentSignatures((prevState: DbSignature[]) => [
      ...prevState,
      signature,
    ]);
  };

  const addDecliner = (address: string) => {
    setCurrentDecliners((prevState) => [...prevState, address]);
  };

  // returns
  return (
    <>
      <CustomPressable
        onPress={() => setProposalModalVisible(true)}
        style={[styles.container, isHovered && { backgroundColor: neutral17 }]}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
      >
        <View style={styles.svgContainer}>
          <SVG source={getIcon} width={32} height={32} />
        </View>

        <View style={[styles.section, { flex: 0.75 }]}>
          <BrandText style={styles.normal}>{capitalize(type)}</BrandText>
          <SpacerColumn size={0.75} />
          <View style={styles.rowCenter}>
            <BrandText style={styles.small77}>
              {moment(createdAt).format("DD/MM/yyyy")}
            </BrandText>
            <SpacerRow size={0.5} />
            <Separator horizontal />
            <SpacerRow size={0.5} />
            <BrandText style={styles.small77}>
              {moment(createdAt).format("h:mm")}
            </BrandText>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.rowCenter}>
            <BrandText style={styles.normal77}>Sending to:</BrandText>
            <SpacerRow size={0.5} />
            <Pressable onPress={() => copyToClipboard(recipientAddress || "")}>
              <BrandText style={styles.normal}>
                {tinyAddress(recipientAddress, 14)}
              </BrandText>
            </Pressable>
          </View>
          <SpacerColumn size={0.75} />
          <View style={styles.rowCenter}>
            <BrandText style={styles.normal77}>Created by:</BrandText>
            <SpacerRow size={0.5} />
            {tnsMetadata.loading ? (
              <ActivityIndicator size="small" />
            ) : (
              <AnimationFadeIn>
                <Pressable
                  onPress={() =>
                    copyToClipboard(
                      tnsMetadata?.metadata?.tokenId || createdBy || ""
                    )
                  }
                >
                  <BrandText style={styles.smallPrimary}>
                    {tnsMetadata?.metadata?.tokenId
                      ? `@${tnsMetadata?.metadata?.tokenId}`
                      : tinyAddress(createdBy, 14)}
                  </BrandText>
                </Pressable>
              </AnimationFadeIn>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.rowCenter}>
            <BrandText style={styles.normal77}>Will receive:</BrandText>
            <SpacerRow size={0.5} />
            <BrandText style={styles.normal}>
              {amount?.value} {amount?.ticker}
            </BrandText>
          </View>
          <SpacerColumn size={0.75} />
          <View style={styles.rowCenter}>
            <BrandText style={styles.normal77}>Network fee:</BrandText>
            <SpacerRow size={0.5} />
            <BrandText style={styles.small77}>
              {feeSimple?.value} {feeSimple?.ticker}
            </BrandText>
          </View>
        </View>

        <View style={[styles.section, { flex: 1.5 }]}>
          <View style={styles.rowCenter}>
            <BrandText style={styles.normal77}>Approved by:</BrandText>
            <SpacerRow size={0.5} />
            <BrandText style={styles.normal}>{approvedByCount}</BrandText>
            <SpacerRow size={0.5} />
            <BrandText style={styles.normal77}>of</BrandText>
            <SpacerRow size={0.5} />
            <BrandText style={styles.normal}>{approvalRequiredCount}</BrandText>
            <SpacerRow size={0.5} />
            <BrandText style={styles.normal77}>
              ({approvalRequiredCount - approvedByCount} required)
            </BrandText>
          </View>
          <SpacerColumn size={1.5} />
          <View style={styles.loadingOutside}>
            <View
              style={[
                styles.loadingInside,
                {
                  width: `${completedPercent}%`,
                },
              ]}
            />
          </View>
        </View>

        <TransactionItemButtons
          {...props}
          currentDecliners={currentDecliners}
          currentSignatures={currentSignatures}
          addSignature={addSignature}
          addDecliner={addDecliner}
          isCompletedSignature={completedPercent === 100}
          isCompletelyDeclined={isCompletelyDeclined}
          btnSquaresBackgroundColor={
            isHovered ? neutral17 : props.btnSquaresBackgroundColor
          }
        />
      </CustomPressable>

      <ProposalTransactionModal
        visible={isProposalModalVisible}
        onClose={() => setProposalModalVisible(false)}
        transaction={props}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    borderBottomWidth: 1,
    borderColor: neutral33,
    flex: 1,
  },
  section: { flex: 1, paddingRight: layout.padding_x1_5 },
  svgContainer: { padding: layout.padding_x2 },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  normal77: StyleSheet.flatten([fontSemibold14, { color: neutral77 }]),
  small77: StyleSheet.flatten([fontSemibold13, { color: neutral77 }]),
  smallPrimary: StyleSheet.flatten([fontSemibold13, { color: primaryColor }]),
  normal: StyleSheet.flatten(fontSemibold14),
  small: StyleSheet.flatten(fontSemibold13),
  loadingOutside: {
    height: 6,
    width: 207,
    backgroundColor: neutral55,
  },
  loadingInside: {
    height: 6,
    backgroundColor: secondaryColor,
  },
});
