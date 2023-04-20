import { capitalize } from "lodash";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import stakedSVG from "../../../../assets/icons/staked.svg";
import transferSVG from "../../../../assets/icons/transfer.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { Separator } from "../../../components/Separator";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import { SecondaryButtonOutline } from "../../../components/buttons/SecondaryButtonOutline";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import {
  errorColor,
  neutral33,
  neutral55,
  neutral77,
  primaryColor,
  secondaryColor,
  transparentColor,
} from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { ProposalsTransactionType } from "../types";

interface ProposalTransactionItemProps extends ProposalsTransactionType {
  btnSquaresBackgroundColor?: string;
}

export const ProposalTransactionItem: React.FC<
  ProposalTransactionItemProps
> = ({
  id,
  type,
  createdAt,
  sending,
  createdBy,
  time,
  amount,
  networkFee,
  approvedRequired,
  approvedBy,
  approvers,
  btnSquaresBackgroundColor,
}) => {
  // variables
  const getIcon = useMemo(() => {
    switch (type) {
      case "transfer":
        return transferSVG;

      default:
      case "stake":
        return stakedSVG;
    }
  }, [type]);

  // returns
  return (
    <Pressable style={styles.container}>
      <View style={styles.svgContainer}>
        <SVG
          source={getIcon}
          style={{
            width: 32,
            height: 32,
          }}
        />
      </View>

      <View style={[styles.section, { flex: 0.75 }]}>
        <BrandText style={styles.normal}>{capitalize(type)}</BrandText>
        <SpacerColumn size={0.75} />
        <View style={styles.rowCenter}>
          <BrandText style={styles.small77}>{createdAt}</BrandText>
          <SpacerRow size={0.5} />
          <Separator horizontal />
          <SpacerRow size={0.5} />
          <BrandText style={styles.small77}>{time}</BrandText>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.rowCenter}>
          <BrandText style={styles.normal77}>Sending:</BrandText>
          <SpacerRow size={0.5} />
          <BrandText style={styles.normal}>{sending}</BrandText>
        </View>
        <SpacerColumn size={0.75} />
        <View style={styles.rowCenter}>
          <BrandText style={styles.normal77}>Created by:</BrandText>
          <SpacerRow size={0.5} />
          <BrandText style={styles.smallPrimary}>@{createdBy}</BrandText>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.rowCenter}>
          <BrandText style={styles.normal77}>Will receive:</BrandText>
          <SpacerRow size={0.5} />
          <BrandText style={styles.normal}>{amount} TORI</BrandText>
        </View>
        <SpacerColumn size={0.75} />
        <View style={styles.rowCenter}>
          <BrandText style={styles.normal77}>Network fee:</BrandText>
          <SpacerRow size={0.5} />
          <BrandText style={styles.small77}>{networkFee} TORI</BrandText>
        </View>
      </View>

      <View style={[styles.section, { flex: 1.5 }]}>
        <View style={styles.rowCenter}>
          <BrandText style={styles.normal77}>Approved by:</BrandText>
          <SpacerRow size={0.5} />
          <BrandText style={styles.normal}>{approvedBy}</BrandText>
          <SpacerRow size={0.5} />
          <BrandText style={styles.normal77}>of</BrandText>
          <SpacerRow size={0.5} />
          <BrandText style={styles.normal}>{approvers}</BrandText>
          <SpacerRow size={0.5} />
          <BrandText style={styles.normal77}>
            ({approvedRequired} required)
          </BrandText>
        </View>
        <SpacerColumn size={1.5} />
        <View style={styles.loadingOutside}>
          <View
            style={[
              styles.loadingInside,
              { width: `${(approvedBy / approvers) * 100}%` },
            ]}
          />
        </View>
      </View>

      <View style={styles.end}>
        <SecondaryButton
          text="Approve"
          size="M"
          squaresBackgroundColor={btnSquaresBackgroundColor}
        />
        <SpacerRow size={2} />
        <SecondaryButtonOutline
          text="Decline"
          size="M"
          squaresBackgroundColor={btnSquaresBackgroundColor}
          color={errorColor}
          borderColor={errorColor}
          backgroundColor={transparentColor}
        />
      </View>
    </Pressable>
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
  rowCenter: { flexDirection: "row", alignItems: "center" },
  end: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
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
