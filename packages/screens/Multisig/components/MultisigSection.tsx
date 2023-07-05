import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { ActivityIndicator } from "react-native-paper";

import walletSVG from "../../../../assets/icons/wallet-grey.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { SpacerRow } from "../../../components/spacer";
import {
  neutral33,
  neutral77,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

interface MultisigSectionProps {
  title: string;
  containerStyle?: ViewStyle;
  tresholdMax?: number;
  tresholdCurrentCount?: number;
  toriText?: boolean;
  isLoading?: boolean;
}

export const MultisigSection: React.FC<MultisigSectionProps> = ({
  title,
  containerStyle,
  children,
  tresholdCurrentCount,
  tresholdMax,
  toriText,
  isLoading,
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
        {!isLoading && tresholdMax && (
          <View style={styles.badge}>
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              Threshold: {tresholdCurrentCount}/{tresholdMax}
            </BrandText>
          </View>
        )}

        {!isLoading && toriText && (
          <View style={styles.badge}>
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              TORI
            </BrandText>
          </View>
        )}

        {isLoading && <ActivityIndicator color={secondaryColor} />}
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
  activityIndicator: { marginBottom: 10 },
});
