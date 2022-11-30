import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import walletSVG from "../../../../assets/icons/wallet-grey.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { SpacerRow } from "../../../components/spacer";
import { neutral33, neutral77, neutralA3 } from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

interface MultisigSectionProps {
  title: string;
  containerStyle?: ViewStyle;
  tresholdMax?: number;
  tresholdCurrentCount?: number;
  toriText?: boolean;
}

export const MultisigSection: React.FC<MultisigSectionProps> = ({
  title,
  containerStyle,
  children,
  tresholdCurrentCount,
  tresholdMax,
  toriText,
}) => {
  return (
    <View style={[styles.descriptionContainer, containerStyle]}>
      <View style={styles.descriptionHeader}>
        <View style={styles.rowCenter}>
          <SVG source={walletSVG} height={28} width={28} />
          <SpacerRow size={2} />
          <BrandText style={[fontSemibold16, { color: neutralA3 }]}>
            {title}
          </BrandText>
        </View>
        {tresholdMax && (
          <View style={styles.badge}>
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              Treshhold: {tresholdCurrentCount}/{tresholdMax}
            </BrandText>
          </View>
        )}

        {toriText && (
          <View style={styles.badge}>
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              TORI
            </BrandText>
          </View>
        )}
      </View>
      <View style={styles.descriptionFooter}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  descriptionContainer: {
    borderColor: neutral33,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: layout.padding_x3,
  },
  descriptionHeader: {
    margin: layout.padding_x2,
    marginTop: layout.padding_x1_5,
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 40,
    flexWrap: "wrap",
  },
  descriptionFooter: {
    padding: layout.padding_x2_5,
    paddingTop: 0,
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    padding: layout.padding_x1_5,
    borderWidth: 1,
    borderColor: neutral33,
    borderRadius: 10,
  },
});
