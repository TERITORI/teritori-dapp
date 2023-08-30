import { capitalize } from "lodash";
import React, { useCallback, useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import receivedSVG from "../../../../assets/icons/received.svg";
import stakedSVG from "../../../../assets/icons/staked.svg";
import transferedSVG from "../../../../assets/icons/transfer.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { SpacerColumn } from "../../../components/spacer";
import {
  errorColor,
  neutral33,
  neutral77,
  successColor,
} from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { MultiSigWalletTransactionBasicType } from "../../Multisig/types";

interface BasicTransactionItemProps
  extends MultiSigWalletTransactionBasicType {}

export const BasicTransactionItem: React.FC<BasicTransactionItemProps> = ({
  type,
  amount,
  createdAt,
}) => {
  const getIcon = useMemo(() => {
    switch (type) {
      case "received":
        return receivedSVG;

      case "staked":
        return stakedSVG;

      default:
        return transferedSVG;
    }
  }, [type]);

  // returns
  const RenderAmount = useCallback(() => {
    switch (type) {
      case "received":
        return (
          <BrandText style={[fontSemibold13, { color: successColor }]}>
            +${amount}
          </BrandText>
        );

      case "transfered":
        return (
          <BrandText style={[fontSemibold13, { color: errorColor }]}>
            -${amount}
          </BrandText>
        );

      default:
        return <BrandText style={[fontSemibold13]}>${amount}</BrandText>;
    }
  }, [amount, type]);

  return (
    <Pressable style={styles.container}>
      <View style={styles.rowCenter}>
        <View style={styles.svgContainer}>
          <SVG
            source={getIcon}
            style={{
              width: 32,
              height: 32,
            }}
          />
        </View>
        <View>
          <BrandText style={fontSemibold14}>{capitalize(type)}</BrandText>
          <SpacerColumn size={0.5} />
          <BrandText style={[fontSemibold13, { color: neutral77 }]}>
            {createdAt}
          </BrandText>
        </View>
      </View>
      <View style={styles.end}>
        <RenderAmount />
        <SpacerColumn size={0.5} />
        <BrandText style={[fontSemibold13, { color: neutral77 }]}>
          0.024535535 TORI
        </BrandText>
      </View>
    </Pressable>
  );
};
// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: neutral33,
  },
  svgContainer: { padding: layout.padding_x2 },
  rowCenter: { flexDirection: "row", alignItems: "center" },
  end: {
    alignItems: "flex-end",
  },
});
