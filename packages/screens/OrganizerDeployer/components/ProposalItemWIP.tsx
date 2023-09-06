import { capitalize } from "lodash";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import chevronRightSVG from "../../../../assets/icons/chevron-right.svg";
import proposalsSVG from "../../../../assets/icons/proposals.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { neutral17, neutral77, tulipTree } from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { MultiSigWalletTransactionProposalType } from "../../Multisig/types";

interface ProposalItemProps extends MultiSigWalletTransactionProposalType {
  onPress: () => void;
}

export const ProposalItemWIP: React.FC<ProposalItemProps> = ({
  type,
  count,
  onPress,
}) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.rowCenter}>
        <View style={styles.svgContainer}>
          <SVG
            source={proposalsSVG}
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
            Pending and declined requests
          </BrandText>
        </View>
      </View>
      <View style={styles.rowCenter}>
        <BrandText style={[fontSemibold13, { color: tulipTree }]}>
          {count}
        </BrandText>
        <SpacerRow size={2} />
        <SVG source={chevronRightSVG} width={16} height={16} />
        <SpacerRow size={1.5} />
      </View>
    </Pressable>
  );
};
// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    backgroundColor: neutral17,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  svgContainer: { padding: layout.spacing_x2 },
  rowCenter: { flexDirection: "row", alignItems: "center" },
});
